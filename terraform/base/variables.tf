variable "aws_region" {
  description = "AWS region for deployment"
  type        = string
  default     = "ap-south-1"
}

variable "environment" {
  description = "Deployment environment (e.g., staging, prod)"
  type        = string
  default     = "staging"
}

variable "project_name" {
  description = "Base project identifier"
  type        = string
  default     = "eks-gitops"
}

variable "vpc_cidr" {
  description = "CIDR block for the VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "availability_zones" {
  description = "Availability zones to place subnets across"
  type        = list(string)
  default     = ["ap-south-1a", "ap-south-1b"]
}

variable "public_subnet_cidrs" {
  description = "Public subnet CIDRs for Ingress and NAT GW"
  type        = list(string)
  default     = ["10.0.1.0/24", "10.0.2.0/24"]
}

variable "private_subnet_cidrs" {
  description = "Private subnet CIDRs for EKS Node Groups"
  type        = list(string)
  default     = ["10.0.10.0/24", "10.0.11.0/24"]
}

variable "enable_nat_gateway" {
  description = "Whether to provision NAT Gateway for private subnets egress"
  type        = bool
  default     = true
}
