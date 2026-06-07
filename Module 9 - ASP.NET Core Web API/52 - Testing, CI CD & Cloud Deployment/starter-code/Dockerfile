# STAGE 1: Build Environment
# TODO: Choose alpine-based sdk image for building (e.g. mcr.microsoft.com/dotnet/sdk:10.0-alpine)
FROM mcr.microsoft.com/dotnet/sdk:10.0-alpine AS build
WORKDIR /src

# TODO: Install alpine build dependencies for native compilation
RUN apk add --no-cache clang build-base zlib-dev

# TODO: Restore NuGet dependencies
COPY ["ShopAPI/ShopAPI.csproj", "ShopAPI/"]
RUN dotnet restore "ShopAPI/ShopAPI.csproj"

# TODO: Copy code and publish AOT binaries
COPY . .
WORKDIR "/src/ShopAPI"
RUN dotnet publish "ShopAPI.csproj" -c Release -r linux-musl-x64 -o /app/publish /p:PublishAot=true

# STAGE 2: Runtime Environment
# TODO: Use runtime-deps as the base runtime image (e.g. mcr.microsoft.com/dotnet/runtime-deps:10.0-alpine)
FROM mcr.microsoft.com/dotnet/runtime-deps:10.0-alpine AS final
WORKDIR /app

# Non-root user setup
RUN adduser --disabled-password \
  --home /app \
  --gecos '' dotnetuser && chown -R dotnetuser /app
USER dotnetuser

EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080

# TODO: Copy compiled publish files from the build stage
COPY --from=build /app/publish .

# TODO: Define the native binary entrypoint
ENTRYPOINT ["./ShopAPI"]
