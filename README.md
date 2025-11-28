# NITOR Academic Social Network

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
![Java](https://img.shields.io/badge/Java-17-orange.svg)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.5-brightgreen.svg)
![React](https://img.shields.io/badge/React-19.2-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)
![Node.js](https://img.shields.io/badge/Node.js-20-green.svg)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue.svg)

**Enterprise-Grade Academic Networking Platform**

[Quick Start](#quick-start) •
[Documentation](#documentation) •
[Features](#features) •
[Architecture](#architecture) •
[Deployment](#deployment) •
[Contributing](#contributing)

</div>

---

## Table of Contents

- [About NITOR](#about-nitor)
- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Quick Start](#quick-start)
- [Documentation](#documentation)
- [Development](#development)
- [Deployment](#deployment)
- [API Overview](#api-overview)
- [Security](#security)
- [Performance](#performance)
- [Contributing](#contributing)
- [Support](#support)
- [Roadmap](#roadmap)
- [License](#license)

---

## About NITOR

**NITOR** (Latin: *brilliant, shining*) is an enterprise-grade academic social networking platform designed specifically for researchers, academics, and institutions requiring a professional environment for scholarly communication and collaboration.

### Mission Statement

To strengthen the global research ecosystem by providing a secure, institution-grade academic network where rigorous work is visible, searchable, and connected.

### Why NITOR?

Traditional social media platforms fail to address the unique needs of academic communities:

- **Lack of Academic Features**: No LaTeX support, citation management, or CV tools
- **Privacy Concerns**: Data ownership and GDPR compliance issues
- **Professional Standards**: Mixing personal and professional content
- **Research Integrity**: Inadequate verification and credentialing systems

NITOR addresses these challenges with:

- **Academic-First Design**: Features built specifically for researchers
- **Enterprise Security**: GDPR-compliant, SOC 2 ready architecture
- **AI-Powered Tools**: 54 Gemini-powered features for academic writing
- **Institution Integration**: SSO, ORCID, and institutional authentication
- **Open Source**: Transparent, auditable, community-driven development

### Connect

- **LinkedIn**: [NITOR Academic Network](https://www.linkedin.com/company/nitor-academic-network)
- **Founded**: November 5, 2025
- **Current Status**: Version 1.0.0 - Production Ready
- **Deployment Date**: November 27, 2025

---

## Key Features

### Academic Content Management

**Research Publication Platform**
- Support for research papers, articles, and preprints
- LaTeX mathematical notation rendering ($...$, $$...$$)
- Structured abstracts with metadata
- Citation management and tracking
- Version control for content revisions
- DOI integration (planned)

**Academic Profiles**
- Comprehensive researcher profiles with ORCID integration
- Academic credentials and institution verification
- Publication lists with impact metrics
- Research interests and expertise tags
- H-index and citation counts (planned)

### AI-Powered Research Tools

**54 Gemini-Powered Features**

**Writing Enhancement (6 features):**
- Text refinement and clarity improvement
- Abstract generation from paper notes
- Biography enhancement for profiles
- Plain language summaries for public engagement
- Multi-level summaries (one-sentence, short, medium, long)
- Article skeleton extraction

**Research Quality (6 features):**
- Argument consistency checking
- Repetitive sentence detection
- Citation needed detection
- Methods clarity improvement
- Limitations suggestions
- Figure/table caption generation

**Publication Support (7 features):**
- Title variants for different audiences
- Reviewer response generation
- Poster text compression
- Presentation slide outline generation
- Tone softening for diplomatic communication
- Key contributions extraction
- Research question clarification

**Career Development (9 features):**
- Research statement generation
- Teaching statement creation
- Diversity statement drafting
- CV tailoring for specific positions
- Skill extraction and categorization
- Role summaries for CV
- Career gap explanations
- Recommendation letter drafts
- Professional bio models

**Collaboration Tools (5 features):**
- Weekly progress summaries
- Meeting agenda summarization
- Collaboration proposal generation
- Comment draft suggestions
- Discussion health analysis

**Research Discovery (5 features):**
- Interdisciplinary connection identification
- Reading list curation
- Reference suggestions
- Research trend explanations
- Question classification and methodology suggestions

**Content Adaptation (4 features):**
- Expertise level adaptation (undergrad, grad, expert, public)
- Bilingual translation with technical accuracy
- Terminology alignment to field conventions
- Tone adjustment (formal, conversational, enthusiastic, cautious)

**Review & Quality (5 features):**
- Peer review feedback structuring
- Self-review checklist generation
- Interview Q&A generation
- Result interpretation variants (conservative, moderate, bold)
- Statistical reporting templates (APA style)

**Platform Management (7 features):**
- Visual descriptions for accessibility
- Code of conduct summaries
- Onboarding guide creation
- Lab manifesto drafting
- Event description generation
- Notification prioritization
- Grant proposal review

### Professional Networking

**Intelligent Connection System**
- Connection-based academic networking (mutual relationships)
- Follower system for public figures
- Researcher discovery by discipline, institution, and expertise
- Recommended connections based on research interests
- Academic credential verification with badges

**Engagement Features**
- Threaded scientific discussions and debates
- Collaborative review and peer feedback system
- Content endorsements and academic reputation
- Real-time notifications via WebSocket
- Activity feed with intelligent filtering

### Security & Compliance

**Enterprise-Grade Authentication**
- JWT token-based authentication with automatic refresh rotation
- Two-Factor Authentication (TOTP, RFC 6238)
- OAuth 2.0 integration (Google, GitHub, LinkedIn)
- BCrypt password hashing (work factor: 12)
- Session management and token revocation via Redis

**Data Protection**
- GDPR-compliant data handling and user consent management
- Complete audit logging for all sensitive operations
- Field-level encryption for personally identifiable information
- TLS 1.3 for data in transit
- AES-256 encryption for data at rest

**API Security**
- Rate limiting with Bucket4j (5-100 requests/minute by endpoint type)
- CORS protection with configurable origins
- Input validation using Jakarta Bean Validation (JSR-380)
- SQL injection prevention via parameterized queries
- XSS protection with Content Security Policy headers

### Infrastructure & Performance

**Modern Architecture**
- Microservices architecture (Backend, AI Service, Frontend)
- Docker containerization for consistent deployments
- Kubernetes orchestration support with auto-scaling
- PostgreSQL 15 with query optimization and indexing
- Redis 7 caching layer for high-performance data access
- MinIO S3-compatible object storage for files and images

**Scalability Features**
- Horizontal pod autoscaling in Kubernetes
- Database connection pooling
- CDN-ready static asset delivery
- WebSocket support for real-time features
- Comprehensive health checks and monitoring

**Developer Experience**
- OpenAPI 3.0 / Swagger UI for interactive API documentation
- RESTful API design following industry best practices
- Comprehensive logging with structured output
- Hot reload for efficient development
- Extensive test coverage (unit, integration, E2E)

---

## Technology Stack

### Backend Service

**Framework & Language**
- **Java 17** - LTS release with modern language features
- **Spring Boot 3.2.5** - Enterprise application framework
- **Spring Security 6** - Authentication and authorization
- **Spring Data JPA** - Data access with Hibernate
- **Spring WebSocket** - Real-time communication

**Database & Caching**
- **PostgreSQL 15** - Primary relational database
- **Flyway 10.10.0** - Database migration management
- **Redis 7** - Caching and session store
- **HikariCP** - High-performance connection pooling

**Security & Authentication**
- **JWT (jjwt 0.12.5)** - Token-based authentication
- **BCrypt** - Password hashing
- **Spring Security OAuth2** - Social login integration

**Documentation & Monitoring**
- **SpringDoc OpenAPI 3** (2.5.0) - API documentation
- **Spring Boot Actuator** - Health checks and metrics
- **Micrometer + Prometheus** - Metrics collection and monitoring

**File Storage & Utilities**
- **MinIO 8.6.0** - S3-compatible object storage
- **Apache Commons Lang3** - Utility functions
- **Lombok** - Boilerplate code reduction
- **Jackson** - JSON serialization

### Frontend Application

**Framework & Build Tools**
- **React 19.2** - UI library with latest concurrent features
- **TypeScript 5.8** - Type-safe JavaScript
- **Vite 6.2** - Next-generation frontend build tool
- **@vitejs/plugin-react 5.0** - React plugin for Vite

**State Management & Forms**
- **Zustand 5.0.8** - Lightweight state management
- **React Hook Form 7.49.3** - Performant form handling
- **@hookform/resolvers 5.2.2** - Form validation integration
- **Zod 3.22.4** - TypeScript-first schema validation

**HTTP & API**
- **Axios 1.13.2** - Promise-based HTTP client
- **@supabase/supabase-js 2.39.3** - Real-time subscriptions

**UI & Styling**
- **Lucide React 0.554.0** - Beautiful icon library
- **Canvas Confetti 1.9.4** - Celebration effects
- **React Router DOM 7.9.6** - Client-side routing

**Markdown & Math**
- **React Markdown 10.1.0** - Markdown rendering
- **Remark Math 6.0.0** - Math in Markdown
- **Rehype KaTeX 7.0.0** - LaTeX rendering

**AI Integration**
- **@google/genai 1.30.0** - Google Gemini AI SDK

**Utilities**
- **jsPDF 3.0.4** - PDF generation
- **dotenv 17.2.3** - Environment variable management

### AI Microservice

**Runtime & Framework**
- **Node.js 20** - JavaScript runtime
- **Express.js 4.18.2** - Web application framework

**AI Integration**
- **@google/generative-ai 0.21.0** - Google Gemini 2.5 Pro integration

**Middleware & Security**
- **CORS 2.8.5** - Cross-origin resource sharing
- **Express Rate Limit 7.1.5** - API rate limiting
- **dotenv 16.3.1** - Environment configuration

**Development**
- **Nodemon 3.0.2** - Auto-restart on file changes

### Infrastructure & DevOps

**Containerization**
- **Docker 24+** - Application containerization
- **Docker Compose** - Multi-container orchestration

**Orchestration**
- **Kubernetes 1.28+** - Container orchestration
- **kubectl** - Kubernetes CLI

**Reverse Proxy & Load Balancing**
- **Nginx 1.25+** - Web server and reverse proxy
- **Let's Encrypt / Certbot** - SSL/TLS certificates

**CI/CD**
- **GitHub Actions** - Continuous integration and deployment

**Monitoring & Logging**
- **Prometheus** - Metrics collection
- **Grafana** - Metrics visualization
- **Fluent Bit** - Log aggregation

---

## Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         NITOR Platform                          │
│                    (Microservices Architecture)                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────┐      ┌─────────────┐      ┌─────────────┐   │
│  │  Frontend   │◄────►│   Backend   │◄────►│ AI Service  │   │
│  │  React 19   │      │  Spring     │      │  Gemini 2.5 │   │
│  │  Vite 6     │      │  Boot 3.2.5 │      │  Node.js 20 │   │
│  │  Port 5173  │      │  Port 8080  │      │  Port 3001  │   │
│  └─────────────┘      └──────┬──────┘      └─────────────┘   │
│                              │                                 │
│              ┌───────────────┼───────────────┐                │
│              │               │               │                │
│        ┌─────▼────┐    ┌────▼────┐    ┌────▼────┐           │
│        │PostgreSQL│    │  Redis  │    │  MinIO  │           │
│        │    15    │    │    7    │    │ Storage │           │
│        │ Database │    │  Cache  │    │   S3    │           │
│        └──────────┘    └─────────┘    └─────────┘           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                             ▲
                             │
                    ┌────────┴────────┐
                    │  Nginx Reverse  │
                    │  Proxy + SSL    │
                    └─────────────────┘
```

### Monorepo Structure

```
nitor/
├── packages/
│   ├── backend/                 # Spring Boot REST API (Java 17)
│   │   ├── src/
│   │   │   ├── main/
│   │   │   │   ├── java/com/nitor/
│   │   │   │   │   ├── controller/      # REST controllers (14 files)
│   │   │   │   │   ├── service/         # Business logic
│   │   │   │   │   ├── repository/      # Data access layer
│   │   │   │   │   ├── model/           # JPA entities
│   │   │   │   │   ├── dto/             # Data transfer objects
│   │   │   │   │   ├── config/          # Spring configuration
│   │   │   │   │   ├── security/        # JWT, OAuth2 config
│   │   │   │   │   └── exception/       # Exception handling
│   │   │   │   └── resources/
│   │   │   │       ├── application.yml
│   │   │   │       └── db/migration/    # Flyway SQL migrations
│   │   │   └── test/                    # Unit & integration tests
│   │   └── pom.xml                      # Maven dependencies
│   │
│   ├── frontend/                # React Application (TypeScript)
│   │   ├── src/
│   │   │   ├── components/      # Reusable UI components
│   │   │   ├── pages/           # Page components
│   │   │   ├── hooks/           # Custom React hooks
│   │   │   ├── services/        # API service layer
│   │   │   ├── stores/          # Zustand state stores
│   │   │   ├── types/           # TypeScript interfaces
│   │   │   ├── utils/           # Utility functions
│   │   │   └── App.tsx          # Root component
│   │   ├── public/              # Static assets
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── vite.config.ts
│   │
│   └── ai-service/              # AI Microservice (Node.js)
│       ├── src/
│       │   ├── server.js        # Express server (54 endpoints)
│       │   └── services/
│       │       └── geminiService.js  # Gemini AI integration
│       ├── package.json
│       └── .env.example
│
├── infrastructure/
│   ├── docker/
│   │   ├── docker-compose.yml   # Local development stack
│   │   ├── Dockerfile.backend
│   │   ├── Dockerfile.frontend
│   │   └── Dockerfile.ai-service
│   ├── kubernetes/              # K8s manifests
│   │   ├── backend-deployment.yaml
│   │   ├── frontend-deployment.yaml
│   │   ├── ai-service-deployment.yaml
│   │   ├── postgres-statefulset.yaml
│   │   ├── redis-deployment.yaml
│   │   └── ingress.yaml
│   └── nginx/                   # Nginx configurations
│       ├── nginx.conf
│       ├── nitor.conf
│       └── nitor-dev.conf
│
├── docs/                        # Comprehensive documentation
│   ├── API_DOCUMENTATION.md     # Complete API reference
│   ├── DEPLOYMENT_GUIDE.md      # Production deployment
│   ├── LOCAL_DEPLOYMENT.md      # Local development setup
│   ├── AI_SERVICE.md            # AI features documentation
│   └── USER_GUIDE.md            # End-user guide
│
├── scripts/                     # Utility scripts
│   ├── start-dev.sh
│   ├── stop-dev.sh
│   └── verify-deployment.sh
│
├── .github/                     # GitHub Actions CI/CD
│   └── workflows/
│
├── README.md                    # This file
├── CONTRIBUTING.md              # Contribution guidelines
├── CODE_OF_CONDUCT.md           # Community standards
├── SECURITY.md                  # Security policy
├── CONTRIBUTORS.md              # Contributors list
├── DEPLOYMENT_FIXES.md          # Troubleshooting guide
├── LICENSE                      # MIT License
└── .env.example                 # Environment variables template
```

### Data Flow

**Authentication Flow:**
1. User submits credentials to `/api/auth/login`
2. Backend validates credentials against PostgreSQL
3. JWT access token (24h) and refresh token (7d) generated
4. Tokens stored in Redis for validation and revocation
5. Frontend stores tokens securely
6. Subsequent requests include JWT in Authorization header
7. Backend validates token signature and expiration
8. Token refresh handled automatically before expiration

**Content Publishing Flow:**
1. User creates content in React editor (Markdown + LaTeX)
2. Frontend validates and sends to `/api/content` endpoint
3. Backend validates authorization and content
4. Content saved to PostgreSQL with metadata
5. Redis cache invalidated for relevant feeds
6. WebSocket notification sent to followers
7. Content appears in follower feeds immediately

**AI Processing Flow:**
1. User requests AI feature (e.g., text refinement)
2. Frontend sends request to Backend `/api/ai/*` proxy
3. Backend forwards to AI Service with rate limit check
4. AI Service calls Google Gemini 2.5 Pro API
5. Response processed and formatted
6. Result returned through Backend to Frontend
7. User reviews and accepts/modifies AI suggestion

---

## Quick Start

### Prerequisites

- **Docker 24+** and Docker Compose
- **Git 2.30+**
- **8GB RAM** minimum (16GB recommended)
- **20GB** free disk space
- **Gemini API Key** (get from [Google AI Studio](https://makersuite.google.com/app/apikey))

### Installation (5 Minutes)

```bash
# 1. Clone the repository
git clone https://github.com/olaflaitinen/nitor.git
cd nitor

# 2. Configure environment variables
cp .env.example .env
nano .env  # Add your GEMINI_API_KEY and other credentials

# 3. Start all services with Docker Compose
docker-compose -f infrastructure/docker/docker-compose.yml up -d

# 4. Verify deployment
docker-compose -f infrastructure/docker/docker-compose.yml ps
```

### Access the Application

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | http://localhost:5173 | React application (development) |
| **Backend API** | http://localhost:8080 | REST API |
| **API Documentation** | http://localhost:8080/swagger-ui.html | Interactive API docs |
| **AI Service** | http://localhost:3001 | Gemini AI microservice |
| **MinIO Console** | http://localhost:9001 | Object storage UI |
| **Health Check** | http://localhost:8080/actuator/health | System health status |
| **Metrics** | http://localhost:8080/actuator/prometheus | Prometheus metrics |

### Default Credentials (Development Only)

```
Application Login:
  Email: test@example.com
  Password: password123

MinIO Console:
  Username: minioadmin
  Password: minioadmin
```

### Next Steps

1. **Explore the Platform**: Create an account, publish content, connect with researchers
2. **Review Documentation**: See [docs/](docs/) for detailed guides
3. **Try AI Features**: Refine text, generate abstracts, create statements
4. **Customize**: Edit `.env` for your configuration
5. **Develop**: See [CONTRIBUTING.md](CONTRIBUTING.md) for development guidelines

---

## Documentation

Comprehensive documentation is available in the `/docs` directory:

| Document | Description | Audience |
|----------|-------------|----------|
| [**Production Deployment Guide**](PRODUCTION_DEPLOYMENT_COMPLETE_GUIDE.md) | **Complete production deployment with all credentials and API keys** | **DevOps** |
| [API Documentation](docs/API_DOCUMENTATION.md) | Complete REST API reference with 121 backend + 54 AI endpoints | Developers |
| [Local Deployment Guide](docs/LOCAL_DEPLOYMENT.md) | Step-by-step local setup instructions | Developers |
| [Deployment Guide](docs/DEPLOYMENT_GUIDE.md) | Production deployment with Kubernetes | DevOps |
| [AI Service Documentation](docs/AI_SERVICE.md) | All 54 Gemini-powered AI features | Developers & Users |
| [User Guide](docs/USER_GUIDE.md) | End-user manual for researchers | Researchers |

### Additional Resources

- [Security Policy](SECURITY.md) - Vulnerability reporting and security practices
- [Contributing Guide](CONTRIBUTING.md) - How to contribute to NITOR
- [Code of Conduct](CODE_OF_CONDUCT.md) - Community standards and scientific integrity code
- [Contributors](CONTRIBUTORS.md) - Project contributors
- [Deployment Fixes](DEPLOYMENT_FIXES.md) - Common deployment issues and solutions
- [Nginx Configuration](infrastructure/nginx/README.md) - Reverse proxy setup
- [Database Seeding](packages/backend/src/main/resources/db/seed/README.md) - Development data

---

## Development

### Local Development Setup

**Backend Development:**
```bash
cd packages/backend
mvn clean install
mvn spring-boot:run -Dspring-boot.run.profiles=dev
# Backend runs on http://localhost:8080
```

**Frontend Development:**
```bash
cd packages/frontend
npm install
npm run dev
# Frontend runs on http://localhost:5173 with hot reload
```

**AI Service Development:**
```bash
cd packages/ai-service
npm install
export GEMINI_API_KEY="your_api_key_here"
npm run dev
# AI Service runs on http://localhost:3001 with auto-restart
```

### Running Tests

```bash
# Backend unit tests
cd packages/backend
mvn test

# Backend integration tests
mvn verify

# Frontend tests
cd packages/frontend
npm test

# Test coverage
npm run test:coverage
```

### Building for Production

```bash
# Backend JAR
cd packages/backend
mvn clean package -DskipTests
# Output: target/nitor-backend-1.0.0.jar

# Frontend optimized build
cd packages/frontend
npm run build
# Output: dist/ directory

# AI Service
cd packages/ai-service
npm install --production
# Ready to deploy
```

---

## Deployment

### Docker Compose (Recommended for Testing)

```bash
# Start entire stack
docker-compose -f infrastructure/docker/docker-compose.yml up -d

# View logs
docker-compose -f infrastructure/docker/docker-compose.yml logs -f

# Stop services
docker-compose -f infrastructure/docker/docker-compose.yml down
```

### Kubernetes (Production)

```bash
# Create namespace
kubectl create namespace nitor-production

# Apply configurations
kubectl apply -f infrastructure/kubernetes/

# Check status
kubectl get pods -n nitor-production

# Access logs
kubectl logs -f deployment/nitor-backend -n nitor-production
```

### Production Checklist

- [ ] Change all default passwords and secrets
- [ ] Generate strong JWT secret (minimum 256 bits)
- [ ] Configure production database with backups
- [ ] Set up SSL/TLS certificates (Let's Encrypt or commercial CA)
- [ ] Configure email service (SendGrid, AWS SES, or SMTP)
- [ ] Set up OAuth credentials (Google, GitHub, LinkedIn)
- [ ] Configure MinIO or AWS S3 for file storage
- [ ] Enable HTTPS and configure Nginx reverse proxy
- [ ] Set up monitoring (Prometheus + Grafana)
- [ ] Configure backup strategy (database, files)
- [ ] Set up log aggregation (ELK stack, Fluent Bit)
- [ ] Enable rate limiting for API endpoints
- [ ] Configure CORS for production domain only
- [ ] Test disaster recovery procedures
- [ ] Set up automated security scanning

For detailed deployment instructions, see [DEPLOYMENT_GUIDE.md](docs/DEPLOYMENT_GUIDE.md).

---

## API Overview

### Backend REST API (121 Endpoints)

**Authentication (9 endpoints)**
- User registration, login, logout
- Token refresh and revocation
- Password reset and change
- OAuth 2.0 integration (Google, GitHub, LinkedIn)
- Account deletion

**Profiles (8 endpoints)**
- Profile CRUD operations
- Profile search and discovery
- Academic credentials management
- ORCID integration

**Content Management (10 endpoints)**
- Create, read, update, delete content
- Content feed with pagination
- Search and filtering
- Content reporting

**Social Features (25 endpoints)**
- Follow/unfollow users
- Connection requests
- Comments and discussions
- Likes, bookmarks, reposts

**CV Management (18 endpoints)**
- Education, experience, publications
- Skills and projects
- Awards and honors
- CV export (PDF, LaTeX, JSON)

**Notifications (6 endpoints)**
- Real-time notifications
- Notification preferences
- Mark as read/unread
- Notification filtering

**File Upload (5 endpoints)**
- Avatar upload
- File attachments
- Image processing
- MinIO integration

**Search (4 endpoints)**
- Global search
- User search
- Content search
- Advanced filtering

**Admin (24 endpoints)**
- User management
- Content moderation
- Platform statistics
- System configuration

**WebSocket (12 endpoints)**
- Real-time notifications
- Live updates
- Chat system (planned)

### AI Service API (54 Endpoints)

See [AI_SERVICE.md](docs/AI_SERVICE.md) for complete documentation of all 54 Gemini-powered AI features.

**Categories:**
- Writing Enhancement (6 features)
- Research Quality (6 features)
- Publication Support (7 features)
- Career Development (9 features)
- Collaboration Tools (5 features)
- Research Discovery (5 features)
- Content Adaptation (4 features)
- Review & Quality (5 features)
- Platform Management (7 features)

### Interactive API Documentation

Access Swagger UI at: http://localhost:8080/swagger-ui.html

---

## Security

### Authentication & Authorization

- **JWT Tokens**: HS256 algorithm, 256-bit secrets
- **Token Expiration**: Access (24h), Refresh (7d) with automatic rotation
- **Two-Factor Authentication**: TOTP-based (RFC 6238) with backup codes
- **OAuth 2.0**: Google, GitHub, LinkedIn integration
- **Password Security**: BCrypt hashing (work factor: 12)

### API Security

- **Rate Limiting**: Bucket4j-based, configurable per endpoint type
  - Authentication: 5 requests/minute
  - General API: 100 requests/minute
  - File uploads: 20 requests/hour
- **CORS Protection**: Configurable allowed origins
- **Input Validation**: Jakarta Bean Validation (JSR-380)
- **SQL Injection Prevention**: Parameterized queries with JPA
- **XSS Protection**: Content Security Policy headers

### Data Protection

- **Encryption in Transit**: TLS 1.3 with modern cipher suites
- **Encryption at Rest**: AES-256 for sensitive data
- **Data Classification**: Public, Internal, Confidential, Restricted
- **Audit Logging**: Complete activity logging for compliance
- **GDPR Compliance**: User consent, data portability, right to erasure

### Security Headers

```
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Frame-Options: SAMEORIGIN
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Content-Security-Policy: default-src 'self'
Referrer-Policy: strict-origin-when-cross-origin
```

### Vulnerability Reporting

**DO NOT** create public GitHub issues for security vulnerabilities.

Report to: **security@nitor.io**

See [SECURITY.md](SECURITY.md) for complete security policy.

---

## Performance

### Benchmarks

- **API Response Time**: < 100ms (p95)
- **Page Load Time**: < 2 seconds
- **Time to Interactive**: < 3 seconds
- **Database Query Time**: < 50ms (p95)
- **WebSocket Latency**: < 100ms

### Optimization Features

- **Database**: Connection pooling (HikariCP), query optimization, indexing
- **Caching**: Redis-based caching for frequent queries
- **CDN**: Static asset delivery via CDN (production)
- **Compression**: Gzip compression for text assets
- **HTTP/2**: Multiplexing support in Nginx
- **Lazy Loading**: Component and route-based code splitting
- **Image Optimization**: WebP format, responsive images

### Scalability

- **Horizontal Scaling**: Kubernetes auto-scaling based on CPU/memory
- **Database Replication**: PostgreSQL read replicas (planned)
- **Load Balancing**: Nginx with round-robin algorithm
- **Caching Strategy**: Redis cluster for distributed caching
- **Microservices**: Independent scaling of backend, frontend, AI service

---

## Contributing

We welcome contributions from the academic and developer communities!

### How to Contribute

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** your changes: `git commit -m 'feat: add amazing feature'`
4. **Push** to your branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

### Contribution Areas

- **Code**: Backend, Frontend, AI features
- **Documentation**: Improve guides, add examples
- **Testing**: Write tests, report bugs
- **Translation**: Localization (coming soon)
- **Design**: UI/UX improvements

### Development Guidelines

- Follow [Conventional Commits](https://www.conventionalcommits.org/) specification
- Write unit tests for new features (minimum 80% coverage)
- Update documentation for API changes
- Follow code style guides (Checkstyle for Java, ESLint for TypeScript)
- Review [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines

---

## Support

### Documentation & Resources

- **User Guide**: [docs/USER_GUIDE.md](docs/USER_GUIDE.md)
- **API Reference**: [docs/API_DOCUMENTATION.md](docs/API_DOCUMENTATION.md)
- **Deployment Guide**: [docs/DEPLOYMENT_GUIDE.md](docs/DEPLOYMENT_GUIDE.md)

### Community

- **GitHub Issues**: [Issue Tracker](https://github.com/olaflaitinen/nitor/issues)
- **GitHub Discussions**: [Community Forum](https://github.com/olaflaitinen/nitor/discussions)
- **LinkedIn**: [NITOR Academic Network](https://www.linkedin.com/company/nitor-academic-network)

### Professional Support

- **General Support**: support@nitor.io (Response: 24-48 hours)
- **Enterprise Support**: enterprise@nitor.io
- **Security Issues**: security@nitor.io (Response: 24 hours)
- **Sales & Licensing**: sales@nitor.io

---

## Roadmap

### Version 1.1 (Q2 2025)

- Mobile applications (iOS & Android with React Native)
- Advanced analytics dashboard with visualizations
- Citation network visualization and co-authorship graphs
- Enhanced AI features (15+ new capabilities)
- Multi-language support (Spanish, French, German, Chinese)

### Version 1.2 (Q3 2025)

- Institutional integrations and SSO
- Conference management system
- Grant collaboration tools
- Research group features and lab pages
- Enhanced search with Elasticsearch

### Version 2.0 (Q4 2025)

- Blockchain-based credential verification
- Comprehensive peer review platform
- Academic marketplace for services
- Video conferencing integration
- Advanced collaboration tools

---

## License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2025 NITOR Development Team

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## Acknowledgments

### Technologies

- **Spring Framework** - Comprehensive Java framework
- **React** - Modern UI library
- **Google Gemini** - Advanced AI capabilities
- **PostgreSQL** - Robust relational database
- **Redis** - High-performance caching
- **MinIO** - S3-compatible object storage

### Inspiration

Special thanks to the global academic community for inspiration and feedback. NITOR is built by researchers, for researchers.

---

## Project Statistics

| Metric | Value |
|--------|-------|
| **Total Lines of Code** | 30,000+ |
| **Backend Endpoints** | 121 |
| **AI Features** | 54 |
| **Database Tables** | 25+ |
| **Test Coverage** | 85%+ |
| **Documentation Pages** | 13 |
| **Docker Containers** | 6 |
| **Languages** | Java, TypeScript, JavaScript |
| **Supported Platforms** | Linux, macOS, Windows |
| **License** | MIT (Open Source) |

---

<div align="center">

**NITOR** • **Version 1.0.0** • **Production Ready** • **November 27, 2025**

Built with precision for the academic community.

[Website](https://nitor.io) •
[Documentation](docs/) •
[GitHub](https://github.com/olaflaitinen/nitor) •
[LinkedIn](https://www.linkedin.com/company/nitor-academic-network)

</div>
