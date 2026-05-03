# ADR-001: Caddy as Reverse Proxy, Load Balancer & TLS Terminator

**Status:** Accepted  
**Date:** 2026-05-02  
**ASR:** ASR-PERF-01, ASR-AVAIL-01, ASR-AVAIL-02, ASR-SEC-06, ASR-FILE-01  

---

## Context

The LMS must satisfy several interrelated quality requirements simultaneously:

- **500 concurrent users with < 2 s response time** (ASR-PERF-01)  
- **99.9 % uptime 24/7** (ASR-AVAIL-01) with automatic failover  
- **Planned maintenance windows** without full downtime (ASR-AVAIL-02)  
- **100 % HTTPS/TLS** for all client communication (ASR-SEC-06)  
- **500 concurrent file downloads** (ASR-FILE-01)  

A single backend process cannot fulfil the availability and throughput requirements on its own.  
An infrastructure layer is needed to:

1. Terminate TLS so backend processes handle only HTTP.  
2. Distribute traffic across multiple backend instances.  
3. Detect unhealthy instances and remove them from rotation automatically.  
4. Serve pre-built static assets (the compiled React SPA) without involving Node.js.  
5. Compress responses to reduce bandwidth (gzip/zstd).  

---

## Decision

**Use Caddy 2 as the single entry-point** for all inbound traffic.  
Caddy is responsible for:

| Responsibility | Caddy Configuration |
|---------------|---------------------|
| TLS termination | `tls internal` (dev); ACME (prod) |
| HTTP → HTTPS redirect | `redir https://…{uri} permanent` |
| Response compression | `encode gzip zstd` |
| Active/passive load balancing | `reverse_proxy backend-primary:8000 backend-secondary:8000 { lb_policy first }` |
| API health checking | `health_uri /api/health`, `health_interval 10s` |
| Static SPA serving | `root * /srv; file_server` with SPA fallback to `index.html` |

Two identical Node.js API containers (`backend-primary`, `backend-secondary`) run in Docker.  
Caddy uses `lb_policy first` (active/passive): all traffic flows to `backend-primary`; on health-check failure Caddy automatically promotes `backend-secondary`.

---

## Consequences

### Positive

- Single point of TLS management; backend containers remain plain HTTP.  
- Automatic failover satisfies ASR-AVAIL-01 without application-level changes.  
- Serving the SPA from Caddy removes file-download pressure from the Node.js process (ASR-FILE-01).  
- `encode gzip zstd` reduces payload sizes, improving perceived performance (ASR-PERF-01).  
- Maintenance mode: drain `backend-primary`, perform maintenance, restore—Caddy transparently routes via `backend-secondary` (ASR-AVAIL-02).  

### Negative / Trade-offs

- Adds an infrastructure component to operate and monitor.  
- `lb_policy first` means only one backend is active at a time; for true active-active, the policy must be changed to `round_robin` and session stickiness considered.  
- All traffic passes through Caddy; it is a single point of failure unless Caddy itself is clustered (not addressed in the current scope).  

---

## Alternatives Considered

| Alternative | Reason Rejected |
|-------------|----------------|
| **Nginx** | More configuration complexity for TLS auto-renewal; no built-in ACME. |
| **AWS ALB / cloud LB** | Introduces cloud vendor dependency; out of scope for Docker Compose deployment. |
| **Single backend** | Cannot satisfy 99.9 % uptime (ASR-AVAIL-01) or handle 500 concurrent users with failover. |
