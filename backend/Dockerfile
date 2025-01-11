FROM maven:3-eclipse-temurin-21-jammy as builder
WORKDIR /opt/app
COPY pom.xml ./
RUN mvn dependency:go-offline -P live
COPY src ./src
RUN mvn clean install -P prod

FROM eclipse-temurin:21-jammy
WORKDIR /opt/app
COPY --from=builder /opt/app/target/*.jar /opt/app/*.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/opt/app/*.jar"]