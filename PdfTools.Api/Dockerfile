# Use the official ASP.NET Core runtime image
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

# Use the SDK image for building
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src
COPY ["PdfTools.Api/PdfTools.Api.csproj", "PdfTools.Api/"]
RUN dotnet restore "PdfTools.Api/PdfTools.Api.csproj"
COPY . .
WORKDIR "/src/PdfTools.Api"
RUN dotnet build "PdfTools.Api.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "PdfTools.Api.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "PdfTools.Api.dll"]
