module "vpc" {
  source = "./modules/VPC"

  vpc_cidr             = var.vpc_cidr
  availability_zones   = var.availability_zones
  public_subnet_cidrs  = var.public_subnet_cidrs
  private_subnet_cidrs = var.private_subnet_cidrs
  cluster_name         = local.cluster_name
  enable_nat_gateway   = var.enable_nat_gateway
  tags                 = local.common_tags
}

module "security_group" {
  source = "./modules/SecurityGroup"

  name        = "${local.cluster_name}-base-sg"
  vpc_id      = module.vpc.vpc_id
  environment = var.environment
  tags        = local.common_tags
}
