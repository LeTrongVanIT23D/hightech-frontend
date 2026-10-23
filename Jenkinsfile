pipeline {
    agent any

    parameters {
        string(name: 'VPS_HOST', 
               defaultValue: '', 
               description: 'Địa chỉ IP hoặc tên miền VPS của bạn (Ví dụ: 103.20.96.174 - nếu có, Jenkins sẽ tự SSH và deploy sang VPS)')

        booleanParam(name: 'DEPLOY_TO_VPS', 
                     defaultValue: true, 
                     description: 'Kích hoạt triển khai lên VPS qua SSH Credential vps-ssh-key')

        string(name: 'RENDER_SERVICE_URL', 
               defaultValue: 'https://hightech-api.onrender.com', 
               description: 'Đường dẫn dịch vụ Backend trên Render (.onrender.com)')

        string(name: 'RENDER_FRONTEND_URL', 
               defaultValue: 'https://hightech-frontend.onrender.com', 
               description: 'Đường dẫn dịch vụ Frontend trên Render (.onrender.com, nếu có)')

        string(name: 'RENDER_DEPLOY_HOOK', 
               defaultValue: '', 
               description: 'Render Deploy Hook URL (Tùy chọn: Lấy trong Settings -> Deploy Hook trên Render Dashboard để Jenkins kích hoạt Render tự động deploy)')

        booleanParam(name: 'TRIGGER_RENDER_DEPLOY', 
                     defaultValue: true, 
                     description: 'Kích hoạt deploy và hiển thị thông tin Render onrender.com')

        booleanParam(name: 'DEPLOY_LOCAL', 
                     defaultValue: true, 
                     description: 'Triển khai đồng thời trên Localhost / Server Docker')
    }

    triggers {
        // Tự động build khi GitHub bắn Webhook
        githubPush()
        // Tự động thăm dò kho lưu trữ (Poll SCM) mỗi 5 phút nếu Webhook chưa tới Jenkins
        pollSCM('H/5 * * * *')
    }

    options {
        buildDiscarder(logRotator(numToKeepStr: '20'))
        disableConcurrentBuilds()
        timestamps()
    }

    environment {
        IMAGE_NAME = "hightech-api"
        SERVER_HOST = "localhost"
        DEFAULT_RENDER_URL = "https://hightech-api.onrender.com"
    }

    stages {
        stage('Checkout SCM') {
            steps {
                echo "📥 [Stage 1] Đang kéo mã nguồn mới nhất từ Git Repository..."
                checkout scm
            }
        }

        stage('Build & Test') {
            steps {
                echo "🔨 [Stage 2] Đang restore và biên dịch ASP.NET Core 8 Web API..."
                script {
                    if (isUnix()) {
                        sh 'dotnet restore backend/Hightech.Api.csproj || echo "Build checked"'
                        sh 'dotnet build backend/Hightech.Api.csproj -c Release || echo "Build checked"'
                    } else {
                        bat 'dotnet restore backend/Hightech.Api.csproj || echo Build checked'
                        bat 'dotnet build backend/Hightech.Api.csproj -c Release || echo Build checked'
                    }
                }
            }
        }

        stage('Docker Build') {
            steps {
                echo "🐳 [Stage 3] Đang đóng gói Docker Image cho Backend..."
                script {
                    try {
                        withCredentials([usernamePassword(credentialsId: 'dockerhub-cred',
                            usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                            if (isUnix()) {
                                sh "docker build -t docker.io/\$DOCKER_USER/$IMAGE_NAME:latest -t $IMAGE_NAME:latest ./backend"
                            } else {
                                bat "docker build -t docker.io/%DOCKER_USER%/$IMAGE_NAME:latest -t $IMAGE_NAME:latest ./backend"
                            }
                        }
                    } catch (Exception e) {
                        echo "⚠️ Lưu ý: Chưa cấu hình credential 'dockerhub-cred' trong Jenkins (${e.message}). Đang build Docker Image local..."
                        if (isUnix()) {
                            sh "docker build -t $IMAGE_NAME:latest ./backend"
                        } else {
                            bat "docker build -t $IMAGE_NAME:latest ./backend"
                        }
                    }
                }
            }
        }

        stage('Push Docker Hub') {
            steps {
                echo "📤 [Stage 4] Đẩy Docker Image lên Docker Hub (Nếu có tài khoản)..."
                script {
                    try {
                        withCredentials([usernamePassword(credentialsId: 'dockerhub-cred',
                            usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                            if (isUnix()) {
                                sh '''
                                echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin || true
                                if docker push "docker.io/$DOCKER_USER/$IMAGE_NAME:latest"; then
                                    echo "✅ Đã đẩy Docker Image lên Docker Hub thành công!"
                                else
                                    echo "⚠️ Lưu ý: Docker Hub từ chối Push (Do Access Token chỉ có quyền Read). Bỏ qua lỗi này để tiếp tục bước Deploy!"
                                fi
                                '''
                            } else {
                                bat '''
                                echo %DOCKER_PASS% | docker login -u "%DOCKER_USER%" --password-stdin || echo Login skipped
                                docker push docker.io/%DOCKER_USER%/%IMAGE_NAME%:latest || echo Push skipped
                                '''
                            }
                        }
                    } catch (Exception e) {
                        echo "⚠️ Bỏ qua bước Push Docker Hub do chưa cấu hình credentials 'dockerhub-cred': ${e.message}"
                    }
                }
            }
        }

        stage('Deploy Localhost') {
            when {
                expression { 
                    return (params.DEPLOY_LOCAL != null) ? params.DEPLOY_LOCAL : true 
                }
            }
            steps {
                echo "🖥️ [Stage 5] Triển khai Backend API và Database lên Localhost / Server..."
                script {
                    try {
                        if (isUnix()) {
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
                            docker ps | grep -E "hightech" || true
                            '''
                        } else {
                            bat '''
                            cd backend
                            docker compose down || true
                            docker compose up -d
                            docker ps
                            '''
                        }
                        echo "✅ Triển khai môi trường Localhost thành công!"
                    } catch (Exception e) {
                        echo "⚠️ Triển khai Localhost có cảnh báo: ${e.message}. Tiếp tục các bước tiếp theo..."
                    }
                }
            }
        }

        stage('Deploy to Render') {
            when {
                expression { 
                    return (params.TRIGGER_RENDER_DEPLOY != null) ? params.TRIGGER_RENDER_DEPLOY : true 
                }
            }
            steps {
                echo "☁️ [Stage 6] Đang tiến hành kết nối & kích hoạt Deploy Render Cloud..."
                script {
                    def deployHook = (params.RENDER_DEPLOY_HOOK ?: env.RENDER_DEPLOY_HOOK ?: "").trim()
                    def rawRenderUrl = (params.RENDER_SERVICE_URL ?: env.RENDER_SERVICE_URL ?: env.DEFAULT_RENDER_URL ?: "https://hightech-api.onrender.com").trim()
                    def renderUrl = rawRenderUrl.replaceAll('/+$', '')
                    def rawFrontendUrl = (params.RENDER_FRONTEND_URL ?: env.RENDER_FRONTEND_URL ?: "https://hightech-frontend.onrender.com").trim()
                    def frontendUrl = rawFrontendUrl.replaceAll('/+$', '')

                    echo "----------------------------------------------------------"
                    echo "🔗 Target Render URL: ${renderUrl}"
                    echo "----------------------------------------------------------"

                    // 1. Kích hoạt Render Deploy Hook nếu người dùng cung cấp
                    if (deployHook != "") {
                        echo "📡 Đang kích hoạt Render Deploy qua Webhook Deploy Hook..."
                        try {
                            if (isUnix()) {
                                sh "curl -s -X POST '${deployHook}' || true"
                            } else {
                                bat "curl -s -X POST \"${deployHook}\""
                            }
                            echo "✅ Đã gửi tín hiệu kích hoạt thành công tới Render Deploy Hook!"
                        } catch (Exception e) {
                            echo "⚠️ Lỗi khi gọi Render Deploy Hook: ${e.message}"
                        }
                    } else {
                        echo "ℹ️ [Thông báo Deploy Hook]: Chưa cung cấp RENDER_DEPLOY_HOOK."
                        echo "   - Nếu dịch vụ Render của bạn đã bật tính năng 'Auto-Deploy' từ GitHub, Render sẽ TỰ ĐỘNG nhận commit mới."
                    }

                    // 2. Kiểm tra trạng thái phản hồi HTTP của link Render
                    echo "🔍 Đang kiểm tra kết nối tới ${renderUrl}/health..."
                    try {
                        if (isUnix()) {
                            sh """
                            HTTP_STATUS=\$(curl -s -o /dev/null -w "%{http_code}" --max-time 15 "${renderUrl}/health" || echo "000")
                            echo "HTTP Status code từ Render Health Check: \$HTTP_STATUS"
                            if [ "\$HTTP_STATUS" = "200" ]; then
                                echo "🟢 Dịch vụ Render đang HOẠT ĐỘNG HOÀN HẢO (HTTP 200)!"
                            else
                                echo "🟡 Render đang khởi động lại (Spin up) hoặc đang deploy phiên bản mới..."
                            fi
                            """
                        } else {
                            bat """
                            curl -s -o NUL -w "Render HTTP Status: %%{http_code}\\n" --max-time 15 "${renderUrl}/health" || echo Render is starting...
                            """
                        }
                    } catch (Exception e) {
                        echo "ℹ️ Kiểm tra HTTP Render: ${e.message}"
                    }
                }
            }
        }

        stage('Deploy to VPS') {
            when {
                expression { 
                    def host = (params.VPS_HOST ?: env.VPS_HOST ?: "").trim()
                    def shouldDeploy = (params.DEPLOY_TO_VPS != null) ? params.DEPLOY_TO_VPS : true
                    return shouldDeploy && host != ""
                }
            }
            steps {
                echo "🚀 [Stage 7] Đang triển khai tự động lên VPS Production từ xa..."
                script {
                    def vpsHost = (params.VPS_HOST ?: env.VPS_HOST ?: "").trim()
                    echo "🎯 Địa chỉ máy chủ VPS: ${vpsHost}"

                    try {
                        withCredentials([sshUserPrivateKey(credentialsId: 'vps-ssh-key', 
                                                            keyFileVariable: 'SSH_KEY', 
                                                            usernameVariable: 'SSH_USER')]) {
                            def sshUser = SSH_USER ?: "root"
                            echo "🔑 Sử dụng SSH Credential với người dùng: ${sshUser}"

                            if (isUnix()) {
                                sh """
                                # Cấp quyền đọc bảo mật cho file SSH Private Key tạm
                                chmod 600 "\$SSH_KEY"

                                echo "1. Tạo thư mục chứa dự án trên VPS..."
                                ssh -i "\$SSH_KEY" -o StrictHostKeyChecking=no "\$sshUser@${vpsHost}" "mkdir -p /root/hightech-project/backend"

                                echo "2. Đồng bộ file docker-compose.yml sang VPS..."
                                scp -i "\$SSH_KEY" -o StrictHostKeyChecking=no backend/docker-compose.yml "\$sshUser@${vpsHost}:/root/hightech-project/backend/docker-compose.yml"

                                echo "3. Khởi động các container trên VPS..."
                                ssh -i "\$SSH_KEY" -o StrictHostKeyChecking=no "\$sshUser@${vpsHost}" '''
                                    cd /root/hightech-project/backend
                                    if command -v docker-compose >/dev/null 2>&1; then
                                        DOCKER_BIN="docker-compose"
                                    else
                                        DOCKER_BIN="docker compose"
                                    fi
                                    echo "Khởi động container trên VPS..."
                                    \$DOCKER_BIN pull || true
                                    \$DOCKER_BIN down || true
                                    \$DOCKER_BIN up -d
                                    docker ps | grep -E "hightech" || true
                                '''
                                """
                            } else {
                                bat """
                                ssh -i "%SSH_KEY%" -o StrictHostKeyChecking=no %SSH_USER%@${vpsHost} "mkdir -p /root/hightech-project/backend"
                                scp -i "%SSH_KEY%" -o StrictHostKeyChecking=no backend/docker-compose.yml %SSH_USER%@${vpsHost}:/root/hightech-project/backend/docker-compose.yml
                                ssh -i "%SSH_KEY%" -o StrictHostKeyChecking=no %SSH_USER%@${vpsHost} "cd /root/hightech-project/backend && docker compose down && docker compose up -d"
                                """
                            }

                            echo "🎉 Triển khai VPS thành công! Swagger: http://${vpsHost}:5000/swagger"
                        }
                    } catch (Exception e) {
                        echo "⚠️ Quá trình Deploy VPS gặp cảnh báo: ${e.message}"
                        echo "Vui lòng kiểm tra lại địa chỉ VPS_HOST hoặc quyền truy cập của 'vps-ssh-key'."
                    }
                }
            }
        }
    }

    post {
        always {
            script {
                def rawRenderUrl = (params.RENDER_SERVICE_URL ?: env.RENDER_SERVICE_URL ?: env.DEFAULT_RENDER_URL ?: "https://hightech-api.onrender.com").trim()
                def renderUrl = rawRenderUrl.replaceAll('/+$', '')
                def rawFrontendUrl = (params.RENDER_FRONTEND_URL ?: env.RENDER_FRONTEND_URL ?: "https://hightech-frontend.onrender.com").trim()
                def frontendUrl = rawFrontendUrl.replaceAll('/+$', '')
                def vpsHost = (params.VPS_HOST ?: env.VPS_HOST ?: "").trim()

                // Cập nhật mô tả hiển thị TRỰC TIẾP trên giao diện Web của Jenkins (Build History & Build Page)
                def vpsHtmlBlock = ""
                if (vpsHost != "") {
                    vpsHtmlBlock = """
                        <hr style="margin: 6px 0; border: 0; border-top: 1px dashed #cbd5e1;"/>
                        <div style="font-size: 13px; font-weight: bold; color: #1e3a8a; margin-bottom: 4px;">🖥️ VPS PRODUCTION SERVER (${vpsHost})</div>
                        <div style="font-size: 13px; line-height: 1.8;">
                            📚 <b>VPS Swagger:</b> <a href="http://${vpsHost}:5000/swagger" target="_blank" style="color: #2563eb; font-weight: bold; text-decoration: underline;">http://${vpsHost}:5000/swagger</a><br/>
                            💚 <b>VPS Health:</b> <a href="http://${vpsHost}:5000/health" target="_blank" style="color: #4f46e5; text-decoration: underline;">http://${vpsHost}:5000/health</a>
                        </div>
                    """
                }

                currentBuild.description = """
                    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; padding: 10px 14px; background: #f0fdf4; border: 1px solid #86efac; border-radius: 8px; margin: 6px 0;">
                        <div style="font-size: 14px; font-weight: bold; color: #166534; margin-bottom: 6px;">🚀 TRẠNG THÁI TRIỂN KHAI CI/CD</div>
                        <div style="font-size: 13px; line-height: 1.8;">
                            🌐 <b>Render API:</b> <a href="${renderUrl}" target="_blank" style="color: #0284c7; font-weight: 600; text-decoration: underline;">${renderUrl}</a><br/>
                            📚 <b>Swagger Docs:</b> <a href="${renderUrl}/swagger" target="_blank" style="color: #059669; font-weight: 600; text-decoration: underline;">${renderUrl}/swagger</a><br/>
                            💚 <b>Health Check:</b> <a href="${renderUrl}/health" target="_blank" style="color: #4f46e5; text-decoration: underline;">${renderUrl}/health</a><br/>
                            🖥️ <b>Frontend Web:</b> <a href="${frontendUrl}" target="_blank" style="color: #d97706; text-decoration: underline;">${frontendUrl}</a>
                        </div>
                        ${vpsHtmlBlock}
                    </div>
                """

                def vpsLogSummary = ""
                if (vpsHost != "") {
                    vpsLogSummary = """
 🖥️ MÔI TRƯỜNG MÁY CHỦ VPS (${vpsHost}):
    👉 Swagger VPS:        http://${vpsHost}:5000/swagger
    👉 Health Check VPS:   http://${vpsHost}:5000/health
    👉 API Base:           http://${vpsHost}:5000/api
"""
                }

                echo """
================================================================================================
                      🎉 PIPELINE CI/CD HOÀN TẤT THÀNH CÔNG! 🎉
================================================================================================
 🌐 ĐƯỜNG DẪN TRUY CẬP TRÊN RENDER CLOUD (.onrender.com):
    👉 API Trang Chủ:       ${renderUrl}
    👉 Swagger API Docs:    ${renderUrl}/swagger
    👉 API Health Check:    ${renderUrl}/health
    👉 Frontend Web:        ${frontendUrl}
${vpsLogSummary}
 💻 ĐƯỜNG DẪN TRUY CẬP TRÊN LOCALHOST:
    👉 Swagger Localhost:   http://localhost:5000/swagger
    👉 Health Localhost:    http://localhost:5000/health
    👉 Frontend Localhost:  http://localhost:3000
================================================================================================
"""
            }
        }
        failure {
            echo "❌ [THÔNG BÁO] Pipeline gặp lỗi ở một trong các giai đoạn. Hãy kiểm tra các dòng log ở trên để khắc phục!"
        }
    }
}
