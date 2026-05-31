# Lab 2: Docker & AOT

1. Add `<PublishAot>true</PublishAot>` to your `.csproj`.
2. Create a Dockerfile using the `alpine` images for AOT.
3. Build it: `docker build -t myapi .`
4. Run it: `docker run -p 8080:8080 myapi`
5. Test it using Postman or Swagger!
