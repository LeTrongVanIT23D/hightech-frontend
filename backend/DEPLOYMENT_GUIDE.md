# HƯỚNG DẪN CHI TIẾT TRIỂN KHAI CI/CD: JENKINS + DOCKER + GITHUB
## DỰ ÁN HIGHTECH SPORTS (ASP.NET CORE 8/9 WEB API + SQL SERVER)

Tài liệu này được biên soạn bám sát theo tài liệu hướng dẫn của Giảng viên, được tùy biến chính xác cho hệ thống Backend của **HIGHTECH Sports**.

---

## 1. YÊU CẦU CÀI ĐẶT & CHUẨN BỊ

### 1.1 Hệ điều hành & Phần cứng
* **OS**: Ubuntu Server 22.04 LTS (khuyến nghị).
* **RAM**: Tối thiểu 2GB (tốt nhất là 4GB vì Microsoft SQL Server yêu cầu tối thiểu ~2GB RAM).
* **Ổ cứng (Disk)**: $\ge$ 30GB.

### 1.2 Tài khoản & Công cụ cần chuẩn bị
1. **GitHub**: Repository chứa mã nguồn (`hightech-backend` hoặc repo hiện tại của bạn `LeTrongVanIT23D/hightech-frontend`).
2. **Docker Hub**: Tài khoản để lưu trữ image (Token PAT của bạn: `dckr_pat_AZLGORsaq6LidAN4H0bON5L5FpQ`).
3. **Server Production**: VPS Ubuntu nơi chạy ứng dụng.
4. **Jenkins Server**: Có thể cài cùng trên VPS production hoặc tách riêng.

### 1.3 Mở Port trên Firewall VPS (UFW / Security Group)
Mở các cổng sau:
* **Port 22**: SSH kết nối từ xa.
* **Port 8080**: Giao diện quản trị Jenkins.
* **Port 5000 / 86**: Cổng Backend API.
* **Port 3000**: Cổng Frontend Next.js (nếu deploy cùng).
* **Port 1433**: SQL Server (chỉ nên cho phép nội bộ Docker hoặc IP tin cậy).

Lệnh mở nhanh trên Ubuntu:
```bash
sudo ufw allow 22/tcp
sudo ufw allow 8080/tcp
sudo ufw allow 5000/tcp
sudo ufw allow 3000/tcp
sudo ufw reload
```

---

## 2. CÀI ĐẶT JENKINS TRÊN UBUNTU

Chạy lần lượt các lệnh sau trên terminal của VPS:

```bash
# 1. Update hệ thống
sudo apt update && sudo apt upgrade -y

# 2. Cài Java (Jenkins yêu cầu Java 17 hoặc 21)
sudo apt install -y fontconfig openjdk-21-jre

# 3. Thêm key và repo Jenkins
sudo mkdir -p /etc/apt/keyrings
sudo wget -O /etc/apt/keyrings/jenkins-keyring.asc \
  https://pkg.jenkins.io/debian-stable/jenkins.io-2023.key
echo "deb [signed-by=/etc/apt/keyrings/jenkins-keyring.asc]" \
  https://pkg.jenkins.io/debian-stable binary/ | sudo tee \
  /etc/apt/sources.list.d/jenkins.list > /dev/null

# 4. Cài đặt Jenkins
sudo apt update
sudo apt install -y jenkins

# 5. Khởi động và bật tự chạy khi boot
sudo systemctl enable jenkins
sudo systemctl start jenkins
```

### 2.2 Đăng nhập Jenkins lần đầu
1. Mở trình duyệt truy cập: `http://<IP_SERVER>:8080`
2. Lấy mật khẩu quản trị ban đầu:
   ```bash
   sudo cat /var/lib/jenkins/secrets/initialAdminPassword
   ```
3. Dán mật khẩu vào web, chọn **Install suggested plugins**.
4. Tạo tài khoản Admin mới và hoàn tất wizard.

---

## 3. CÀI ĐẶT DOCKER & DOCKER COMPOSE

Trên VPS, chạy các lệnh:

```bash
# 1. Cài đặt Docker Engine chính thức
sudo apt-get update
sudo apt-get install -y ca-certificates curl gnupg
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "${UBUNTU_CODENAME:-$VERSION_CODENAME}") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# 2. Phân quyền chạy Docker cho user hiện tại và Jenkins
sudo usermod -aG docker $USER
sudo usermod -aG docker jenkins
sudo systemctl restart jenkins

# 3. Cài đặt .NET 8 SDK trên Jenkins Server (để chạy dotnet build stage)
sudo apt-get install -y dotnet-sdk-8.0

# 4. Kiểm tra hoạt động
docker run --rm hello-world
docker compose version
```

---

## 4. CẤU HÌNH CREDENTIALS TRONG JENKINS

Vào **Dashboard** $\rightarrow$ **Manage Jenkins** $\rightarrow$ **Credentials** $\rightarrow$ **System** $\rightarrow$ **Global credentials (unrestricted)** $\rightarrow$ Bấm **Add Credentials**.

Tạo 5 credentials quan trọng sau:

| ID Credential | Loại (Kind) | Dữ liệu nhập vào |
|---|---|---|
| `github-pat` | **Username with password** | - Username: Tên tài khoản GitHub của bạn<br>- Password: Token PAT GitHub (Scope: `repo`, `admin:repo_hook`) |
| `dockerhub-cred` | **Username with password** | - Username: Tài khoản Docker Hub<br>- Password: Token Access Token (ví dụ: `dckr_pat_AZLGORsaq6LidAN4H0bON5L5FpQ`) |
| `server-ssh-key` | **SSH Username with private key** | - Username: `root` (hoặc `ubuntu`)<br>- Private Key: Dán toàn bộ nội dung file private key `id_rsa` của server |
| `db-conn` | **Secret text** | Dán chuỗi kết nối:<br>`Server=db,1433;Database=HightechDb;User Id=sa;Password=YourStrong@Password123;TrustServerCertificate=True;MultipleActiveResultSets=true;` |
| `docker-compose-file` | **Secret file** | Chọn upload file [`docker-compose.prod.yml`](./docker-compose.prod.yml) |

---

## 5. THIẾT LẬP SSH KEY VÀ THƯ MỤC PRODUCTION SERVER

Trên máy chạy Jenkins (nếu Jenkins nằm khác server với Production):
```bash
# 1. Sinh SSH key nếu chưa có
ssh-keygen -t rsa -b 4096 -N "" -f ~/.ssh/id_rsa

# 2. Copy public key sang Production Server
ssh-copy-id root@<IP_PRODUCTION_SERVER>

# 3. Tạo sẵn thư mục triển khai trên Production Server
ssh root@<IP_PRODUCTION_SERVER> "mkdir -p ~/project"
```
*(Nếu Jenkins và Production nằm trên cùng 1 VPS, bạn copy key vào chính `~/.ssh/authorized_keys` của máy đó).*

---

## 6. KẾT NỐI GITHUB WEBHOOK

1. Truy cập vào Repository trên GitHub $\rightarrow$ **Settings** $\rightarrow$ **Webhooks** $\rightarrow$ Bấm **Add webhook**.
2. **Payload URL**: `http://<IP_JENKINS_SERVER>:8080/github-webhook/` *(bắt buộc phải có dấu gạch chéo `/` ở cuối)*.
3. **Content type**: `application/json`.
4. **Which events would you like to trigger this webhook?**: Chọn `Just the push event`.
5. Bấm **Add webhook**.

---

## 7. TẠO JENKINS PIPELINE JOB

1. Vào Jenkins $\rightarrow$ **New Item**.
2. Đặt tên Job: `HIGHTECH-BACKEND-CICD`.
3. Chọn kiểu: **Pipeline** $\rightarrow$ Bấm **OK**.
4. Tại mục **Build Triggers**: Tích chọn `GitHub hook trigger for GITScm polling`.
5. Tại mục **Pipeline**:
   * **Definition**: Chọn `Pipeline script from SCM`.
   * **SCM**: Chọn `Git`.
   * **Repositories URL**: Link repo của bạn (ví dụ `https://github.com/LeTrongVanIT23D/hightech-frontend.git`).
   * **Credentials**: Chọn `github-pat`.
   * **Branch Specifier**: `*/main` (hoặc `*/master`).
   * **Script Path**: `backend/Jenkinsfile` (nếu đặt trong thư mục backend) hoặc `Jenkinsfile`.
6. Bấm **Save**.

---

## 8. CHẠY VÀ KIỂM TRA PIPELINE

1. Bấm **Build Now** trên Jenkins để chạy thử nghiệm lần đầu, hoặc thực hiện 1 commit và `git push` lên GitHub để Webhook tự động kích hoạt.
2. Theo dõi tiến trình qua giao diện **Stage View**:
   * `Checkout` $\rightarrow$ `Build & Test` $\rightarrow$ `Docker Build` $\rightarrow$ `Push Docker Hub` $\rightarrow$ `Deploy Server`.
3. Khi Deploy hoàn tất:
   * Mở terminal server kiểm tra container đang chạy:
     ```bash
     docker ps
     ```
     Bạn sẽ thấy 2 container đang chạy: `hightech-api` và `hightech-db`.
   * Mở trình duyệt kiểm tra Swagger API:
     `http://<IP_SERVER>:5000/swagger`
   * Kiểm tra health check:
     `http://<IP_SERVER>:5000/health`

---

## 9. HƯỚNG DẪN TEST CHẠY THỬ TRÊN MÁY LOCAL (WINDOWS / DOCKER DESKTOP)

Nếu bạn muốn kiểm tra toàn bộ API và Database trên máy tính trước khi đẩy lên VPS:

```bash
# 1. Di chuyển vào thư mục backend
cd backend

# 2. Khởi chạy SQL Server và Web API bằng Docker Compose
docker compose up --build -d

# 3. Kiểm tra container
docker ps

# 4. Mở trình duyệt kiểm tra Swagger
# http://localhost:5000/swagger
```
Dữ liệu mẫu 8 sản phẩm thể thao, các voucher và tài khoản Admin (`admin@hightech.vn` / `admin123`) sẽ được tự động seed sẵn ngay khi khởi động!
