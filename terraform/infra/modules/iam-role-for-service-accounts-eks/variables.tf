variable "role_name" {
  description = "Name of the IAM role to create"
  type        = string
}

variable "role_description" {
  description = "Description for the IAM role"
  type        = string
  default     = "IRSA role for EKS workloads"
}

variable "oidc_provider_arn" {
  description = "The ARN of the EKS OIDC Provider"
  type        = string
}

variable "oidc_provider_url" {
  description = "The URL of the EKS OIDC Provider (without https://)"
  type        = string
}

variable "service_account_namespace" {
  description = "Kubernetes namespace for the service account"
  type        = string
}

variable "service_account_name" {
  description = "Kubernetes service account name"
  type        = string
}

variable "policy_json" {
  description = "Custom JSON policy document to attach to this role"
  type        = string
  default     = ""
}

variable "managed_policy_arns" {
  description = "List of managed IAM policy ARNs to attach"
  type        = list(string)
  default     = []
}

variable "tags" {
  description = "Tags to assign to the IAM role"
  type        = map(string)
  default     = {}
}

