# Database Seed Data

This directory contains seed data for development and testing.

## Methods

### 1. Java DataSeeder (Recommended for Development)

The `DataSeeder` component automatically runs when the application starts in `dev` profile.

```bash
# Start application with dev profile
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
```

**Features:**
- Automatically creates sample users, content, connections, and interactions
- Only runs if database is empty
- Uses Spring's `CommandLineRunner`
- Properly handles relationships and foreign keys

**Disable seeding:**
```properties
# In application-dev.properties
spring.data.seed.enabled=false
```

### 2. SQL Script (Manual Execution)

For direct database seeding using SQL:

```bash
# Using psql
psql -U postgres -d nitor -f seed-dev-data.sql

# Using Docker
docker exec -i postgres psql -U postgres -d nitor < seed-dev-data.sql
```

**Warning:** The SQL script will **DELETE ALL EXISTING DATA** before inserting seed data.

## Seed Data Contents

### Users (5)
- john.doe@university.edu (Professor, Computer Science, MIT)
- jane.smith@research.org (Associate Professor, AI, Stanford)
- alice.johnson@college.edu (Professor, Quantum Physics, Harvard)
- bob.williams@institute.edu (Senior Researcher, Neuroscience, Oxford)
- carol.martinez@university.edu (Professor, Genetics, Cambridge)

**Default password for all users:** `password123`

### Content
- 5 sample posts across different research topics
- Comments on posts
- Endorsements and interactions
- Sample connections and follows

### Additional Data
- User settings
- Tags (AI, Research, MachineLearning, etc.)
- Connections between users
- Follow relationships

## Production Safety

Both seeding methods are protected from running in production:

1. **Java Seeder**: Only active in `dev` profile
2. **SQL Script**: Must be manually executed

Never run seed scripts in production!

## Custom Seed Data

To create custom seed data:

### Option 1: Modify DataSeeder.java
```java
private void seedUsers() {
    // Add your custom user data here
}
```

### Option 2: Create new SQL scripts
```sql
-- my-custom-seed.sql
INSERT INTO users (...) VALUES (...);
```

## Testing

For integration tests, use H2 in-memory database with JPA's `ddl-auto=create-drop`. No manual seeding needed.

```properties
# application-test.properties
spring.jpa.hibernate.ddl-auto=create-drop
```

## Verification

After seeding, verify the data:

```sql
SELECT
  (SELECT COUNT(*) FROM users) as users,
  (SELECT COUNT(*) FROM profiles) as profiles,
  (SELECT COUNT(*) FROM content) as content,
  (SELECT COUNT(*) FROM connections) as connections,
  (SELECT COUNT(*) FROM follows) as follows;
```

Expected output:
- users: 5
- profiles: 5
- content: ~15-30
- connections: ~10-20
- follows: ~10-15

## Reset Database

To reset and re-seed:

```bash
# Drop and recreate database
psql -U postgres -c "DROP DATABASE nitor;"
psql -U postgres -c "CREATE DATABASE nitor;"

# Run migrations
./mvnw flyway:migrate

# Seed data (choose one)
# Option 1: Java seeder (restart app with dev profile)
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev

# Option 2: SQL script
psql -U postgres -d nitor -f seed-dev-data.sql
```
