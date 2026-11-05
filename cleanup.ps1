# ==============================================================================
# One-Click Clean-Up Script (Stage 7 Cost Management)
# ==============================================================================
$ErrorActionPreference = "Continue"

Write-Host "==========================================================" -ForegroundColor Red
Write-Host "⚠️ Starting Automated Clean-Up (Stage 7)" -ForegroundColor Red
Write-Host "==========================================================" -ForegroundColor Red

# 1. Delete Ingress and ArgoCD Root App to release the AWS ALB
Write-Host "`n[Step 1/3] Deleting Ingress and Root Application..." -ForegroundColor Yellow
kubectl delete -f gitops/apps/sample-app/ingress.yaml --ignore-not-found=true
kubectl delete -f gitops/root-app.yaml --ignore-not-found=true

Write-Host "Waiting 60 seconds for AWS Load Balancer Controller to delete ALB from AWS..." -ForegroundColor Cyan
Start-Sleep -Seconds 60

# 2. Destroy infra layer
Write-Host "`n[Step 2/3] Destroying Platform Layer (terraform/infra)..." -ForegroundColor Yellow
Set-Location -Path "terraform/infra"
terraform destroy -auto-approve
Set-Location -Path "../.."

# 3. Destroy base layer
Write-Host "`n[Step 3/3] Destroying Network Layer (terraform/base)..." -ForegroundColor Yellow
Set-Location -Path "terraform/base"
terraform destroy -auto-approve
Set-Location -Path "../.."

Write-Host "`n==========================================================" -ForegroundColor Green
Write-Host "✅ CLEAN-UP COMPLETED. All AWS resources safely destroyed." -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Green
