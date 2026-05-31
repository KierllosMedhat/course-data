// TESTING, CI/CD & CLOUD DEPLOYMENT — Lecture 46

// ==========================================
// 1. xUnit UNIT TESTING (Services)
// ==========================================
/*
using Xunit;
using Moq; // For mocking dependencies

public class CalculatorServiceTests
{
    private readonly CalculatorService _sut; // System Under Test

    public CalculatorServiceTests()
    {
        _sut = new CalculatorService();
    }

    [Fact]
    public void Add_GivenTwoNumbers_ReturnsCorrectSum()
    {
        // Arrange
        int a = 5;
        int b = 10;

        // Act
        int result = _sut.Add(a, b);

        // Assert
        Assert.Equal(15, result);
    }
}
*/

// ==========================================
// 2. INTEGRATION TESTING (API Endpoints)
// ==========================================
/*
using Microsoft.AspNetCore.Mvc.Testing;
using Xunit;

// Requires: dotnet add package Microsoft.AspNetCore.Mvc.Testing
public class ProductsApiTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly HttpClient _client;

    public ProductsApiTests(WebApplicationFactory<Program> factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task GetProducts_ReturnsSuccessStatusCode()
    {
        // Act
        var response = await _client.GetAsync("/api/products");

        // Assert
        response.EnsureSuccessStatusCode(); // Status Code 200-299
        Assert.Equal("application/json; charset=utf-8", response.Content.Headers.ContentType.ToString());
    }
}
*/

// ==========================================
// 3. GITHUB ACTIONS (CI/CD Pipeline)
// ==========================================
/*
name: .NET CI Pipeline

on:
  push:
    branches: [ "main" ]
  pull_request:
    branches: [ "main" ]

jobs:
  build-and-test:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v3
    
    - name: Setup .NET
      uses: actions/setup-dotnet@v3
      with:
        dotnet-version: 10.0.x
        
    - name: Restore dependencies
      run: dotnet restore
      
    - name: Build
      run: dotnet build --no-restore --configuration Release
      
    - name: Test
      run: dotnet test --no-build --verbosity normal
*/
