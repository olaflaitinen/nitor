# NITOR Academic Social Network Platform

<div align="center">

<img src="https://media.licdn.com/dms/image/v2/D4E3DAQGOJNJtqB_M5A/image-scale_191_1128/B4EZq0oJeRHcAc-/0/1763967017421/nitor_academic_network_cover?e=1764572400&v=beta&t=Svc2M1U9WHvfBvx0O4EwxBE_u90noj7VkYYZWXWH02A" alt="NITOR Banner" width="100%"/>

<br/>

<img src="https://media.licdn.com/dms/image/v2/D4E0BAQFbwo4K3LqYAg/company-logo_200_200/B4EZq0lf3CKcAI-/0/1763966320547/nitor_academic_network_logo?e=1765411200&v=beta&t=-dxQlSRvKMsOqO03clz8xxrSmxDMiK5d0Br2MdZ28ag" alt="NITOR Logo" width="200"/>

<br/>

**Rigorous. Academic. Connected.**

<br/>

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Status](https://img.shields.io/badge/status-production--ready-green.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

**Professional Academic Networking Platform**

[Quick Start](#quick-start) •
[Documentation](#documentation) •
[Features](#features) •
[Architecture](#architecture) •
[Deployment](#deployment)

</div>

---

## About NITOR

NITOR is an enterprise-grade academic social networking platform designed for researchers, academics, and institutions requiring a professional environment for scholarly communication and collaboration.

The platform provides a focused alternative to general-purpose social media by aligning features with academic workflows, quality standards, and institutional requirements. Built with security, scalability, and research integrity as core principles.

**Mission:** To strengthen the global research ecosystem by providing a secure, institution-grade academic network where rigorous work is visible, searchable, and connected.

**Connect:** [LinkedIn Company Page](https://www.linkedin.com/company/nitor-academic-network)

---

## Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Quick Start](#quick-start)
- [Documentation](#documentation)
- [Development](#development)
- [Deployment](#deployment)
- [Security](#security)
- [Support](#support)
- [License](#license)

---

## Features

### Core Platform Capabilities

**Academic Content Management**
- Research publications, preprints, and academic articles
- LaTeX mathematical notation support
- Citation management and tracking
- Version control for content revisions
- Structured academic profiles with ORCID integration

**AI-Powered Research Tools** (51 Features)
- Writing enhancement with Gemini 2.5 Pro
- Abstract and summary generation
- Research statement creation
- CV optimization and tailoring
- Citation checking and validation
- Methods clarity improvement
- Multi-language translation

**Professional Networking**
- Connection-based academic networking
- Researcher discovery by discipline and institution
- Threaded scientific discussions
- Collaborative review system
- Academic credential verification

**Security & Compliance**
- Two-Factor Authentication (TOTP)
- OAuth 2.0 (Google, GitHub, LinkedIn)
- JWT token-based authentication
- Refresh token rotation
- Rate limiting and abuse protection
- GDPR-compliant data handling
- Complete audit logging

**Infrastructure & Performance**
- Docker containerization
- Kubernetes orchestration support
- PostgreSQL 15 with optimized queries
- Redis 7 caching layer
- MinIO S3-compatible storage
- Real-time WebSocket notifications
- Comprehensive API (67 endpoints)

---

## Technology Stack

### Backend
- **Framework:** Spring Boot 3.2.5 (Java 17)
- **Database:** PostgreSQL 15 with Flyway migrations
- **Cache:** Redis 7
- **Storage:** MinIO (S3-compatible)
- **Authentication:** JWT with refresh token rotation
- **Documentation:** OpenAPI 3.0 / Swagger

### Frontend
- **Framework:** React 19 with TypeScript 5.8
- **Build Tool:** Vite 6
- **Styling:** Tailwind CSS 3.4
- **State Management:** Zustand 5.0
- **HTTP Client:** Axios 1.7
- **Forms:** React Hook Form 7.54

### AI Service
- **Runtime:** Node.js 20
- **Framework:** Express.js 4
- **AI Model:** Google Gemini 2.5 Pro
- **Features:** 51 AI-powered capabilities

### Infrastructure
- **Containerization:** Docker 24+
- **Orchestration:** Kubernetes 1.28+
- **Reverse Proxy:** Nginx 1.25+
- **CI/CD:** GitHub Actions

---

## Architecture

### System Components

```
┌─────────────────────────────────────────────────────────┐
│                     NITOR Platform                      │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────┐      ┌──────────┐      ┌──────────┐    │
│  │ Frontend │◄────►│  Backend │◄────►│    AI    │    │
│  │ React 19 │      │ Spring   │      │  Gemini  │    │
│  │   Vite   │      │ Boot 3.2 │      │ Node.js  │    │
│  └──────────┘      └──────────┘      └──────────┘    │
│                            │                           │
│              ┌─────────────┼─────────────┐            │
│              │             │             │            │
│        ┌─────▼────┐  ┌────▼────┐  ┌────▼────┐       │
│        │PostgreSQL│  │  Redis  │  │  MinIO  │       │
│        │    15    │  │    7    │  │ Storage │       │
│        └──────────┘  └─────────┘  └─────────┘       │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Monorepo Structure

```
nitor/
├── packages/
│   ├── backend/          # Spring Boot REST API (Java)
│   ├── frontend/         # React Application (TypeScript)
│   ├── ai-service/       # AI Microservice (Node.js)
│   └── shared/           # Shared TypeScript types
├── infrastructure/
│   ├── docker/           # Docker Compose configurations
│   ├── kubernetes/       # Kubernetes manifests
│   └── nginx/            # Nginx configurations
├── docs/                 # Comprehensive documentation
├── scripts/              # Deployment and utility scripts
└── security/             # Security policies
```

---

## Quick Start

### Prerequisites

- Docker 24+ and Docker Compose
- Git 2.30+
- 8GB RAM (16GB recommended)
- 20GB free disk space

### Installation

```bash
# 1. Clone repository
git clone https://github.com/olaflaitinen/nitor.git
cd nitor

# 2. Configure environment
cp .env.example .env
nano .env  # Edit with your credentials

# 3. Start all services
./scripts/start-dev.sh

# 4. Verify deployment
./scripts/verify-deployment.sh
```

### Access Points

| Service | URL | Description |
|---------|-----|-------------|
| Frontend | http://localhost:5173 | React Application |
| Backend API | http://localhost:8080 | REST API |
| API Documentation | http://localhost:8080/swagger-ui.html | Interactive API Docs |
| AI Service | http://localhost:3001 | Gemini AI (51 Features) |
| MinIO Console | http://localhost:9001 | File Storage Admin |
| Health Check | http://localhost:8080/actuator/health | System Health |

### Default Credentials (Development)

```
Application:
  Email: test@example.com
  Password: password123

MinIO Console:
  Username: minioadmin
  Password: minioadmin
```

---

## Documentation

Comprehensive documentation is available in the `/docs` directory:

| Document | Description |
|----------|-------------|
| [LOCAL_DEPLOYMENT.md](docs/LOCAL_DEPLOYMENT.md) | Complete local deployment guide |
| [API_DOCUMENTATION.md](docs/API_DOCUMENTATION.md) | REST API reference (67 endpoints) |
| [DEPLOYMENT_GUIDE.md](docs/DEPLOYMENT_GUIDE.md) | Production deployment procedures |
| [AI_SERVICE.md](docs/AI_SERVICE.md) | AI features documentation (51 features) |
| [USER_GUIDE.md](docs/USER_GUIDE.md) | End-user guide for researchers |
| [IMPLEMENTATION_STATUS.md](docs/IMPLEMENTATION_STATUS.md) | Current implementation status |

### Additional Resources

- [SECURITY.md](SECURITY.md) - Security policies and reporting
- [CONTRIBUTING.md](CONTRIBUTING.md) - Contribution guidelines
- [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) - Community standards
- [CHANGELOG.md](CHANGELOG.md) - Version history

---

## Development

### Local Development Setup

**Backend Development:**
```bash
cd packages/backend
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

**Frontend Development:**
```bash
cd packages/frontend
npm install
npm run dev
```

**AI Service Development:**
```bash
cd packages/ai-service
npm install
npm start
```

### Testing

```bash
# Backend tests
cd packages/backend
mvn test

# Frontend tests
cd packages/frontend
npm test

# Integration tests
mvn verify -P integration-tests
```

### Building for Production

```bash
# Backend JAR
cd packages/backend
mvn clean package -DskipTests

# Frontend build
cd packages/frontend
npm run build

# AI Service
cd packages/ai-service
npm install --production
```

---

## Deployment

### Docker Deployment (Recommended)

```bash
# Start all services
docker-compose -f infrastructure/docker/docker-compose.yml up -d

# View logs
docker-compose -f infrastructure/docker/docker-compose.yml logs -f

# Stop services
docker-compose -f infrastructure/docker/docker-compose.yml down
```

### Kubernetes Deployment

```bash
# Apply manifests
kubectl apply -f infrastructure/kubernetes/

# Check status
kubectl get pods -n nitor

# View logs
kubectl logs -f deployment/nitor-backend -n nitor
```

### Production Checklist

- [ ] Configure production database credentials
- [ ] Set strong JWT secret (256+ bits)
- [ ] Configure email service (SendGrid)
- [ ] Set up OAuth credentials
- [ ] Configure S3/MinIO storage
- [ ] Enable HTTPS with SSL certificates
- [ ] Configure Nginx reverse proxy
- [ ] Set up monitoring (Prometheus + Grafana)
- [ ] Configure backup strategy
- [ ] Set up log aggregation
- [ ] Enable rate limiting
- [ ] Configure CORS for production domain
- [ ] Test disaster recovery procedures

For detailed deployment instructions, see [DEPLOYMENT_GUIDE.md](docs/DEPLOYMENT_GUIDE.md)

---

## Security

### Authentication & Authorization

- JWT tokens with automatic refresh rotation
- Two-Factor Authentication (TOTP)
- OAuth 2.0 social login
- BCrypt password hashing
- Session management and invalidation

### API Security

- Rate limiting (Bucket4j)
  - Auth endpoints: 5 requests/minute
  - API endpoints: 100 requests/minute
- CORS protection
- Input validation (JSR-380)
- SQL injection prevention
- XSS protection

### Data Security

- Encryption at rest
- HTTPS/TLS 1.3
- Secure file upload validation
- Complete audit logging
- GDPR compliance

### Security Headers

```
Strict-Transport-Security: max-age=31536000
X-Frame-Options: SAMEORIGIN
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Content-Security-Policy: default-src 'self'
```

### Vulnerability Reporting

Report security vulnerabilities to: security@nitor.io

See [SECURITY.md](SECURITY.md) for complete security policy.

---

## API Overview

### Endpoints Summary

| Category | Endpoints | Description |
|----------|-----------|-------------|
| Authentication | 4 | Register, login, refresh, logout |
| Profiles | 6 | User profile management |
| Content | 8 | Research content operations |
| Comments | 6 | Discussion system |
| CV Management | 12 | Academic CV operations |
| Notifications | 5 | Notification system |
| File Upload | 3 | File management |
| Interactions | 10 | Likes, bookmarks, reposts |
| Follow System | 5 | User connections |
| Search | 3 | Global search |
| OAuth | 2 | Social authentication |
| Admin | 11 | Platform administration |

**Total:** 67 REST endpoints + WebSocket support

Interactive API documentation: http://localhost:8080/swagger-ui.html

---

## Project Statistics

| Metric | Value |
|--------|-------|
| Code Lines | 25,000+ |
| API Endpoints | 67 |
| AI Features | 51 |
| Database Tables | 25 |
| Documentation Pages | 8 |
| Services | 6 (Postgres, Redis, MinIO, Backend, AI, Frontend) |
| Test Coverage | 80%+ |
| Supported Languages | English |

---

## Support

### Documentation
- User Guide: [USER_GUIDE.md](docs/USER_GUIDE.md)
- API Documentation: [API_DOCUMENTATION.md](docs/API_DOCUMENTATION.md)
- Deployment Guide: [DEPLOYMENT_GUIDE.md](docs/DEPLOYMENT_GUIDE.md)

### Community
- GitHub Issues: https://github.com/olaflaitinen/nitor/issues
- GitHub Discussions: https://github.com/olaflaitinen/nitor/discussions

### Professional Support
- Email: support@nitor.io
- Enterprise: enterprise@nitor.io
- Security: security@nitor.io

---

## Contributing

We welcome contributions from the academic community. Please read [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Quick Contribution Guide

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'feat: add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

Follow [Conventional Commits](https://www.conventionalcommits.org/) specification.

---

## License

This project is licensed under the MIT License - see [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2024 NITOR Development Team

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction...
```

---

## Acknowledgments

Built with:
- Spring Framework - Enterprise Java framework
- React - UI library for web applications
- Google Gemini - Advanced AI capabilities
- PostgreSQL - Advanced open source database
- Redis - In-memory data structure store

Special thanks to the academic community for inspiration and feedback.

---

## Roadmap

### Version 1.1 (Q2 2025)
- Mobile applications (iOS & Android)
- Advanced analytics dashboard
- Citation network visualization
- Enhanced AI features

### Version 1.2 (Q3 2025)
- Institutional integrations
- Conference management
- Grant collaboration tools
- Research group features

### Version 2.0 (Q4 2025)
- Blockchain verification
- Peer review platform
- Academic marketplace
- Global collaboration tools

---

<div align="center">

**NITOR Development Team** • **Version 1.0.0** • **Production Ready**

[Back to Top](#nitor-academic-social-network-platform)

</div>
