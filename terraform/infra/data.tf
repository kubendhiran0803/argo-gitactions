data "aws_caller_identity" "current" {}

data "aws_partition" "current" {}

# Read remote state from Stage 1: base layer
data "terraform_remote_state" "base" {
  backend = "s3"
  config = {
    bucket = var.base_state_bucket
    key    = var.base_state_key
    region = var.aws_region
  }
}

# Dynamic cluster auth token for Helm & Kubernetes providers
data "aws_eks_cluster_auth" "this" {
  name = aws_eks_cluster.this.name
}

# TLS certificate for EKS OIDC provider thumbprint
data "tls_certificate" "eks" {
  url = aws_eks_cluster.this.identity[0].oidc[0].issuer
}

