resource "helm_release" "argocd" {
  name             = "argocd"
  repository       = "https://argoproj.github.io/argo-helm"
  chart            = "argo-cd"
  version          = var.argocd_chart_version
  namespace        = "argocd"
  create_namespace = true

  values = [
    file("${path.module}/charts/argocd/envs/staging/values.yaml")
  ]

  # Ensure worker nodes exist and are ready before deploying ArgoCD
  depends_on = [
    aws_eks_node_group.this
  ]
}
