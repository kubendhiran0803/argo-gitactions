variable "aws_region" {
  description = "AWS region for infra resources"
  type        = string
  default     = "ap-south-1"
}

variable "environment" {
  description = "Deployment environment"
  type        = string
  default     = "staging"
}

variable "project_name" {
  description = "Project identifier"
  type        = string
  default     = "eks-gitops"
}

variable "cluster_name" {
  description = "EKS cluster name"
  type        = string
  default     = "eks-gitops-staging"
}

variable "cluster_version" {
  description = "Kubernetes control plane version"
  type        = string
  default     = "1.30"
}

variable "enable_custom_domain" {
  description = "Enable Route53 Hosted Zone and ACM Certificate (set to true once you have a real registered domain)"
  type        = bool
  default     = false
}

variable "domain_name" {
  description = "Registered domain name for Route53 and ACM"
  type        = string
  default     = "kub-gitops.net"
}

variable "base_state_bucket" {
  description = "S3 bucket name where base layer state is stored"
  type        = string
  default     = "eks-gitops-tfstate-715844024336"
}

variable "base_state_key" {
  description = "S3 key for the base layer remote state"
  type        = string
  default     = "base/staging/terraform.tfstate"
}

variable "node_instance_types" {
  description = "EC2 instance types for EKS worker nodes"
  type        = list(string)
  default     = ["t3.small"]
}

variable "desired_nodes" {
  description = "Desired number of worker nodes"
  type        = number
  default     = 3
}

variable "min_nodes" {
  description = "Minimum number of worker nodes"
  type        = number
  default     = 1
}

variable "max_nodes" {
  description = "Maximum number of worker nodes"
  type        = number
  default     = 2
}

variable "ecr_repository_name" {
  description = "Name of the ECR repository for the sample application"
  type        = string
  default     = "eks-gitops-sample-app"
}

variable "argocd_chart_version" {
  description = "Version of the ArgoCD Helm chart"
  type        = string
  default     = "7.7.7"
}

variable "node_subnet_type" {
  description = "Subnet type for EKS worker nodes: 'private' (default, uses NAT Gateway for egress) or 'public' (places nodes in public subnets with public IPs for direct communication)"
  type        = string
  default     = "private"
  validation {
    condition     = contains(["private", "public"], var.node_subnet_type)
    error_message = "node_subnet_type must be either 'private' or 'public'."
  }
}

variable "ec2_ssh_key" {
  description = "EC2 Key Pair name for SSH access to EKS worker nodes"
  type        = string
  default     = "sample"
}

variable "cluster_endpoint_public_access_cidrs" {
  description = "List of CIDR blocks that can access the Amazon EKS public API server endpoint"
  type        = list(string)
  default     = ["0.0.0.0/0"]
}

