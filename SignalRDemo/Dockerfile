FROM mcr.microsoft.com/dotnet/core/aspnet:3.1 AS base
WORKDIR /app
EXPOSE 80

FROM mcr.microsoft.com/dotnet/core/sdk:3.1 AS build
WORKDIR /src
COPY ["Dtos/Dtos.csproj", "Dtos/"]
COPY ["SignalRDemo/SignalRDemo.csproj", "SignalRDemo/"]

RUN dotnet restore "SignalRDemo/SignalRDemo.csproj"
COPY . .
WORKDIR "/src/SignalRDemo"
RUN dotnet build "SignalRDemo.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "SignalRDemo.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "SignalRDemo.dll"]