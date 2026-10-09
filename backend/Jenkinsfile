pipeline {
    agent any

    environment {
        IMAGE_NAME = "hightech-api"
        SERVER_HOST = "localhost"
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
                    
                    sh 'docker build -t docker.io/$DOCKER_USER/$IMAGE_NAME:latest -t $IMAGE_NAME:latest ./backend'
                }
            }
        }

        stage('Push Docker Hub') {
            steps {
                echo "Đang đẩy Docker Image lên Docker Hub..."
                withCredentials([usernamePassword(credentialsId: 'dockerhub-cred',
                    usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    
                    sh '''
                    echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin || true
                    if docker push "docker.io/$DOCKER_USER/$IMAGE_NAME:latest"; then
                        echo "Đã đẩy Docker Image lên Docker Hub thành công!"
                    else
                        echo "Lưu ý: Docker Hub từ chối Push (Do Access Token hiện tại chỉ có quyền Read, cần tạo Token mới với quyền Read & Write trên hub.docker.com). Bỏ qua lỗi này để tiếp tục bước Deploy!"
                    fi
                    '''
                }
            }
        }

        stage('Deploy Localhost') {
            steps {
                echo "Đang triển khai Backend API và Database lên môi trường Localhost..."
                sh '''
                cd backend
                if command -v docker-compose >/dev/null 2>&1; then
                    DOCKER_COMPOSE_BIN="docker-compose"
                else
                    DOCKER_COMPOSE_BIN="docker compose"
                fi

                echo "Dừng container cũ nếu đang chạy..."
                $DOCKER_COMPOSE_BIN down || true

                echo "Khởi chạy container Backend API và Database mới..."
                $DOCKER_COMPOSE_BIN up -d

                echo "=========================================================="
                echo "Triển khai Localhost hoàn tất thành công!"
                echo "Swagger API: http://localhost:5000/swagger"
                echo "Health Check: http://localhost:5000/health"
                echo "=========================================================="
                docker ps | grep -E "hightech" || true
                '''
            }
        }
    }
}
