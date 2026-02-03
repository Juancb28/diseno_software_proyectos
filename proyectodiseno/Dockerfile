FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /build
COPY . .
RUN mvn clean package -DskipTests

FROM eclipse-temurin:21-jre
WORKDIR /app

# Copiamos el JAR
COPY --from=build /build/target/*.jar app.jar

# Copiamos la base de datos
COPY database/database.db /app/database.db

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
