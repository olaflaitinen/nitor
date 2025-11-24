# NITOR - Academic Social Network Platform

**Version:** 1.0.0
**Status:** Production Ready
**License:** MIT

## Overview

NITOR is a comprehensive academic social network platform designed for researchers, academics, and scientists. The platform combines rapid knowledge dissemination with rigorous scientific standards, providing a space for academic discourse, collaboration, and professional development.

### Key Features

- **Content Management**: Academic posts and research articles with LaTeX support
- **Researcher Profiles**: Comprehensive CV management and academic credentials
- **Collaboration**: Threaded discussions and comment system
- **AI Integration**: Google Gemini-powered text enhancement and abstract generation
- **File Management**: Secure file upload and storage
- **Notifications**: Real-time notification system
- **Authentication**: Secure JWT-based authentication

---

## Architecture

### Monorepo Structure

```
nitor/
├── packages/
│   ├── backend/          # Java Spring Boot REST API
│   ├── frontend/         # React + TypeScript UI
│   ├── ai-service/       # Node.js AI Microservice
│   └── shared/           # Shared TypeScript types
├── infrastructure/       # Docker and Kubernetes configurations
├── database/             # SQL migration files
├── security/             # Security policies and configurations
└── docs/                 # Additional documentation
```

### Technology Stack

**Backend:**
- Java 17
- Spring Boot 3.2
- PostgreSQL 15
- Redis 7
- MinIO (S3-compatible storage)
- JWT Authentication

**Frontend:**
- React 19
- TypeScript 5.8
- Vite 6
- Tailwind CSS
- Axios

**AI Service:**
- Node.js 20
- Google Gemini 2.0 Flash
- Express.js

---

## Quick Start

### Prerequisites

- Docker & Docker Compose
- (Optional) Java 17+ and Maven for local backend development
- (Optional) Node.js 20+ for local frontend development

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd nitor
```

2. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. Start all services:
```bash
./scripts/start-dev.sh
```

4. Access the application:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8080
- API Documentation: http://localhost:8080/swagger-ui.html

### Stopping Services

```bash
./scripts/stop-dev.sh
```

---

## Documentation

- [Setup Guide](MONOREPO_SETUP.md) - Detailed setup instructions
- [Implementation Status](IMPLEMENTATION_STATUS.md) - Current implementation status
- [Final Setup Guide](FINAL_SETUP_GUIDE.md) - Production deployment guide
- [Contributing](CONTRIBUTING.md) - Contribution guidelines
- [Security](SECURITY.md) - Security policies
- [Changelog](CHANGELOG.md) - Version history

---

## API Documentation

The platform provides a comprehensive REST API with 60+ endpoints across the following categories:

- **Authentication** (3 endpoints)
- **Profiles** (4 endpoints)
- **Content** (7 endpoints)
- **Comments** (5 endpoints)
- **CV Management** (10 endpoints)
- **Notifications** (4 endpoints)
- **File Upload** (2 endpoints)
- **AI Services** (3 endpoints)

Full API documentation available at: http://localhost:8080/swagger-ui.html

---

## Development

### Backend Development

```bash
cd packages/backend
mvn clean install
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

### Frontend Development

```bash
cd packages/frontend
npm install
npm run dev
```

### AI Service Development

```bash
cd packages/ai-service
npm install
npm start
```

### Running Tests

```bash
# Backend tests
cd packages/backend
mvn test

# Frontend tests
cd packages/frontend
npm test
```

---

## Database

The platform uses PostgreSQL with Flyway for database migrations. The schema includes:

- User authentication and authorization
- Profile and academic credentials
- Content and comments
- CV components (education, experience, projects)
- Notifications
- File metadata
- Audit logs

Migration files are located in `packages/backend/src/main/resources/db/migration/`

---

## Security

- JWT-based authentication with access and refresh tokens
- BCrypt password hashing
- CORS protection
- Rate limiting
- Input validation
- SQL injection prevention through JPA
- Secure file upload validation

See [SECURITY.md](SECURITY.md) for detailed security policies.

---

## Deployment

### Docker Deployment

```bash
docker-compose -f infrastructure/docker/docker-compose.yml up -d
```

### Kubernetes Deployment

```bash
kubectl apply -f infrastructure/kubernetes/
```

### Environment Variables

See `.env.example` for required environment variables.

---

## Contributing

We welcome contributions from the community. Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Support

For issues, questions, or contributions, please:
- Open an issue on GitHub
- Review existing documentation
- Contact the development team

---

## Acknowledgments

- Built for the academic community
- Powered by Spring Boot, React, and Google Gemini AI
- Inspired by the need for professional academic networking

---

**Maintained by the NITOR Development Team**
**Version 1.0.0 - Production Ready**
