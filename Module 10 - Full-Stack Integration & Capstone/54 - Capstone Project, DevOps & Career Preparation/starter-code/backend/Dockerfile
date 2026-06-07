# Stage 1: Build the application using the official .NET 10 SDK image
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# TODO: Copy csproj and restore dependencies
COPY ["ShopAPI.csproj", "./"]
RUN dotnet restore "ShopAPI.csproj"

# Copy the remaining source files and build
COPY . .
RUN dotnet build "ShopAPI.csproj" -c Release -o /app/build

# Publish the application to a release folder
RUN dotnet publish "ShopAPI.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Stage 2: Create a runtime image with the lightweight ASP.NET 10 environment
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
EXPOSE 80
EXPOSE 443

# Copy published binaries from build stage
COPY --from=build /app/publish .

# Configure environment variables
ENV ASPNETCORE_ENVIRONMENT=Production
ENV ASPNETCORE_URLS=http://+:80

# Execute the application DLL
ENTRYPOINT ["dotnet", "ShopAPI.dll"]
