FROM maven:3-eclipse-temurin-21-alpine as builder
WORKDIR /opt/app
COPY pom.xml ./
RUN mvn dependency:go-offline
COPY src ./src
RUN mvn clean install

FROM eclipse-temurin:21-alpine
WORKDIR /opt/app
COPY --from=builder /opt/app/target/*.jar /opt/app/*.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/opt/app/*.jar"]