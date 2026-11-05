resource "aws_internet_gateway" "this" {
  vpc_id = aws_vpc.this.id

  tags = merge(
    var.tags,
    {
      Name = "${var.cluster_name}-igw"
    }
  )
}

# Elastic IP for single NAT Gateway (cost-optimized for lab / staging)
resource "aws_eip" "nat" {
  count  = var.enable_nat_gateway ? 1 : 0
  domain = "vpc"

  tags = merge(
    var.tags,
    {
      Name = "${var.cluster_name}-nat-eip"
    }
  )

  depends_on = [aws_internet_gateway.this]
}

# NAT Gateway located in the first public subnet
resource "aws_nat_gateway" "this" {
  count         = var.enable_nat_gateway ? 1 : 0
  allocation_id = aws_eip.nat[0].id
  subnet_id     = aws_subnet.public[0].id

  tags = merge(
    var.tags,
    {
      Name = "${var.cluster_name}-nat"
    }
  )

  depends_on = [aws_internet_gateway.this]
}
