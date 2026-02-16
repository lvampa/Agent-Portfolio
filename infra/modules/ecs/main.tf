# ECS cluster for n8n
resource "aws_ecs_cluster" "this" {
  name = "${var.project_name}-cluster"
}

# Task execution role: ECR pull, CloudWatch logs
resource "aws_iam_role" "ecs_execution" {
  name = "${var.project_name}-ecs-execution"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect = "Allow"
      Principal = { Service = "ecs-tasks.amazonaws.com" }
      Action   = "sts:AssumeRole"
    }]
  })
}

resource "aws_iam_role_policy_attachment" "ecs_execution" {
  role       = aws_iam_role.ecs_execution.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

# Host volume: certs written by EC2 user_data at /opt/certs. Caddyfile is generated in-container so we
# don't depend on host /opt/n8n being ready when the task starts.
resource "aws_ecs_task_definition" "n8n" {
  family                   = "${var.project_name}-n8n"
  network_mode             = "bridge"
  requires_compatibilities = ["EC2"]
  cpu                      = "512"
  memory                   = "768"
  execution_role_arn       = aws_iam_role.ecs_execution.arn

  volume {
    name      = "certs"
    host_path = "/opt/certs"
  }

  container_definitions = jsonencode([
    {
      name          = "caddy"
      image         = "caddy:2-alpine"
      user          = "0" # root so container can bind to port 443 (privileged port)
      essential     = true
      portMappings  = [{ containerPort = 443, hostPort = 443, protocol = "tcp" }]
      command = [
        "/bin/sh",
        "-c",
        "cat > /etc/caddy/Caddyfile <<'EOF'\n:443 {\n  reverse_proxy n8n:5678\n}\nEOF\nexec caddy run --config /etc/caddy/Caddyfile"
      ]
      mountPoints = [
        { sourceVolume = "certs", containerPath = "/opt/certs", readOnly = true }
      ]
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = aws_cloudwatch_log_group.caddy.name
          "awslogs-region"        = var.aws_region
          "awslogs-stream-prefix" = "caddy"
        }
      }
      dependsOn = [{ containerName = "n8n", condition = "START" }]
    },
    {
      name          = "n8n"
      image         = "n8nio/n8n:latest"
      essential     = true
      portMappings  = [{ containerPort = 5678, hostPort = 5678, protocol = "tcp" }]
      environment = [
        { name = "N8N_BASIC_AUTH_ACTIVE", value = tostring(var.n8n_basic_auth_active) },
        { name = "N8N_BASIC_AUTH_USER", value = var.n8n_basic_auth_user },
        { name = "N8N_BASIC_AUTH_PASSWORD", value = var.n8n_basic_auth_password },
        { name = "N8N_ENCRYPTION_KEY", value = var.n8n_encryption_key },
        { name = "GENERIC_TIMEZONE", value = var.n8n_timezone }
      ]
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = aws_cloudwatch_log_group.n8n.name
          "awslogs-region"        = var.aws_region
          "awslogs-stream-prefix" = "n8n"
        }
      }
    }
  ])
}

resource "aws_cloudwatch_log_group" "n8n" {
  name              = "/ecs/${var.project_name}-n8n"
  retention_in_days = 7
}

resource "aws_cloudwatch_log_group" "caddy" {
  name              = "/ecs/${var.project_name}-caddy"
  retention_in_days  = 7
}

# ECS service: one task with Caddy (443) + n8n (5678); Caddy terminates TLS and proxies to n8n (no ALB)
# With bridge network mode, task uses host network stack; no network_configuration (awsvpc-only).
resource "aws_ecs_service" "n8n" {
  name            = "${var.project_name}-n8n"
  cluster         = aws_ecs_cluster.this.id
  task_definition = aws_ecs_task_definition.n8n.arn
  desired_count   = 1
  launch_type     = "EC2"
}
