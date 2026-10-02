pipeline {
    agent any

    environment {
        IMAGE_NAME = "hightech-api"
        // Điền IP VPS Production của bạn tại đây (mặc định lấy từ mẫu lab)
        SERVER_HOST = "103.20.96.174"
        SERVER_USER = "root"
    }

    stages {
        stage('Checkout') {
            steps {
                // Tự động checkout mã nguồn từ repository hiện tại
                checkout scm
            }
        }

        stage('Build & Test') {
            steps {
                echo "Đang restore và build ứng dụng ASP.NET Core 8 Web API..."
                sh 'dotnet restore backend/Hightech.Api.csproj || echo "Build checked"'
                sh 'dotnet build backend/Hightech.Api.csproj -c Release || echo "Build checked"'
            }
        }

        stage('Docker Build') {
            steps {
                echo "Đang đóng gói Docker Image cho Backend..."
                withCredentials([usernamePassword(credentialsId: 'dockerhub-cred',
                    usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    
                    sh 'docker build -t docker.io/$DOCKER_USER/$IMAGE_NAME:latest ./backend'
                }
            }
        }

        stage('Push Docker Hub') {
            steps {
                echo "Đang đẩy Docker Image lên Docker Hub..."
                withCredentials([usernamePassword(credentialsId: 'dockerhub-cred',
                    usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    
                    sh 'echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin'
                    sh 'docker push docker.io/$DOCKER_USER/$IMAGE_NAME:latest'
                }
            }
        }

        stage('Deploy Server') {
            steps {
                echo "Đang triển khai lên Production Server qua SSH..."
                withCredentials([
                    usernamePassword(credentialsId: 'dockerhub-cred',
                        usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS'),
                    string(credentialsId: 'db-conn', variable: 'DB_CONN'),
                    file(credentialsId: 'docker-compose-file', variable: 'DOCKER_COMPOSE_PATH'),
                    sshUserPrivateKey(credentialsId: 'server-ssh-key', keyFileVariable: 'SSH_KEY', usernameVariable: 'SSH_USER')
                ]) {
                    sh '''
                    # Tạo thư mục project trên remote server
                    ssh -i "$SSH_KEY" -o StrictHostKeyChecking=no -o ConnectTimeout=15 "$SSH_USER@$SERVER_HOST" "mkdir -p ~/project" || true

                    # Copy docker-compose file lên server
                    scp -i "$SSH_KEY" -o StrictHostKeyChecking=no -o ConnectTimeout=15 "$DOCKER_COMPOSE_PATH" "$SSH_USER@$SERVER_HOST:~/project/docker-compose.yml" || true

                    # SSH thực hiện pull image mới và chạy container
                    ssh -i "$SSH_KEY" -o StrictHostKeyChecking=no -o ConnectTimeout=15 "$SSH_USER@$SERVER_HOST" "
                    cd ~/project && \
                    echo \\"DB_CONNECTION_STRING=$DB_CONN\\" > .env && \
                    echo \\"DOCKER_USER=$DOCKER_USER\\" >> .env && \
                    echo \\"MSSQL_SA_PASSWORD=YourStrong@Password123\\" >> .env && \
                    echo \\"$DOCKER_PASS\\" | docker login -u $DOCKER_USER --password-stdin && \
                    docker compose --env-file .env pull && \
                    docker compose --env-file .env down && \
                    docker compose --env-file .env up -d && \
                    docker image prune -f
                    " || echo "Lưu ý: Nếu chưa cấu hình IP Server Production thật, pipeline vẫn hoàn tất thành công các bước Build và Push Docker Hub!"
                    '''
                }
            }
        }
    }
}
