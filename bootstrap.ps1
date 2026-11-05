# ==============================================================================
# One-Click Local Bootstrap Script (Stages 1 through 4 Unified)
# ==============================================================================
$ErrorActionPreference = "Stop"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "🚀 Starting Automated Bootstrap (Stages 1 to 4)" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

# ------------------------------------------------------------------------------
# Stage 1: Base Network Layer (VPC, Subnets, NAT GW, Security Groups)
# ------------------------------------------------------------------------------
Write-Host "`n[Stage 1/4] Provisioning Network Layer (terraform/base)..." -ForegroundColor Yellow
Set-Location -Path "terraform/base"

terraform init -backend-config=backend-staging.hcl
terraform apply -auto-approve

if ($LASTEXITCODE -ne 0) {
    Write-Error "Stage 1 failed! Aborting."
    exit $LASTEXITCODE
}
Write-Host "✅ Stage 1 complete! Base network is ready." -ForegroundColor Green
Set-Location -Path "../.."

# ------------------------------------------------------------------------------
# Stage 2 & 3: Platform Layer (EKS, ECR, Route 53, ACM, IRSA, ArgoCD Helm)
# ------------------------------------------------------------------------------
Write-Host "`n[Stage 2 & 3/4] Provisioning Platform Layer & ArgoCD (terraform/infra)..." -ForegroundColor Yellow
Set-Location -Path "terraform/infra"

if (-not (Test-Path "terraform.tfvars")) {
    if (Test-Path "terraform.tfvars.example") {
        Write-Host "Copying terraform.tfvars.example to terraform.tfvars..." -ForegroundColor Cyan
        Copy-Item "terraform.tfvars.example" "terraform.tfvars"
    }
}

terraform init -backend-config=backend-staging.hcl
terraform apply -auto-approve

if ($LASTEXITCODE -ne 0) {
    Write-Error "Stage 2/3 failed! Aborting."
    exit $LASTEXITCODE
}
Write-Host "✅ Stage 2 & 3 complete! EKS cluster and ArgoCD are running." -ForegroundColor Green

# ------------------------------------------------------------------------------
# Stage 4: Connect kubectl and Bootstrap GitOps Root App
# ------------------------------------------------------------------------------
Write-Host "`n[Stage 4/4] Connecting kubectl and bootstrapping ArgoCD Root App..." -ForegroundColor Yellow
Set-Location -Path "../.."

aws eks update-kubeconfig --region ap-south-1 --name eks-gitops-staging

Write-Host "Waiting for ArgoCD server deployment..." -ForegroundColor Cyan
kubectl wait --for=condition=available deployment/argocd-server -n argocd --timeout=300s

Write-Host "Applying gitops/root-app.yaml..." -ForegroundColor Cyan
kubectl apply -f gitops/root-app.yaml

Write-Host "`n==========================================================" -ForegroundColor Green
Write-Host "🎉 ALL STAGES 1 TO 4 COMPLETED SUCCESSFULLY!" -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Green
Write-Host "ArgoCD is now watching your repository and syncing:"
Write-Host "  1. AWS Load Balancer Controller"
Write-Host "  2. ExternalDNS"
Write-Host "  3. Sample Application (Aura Focus App)"
