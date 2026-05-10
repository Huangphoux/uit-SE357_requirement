const fs = require('fs');
const https = require('https');
const redis = require('redis');

const LOCK_KEY = process.env.LEADER_LOCK_KEY || 'backend-leader-lock';
const LOCK_TTL = parseInt(process.env.LEADER_LOCK_TTL || '15000', 10); // ms
const NAMESPACE = process.env.NAMESPACE || 'uit-se357';
const ENDPOINTS_NAME = process.env.ENDPOINTS_NAME || 'primary-backend';
const SERVICE_PORT = parseInt(process.env.SERVICE_PORT || '8000', 10);
const POD_NAME = process.env.POD_NAME;
const POD_IP = process.env.POD_IP;
const REDIS_HOST = process.env.REDIS_HOST || 'redis';
const REDIS_PORT = process.env.REDIS_PORT || '6379';

if (!POD_NAME || !POD_IP) {
  console.error('POD_NAME or POD_IP not set; leader-elector requires downward API envs');
  process.exit(1);
}

const redisUrl = `redis://${REDIS_HOST}:${REDIS_PORT}`;
const client = redis.createClient({ url: redisUrl });

async function kubePutEndpoints(ip) {
  try {
    const token = fs.readFileSync('/var/run/secrets/kubernetes.io/serviceaccount/token', 'utf8');
    const ca = fs.readFileSync('/var/run/secrets/kubernetes.io/serviceaccount/ca.crt');
    const host = process.env.KUBERNETES_SERVICE_HOST;
    const port = process.env.KUBERNETES_SERVICE_PORT || '443';
    const body = JSON.stringify({
      metadata: { name: ENDPOINTS_NAME },
      subsets: [
        {
          addresses: [{ ip }],
          ports: [{ port: SERVICE_PORT, name: 'http' }],
        },
      ],
    });

    const options = {
      hostname: host,
      port: port,
      path: `/api/v1/namespaces/${NAMESPACE}/endpoints/${ENDPOINTS_NAME}`,
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
      },
      ca: ca,
      rejectUnauthorized: true,
    };

    await new Promise((resolve, reject) => {
      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            console.log('Endpoints updated to', ip);
            resolve();
          } else {
            console.error('Failed to update endpoints', res.statusCode, data);
            reject(new Error('kube api error'));
          }
        });
      });
      req.on('error', (err) => reject(err));
      req.write(body);
      req.end();
    });
  } catch (err) {
    console.error('kubePutEndpoints error', err);
  }
}

async function run() {
  await client.connect();
  console.log('leader-elector connected to redis', redisUrl);

  let amLeader = false;

  while (true) {
    try {
      // Try to acquire lock
      const res = await client.set(LOCK_KEY, POD_NAME, { NX: true, PX: LOCK_TTL });
      if (res === 'OK') {
        if (!amLeader) {
          console.log('Acquired leadership');
          amLeader = true;
          await kubePutEndpoints(POD_IP);
        } else {
          // renewed leadership
        }
        // keep renewing by setting with XX
        await client.set(LOCK_KEY, POD_NAME, { XX: true, PX: LOCK_TTL });
      } else {
        // Check if we are current owner and renew
        const owner = await client.get(LOCK_KEY);
        if (owner === POD_NAME) {
          // renew
          await client.set(LOCK_KEY, POD_NAME, { XX: true, PX: LOCK_TTL });
          if (!amLeader) {
            amLeader = true;
            console.log('Regained leadership (owner)');
            await kubePutEndpoints(POD_IP);
          }
        } else {
          if (amLeader) {
            console.log('Lost leadership, owner=', owner);
            amLeader = false;
          }
        }
      }
    } catch (err) {
      console.error('leader-elector loop error', err);
    }

    // Sleep for a fraction of TTL
    await new Promise((r) => setTimeout(r, Math.max(1000, Math.floor(LOCK_TTL / 3))));
  }
}

run().catch((e) => {
  console.error('leader-elector failed', e);
  process.exit(1);
});
