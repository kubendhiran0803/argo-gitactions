output "vpc_id" {
  description = "The ID of the provisioned VPC"
  value       = module.vpc.vpc_id
}

output "vpc_cidr_block" {
  description = "The CIDR block of the VPC"
  value       = module.vpc.vpc_cidr_block
}

output "public_subnet_ids" {
  description = "List of public subnet IDs for ALB and Ingress"
  value       = module.vpc.public_subnet_ids
}

output "private_subnet_ids" {
  description = "List of private subnet IDs for EKS Node Groups"
  value       = module.vpc.private_subnet_ids
}

output "security_group_id" {
  description = "The ID of the base security group"
  value       = module.security_group.security_group_id
}

output "cluster_name" {
  description = "Cluster name configured for Kubernetes tags"
  value       = local.cluster_name
}

output "aws_region" {
  description = "AWS region used for base resources"
  value       = var.aws_region
}
