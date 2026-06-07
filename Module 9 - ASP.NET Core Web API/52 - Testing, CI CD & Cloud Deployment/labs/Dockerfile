# STAGE 1: Build Environment
# TODO: Use mcr.microsoft.com/dotnet/sdk:10.0-alpine as the build image
FROM mcr.microsoft.com/dotnet/sdk:10.0-alpine AS build
WORKDIR /src

# Install clang and native dependencies needed for AOT compiling on alpine linux
RUN apk add --no-cache clang build-base zlib-dev

# Copy project files and restore dependencies
COPY ["ShopAPI.csproj", "./"]
RUN dotnet restore "ShopAPI.csproj"

# Copy remaining source code and publish the project targeting linux-musl-x64
COPY . .
RUN dotnet publish "ShopAPI.csproj" -c Release -r linux-musl-x64 -o /app/publish /p:PublishAot=true

# STAGE 2: Runtime Environment
# TODO: Use mcr.microsoft.com/dotnet/runtime-deps:10.0-alpine as the base image for runtime
FROM mcr.microsoft.com/dotnet/runtime-deps:10.0-alpine AS final
WORKDIR /app

# Run as non-root user for security best practices
RUN adduser --disabled-password \
  --home /app \
  --gecos '' dotnetuser && chown -R dotnetuser /app
USER dotnetuser

EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080

# Copy output from build stage
COPY --from=build /app/publish .

# Run the self-contained native executable
ENTRYPOINT ["./ShopAPI"]
