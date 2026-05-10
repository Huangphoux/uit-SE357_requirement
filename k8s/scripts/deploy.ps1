$ErrorActionPreference = "Stop"

Write-Host "Applying namespace..."
kubectl apply -f .\k8s\base\namespace.yaml

Write-Host "Applying app secret (requires k8s/base/secret.yaml)..."
kubectl apply -f .\k8s\base\secret.yaml -n uit-se357

Write-Host "Applying manifests..."
kubectl apply -k .\k8s\base

Write-Host "Running migration job..."
kubectl delete job db-migration -n uit-se357 --ignore-not-found
kubectl apply -f .\k8s\base\migration-job.yaml -n uit-se357
kubectl wait --for=condition=complete job/db-migration -n uit-se357 --timeout=120s

Write-Host "Deployment complete."
