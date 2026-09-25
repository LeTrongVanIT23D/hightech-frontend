# ==========================================
# Multi-stage Dockerfile cho ASP.NET Core 8 Web API
# ==========================================

# Stage 1: Build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy project file & restore dependencies
COPY Hightech.Api.csproj ./
RUN dotnet restore Hightech.Api.csproj

# Copy toàn bộ mã nguồn & build Release
COPY . .
RUN dotnet publish Hightech.Api.csproj -c Release -o /app/publish /p:UseAppHost=false

# Stage 2: Runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app

COPY --from=build /app/publish .

ENV ASPNETCORE_URLS=http://+:86
ENV DOTNET_RUNNING_IN_CONTAINER=true
ENV DOTNET_SYSTEM_GLOBALIZATION_INVARIANT=1

# Dọn dẹp file không cần thiết
RUN find /app -name "*.pdb" -delete 2>/dev/null || true && \
    find /app -name "*.xml" -delete 2>/dev/null || true

EXPOSE 86

# Khởi chạy ứng dụng
ENTRYPOINT ["dotnet", "Hightech.Api.dll"]
