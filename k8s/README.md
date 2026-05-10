# Kubernetes deployment (high availability baseline)

This folder contains a Kubernetes baseline for higher availability than single-host Docker Compose:

- Multiple stateless app replicas (`backend`, `frontend`)
- Rolling updates with zero unavailable pods
- PodDisruptionBudget for voluntary node disruptions
- HorizontalPodAutoscaler for load spikes
- Readiness/liveness probes plus Kubernetes reconciliation for self-healing
- Ingress routing (`/api`, `/docs`, `/`)

## Important reality check

Kubernetes gives stronger availability for stateless services, but your data tier is still single-instance in this baseline (`postgres`, `redis`).
When a backend pod fails, Kubernetes does not “spawn a new server after failover” in the custom sense; the Deployment controller passively reconciles the replica count and starts a replacement pod so the desired number of replicas is maintained.
For truly high availability in production, move these to managed HA services (Azure Database for PostgreSQL Flexible Server + Azure Cache for Redis) or deploy clustered operators.

## Prerequisites

- A Kubernetes cluster (Minikube, Kind, AKS, etc.)
- `kubectl`
- Ingress controller installed (example: NGINX Ingress)

## 1. Build images

From repo root:

```powershell
# For Minikube local image usage:
minikube -p minikube docker-env --shell powershell | Invoke-Expression

docker build -t uit-se357-backend:latest ./server
docker build -t uit-se357-frontend:latest ./client
```

For cloud clusters, push these images to your container registry and update image names in `base/backend.yaml` and `base/frontend.yaml`.

## 2. Create secret from template

Copy and customize:

```powershell
Copy-Item .\k8s\base\secret.example.yaml .\k8s\base\secret.yaml
```

Update secret values in `secret.yaml`.

## 3. Deploy

```powershell
kubectl apply -f .\k8s\base\namespace.yaml
kubectl apply -f .\k8s\base\secret.yaml -n uit-se357
kubectl apply -k .\k8s\base
```

## 4. Run DB migration job once per release

```powershell
kubectl delete job db-migration -n uit-se357 --ignore-not-found
kubectl apply -f .\k8s\base\migration-job.yaml -n uit-se357
kubectl wait --for=condition=complete job/db-migration -n uit-se357 --timeout=120s
```

## 5. Access the app

Add to your hosts file:

- `127.0.0.1 uit-se357.local`

If using Minikube + NGINX Ingress:

```powershell
minikube addons enable ingress
minikube tunnel
```

Open:

- http://uit-se357.local

## Operations quick checks

```powershell
kubectl get pods -n uit-se357
kubectl get hpa -n uit-se357
kubectl describe pdb -n uit-se357
kubectl logs deploy/backend -n uit-se357
```
