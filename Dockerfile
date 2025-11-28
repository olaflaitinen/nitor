# Stage 1: Build the application
FROM maven:3.9-eclipse-temurin-21 AS build

# Set the working directory
WORKDIR /app

# Copy the pom.xml file first to leverage Docker cache
COPY pom.xml .

# Download dependencies - this layer will be cached unless pom.xml changes
RUN mvn dependency:go-offline -B

# Copy the source code
COPY src ./src

# Build the application
RUN mvn clean package -DskipTests

# Stage 2: Create the runtime image
FROM eclipse-temurin:21-jre-alpine

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create a non-root user to run the application
RUN addgroup -g 1000 spring && adduser -u 1000 -G spring -s /bin/sh -D spring

# Set the working directory
WORKDIR /app

# Copy the JAR file from the build stage
COPY --from=build /app/target/*.jar app.jar

# Change ownership of the application files
RUN chown -R spring:spring /app

# Switch to the non-root user
USER spring:spring

# Expose the port Spring Boot runs on
ENV PORT=8080
EXPOSE $PORT

# Use dumb-init to run the application
ENTRYPOINT ["dumb-init", "--"]

# Run the Spring Boot application with Java 21 optimizations
CMD ["java", "-XX:+UseZGC", "-XX:MaxRAMPercentage=75.0", "-Dserver.port=${PORT}", "-jar", "app.jar"]
