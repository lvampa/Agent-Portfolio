resource "aws_ecs_cluster" "this" {
  name = "${var.project_name}-cluster"
}

# ECS Tasks
resource "aws_ecs_task_definition" "n8n" {
  family                   = "${var.project_name}-task"
  network_mode             = "bridge"
  requires_compatibilities = ["EC2"]
  cpu                      = "256"
  memory                   = "512"

  container_definitions = jsonencode([
    {
      name         = "n8n"
      image        = "n8nio/n8n:latest"
      essential    = true
      portMappings = [{ containerPort = 5678, hostPort = 5678 }]
      environment = [
        { name = "N8N_BASIC_AUTH_ACTIVE", value = "true" },
        { name = "N8N_BASIC_AUTH_USER", value = "admin" },
        { name = "N8N_BASIC_AUTH_PASSWORD", value = "changeme" },
        { name = "N8N_ENCRYPTION_KEY", value = "some-long-random-key" },
        { name = "GENERIC_TIMEZONE", value = "America/New_York" }
      ]
      mountPoints = [{
        sourceVolume  = "n8n_data"
        containerPath = "/home/node/.n8n"
      }]
    }
  ])

  volume {
    name = "n8n_data"
    efs_volume_configuration {
      file_system_id = var.efs_id
    }
  }
}


# ECS
resource "aws_ecs_service" "n8n" {
  name            = "${var.project_name}-service"
  cluster         = aws_ecs_cluster.this.id
  task_definition = aws_ecs_task_definition.n8n.arn
  desired_count   = 1
  launch_type     = "EC2"
}

# EC2 Instance for Containers
resource "aws_launch_configuration" "ecs_lc" {
  name                 = "${var.project_name}-lc"
  image_id             = data.aws_ami.ecs_ami.id
  instance_type        = "t2.micro"
  security_groups      = [aws_security_group.ecs_sg.id]
  iam_instance_profile = aws_iam_instance_profile.ecs_profile.name
  user_data            = <<EOF
#!/bin/bash
echo ECS_CLUSTER=${aws_ecs_cluster.this.name} >> /etc/ecs/ecs.config
EOF
}

resource "aws_autoscaling_group" "ecs_asg" {
  desired_capacity     = 1
  max_size             = 1
  min_size             = 1
  vpc_zone_identifier  = var.subnet_ids
  launch_configuration = aws_launch_configuration.ecs_lc.id
}

# IAM

resource "aws_iam_role" "ecs_iam" {
  name = "${var.project_name}-ecs-instance-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect = "Allow"
      Principal = {
        Service = "ec2.amazonaws.com"
      }
      Action = "sts:AssumeRole"
    }]
  })
}

resource "aws_iam_role_policy_attachment" "ecs_policy_attach" {
  role       = aws_iam_role.ecs_iam.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonEC2ContainerServiceforEC2Role"
}

resource "aws_iam_instance_profile" "ecs_profile" {
  name = "${var.project_name}-ecs-instance-profile"
  role = aws_iam_role.ecs_iam.name
}

# Data
data "aws_ami" "ecs_ami" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["amzn2-ami-ecs-hvm-*-x86_64-ebs"]
  }

  filter {
    name   = "state"
    values = ["available"]
  }
}
