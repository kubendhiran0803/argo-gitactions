variable "name" {
  description = "Name for the security group"
  type        = string
  default     = "eks-gitops-base-sg"
}

variable "vpc_id" {
  description = "VPC ID where the security group is created"
  type        = string
}

variable "environment" {
  description = "Deployment environment"
  type        = string
  default     = "staging"
}

variable "tags" {
  description = "Tags to attach to the security group"
  type        = map(string)
  default     = {}
}
