# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-11-23

### Added

#### Backend
- Java Spring Boot 3.2 backend with complete REST API
- JWT-based authentication system with access and refresh tokens
- User registration and login endpoints
- Profile management with CV components (education, experience, projects)
- Content management system for posts and articles
- Threaded comment system with nested replies
- Notification system with read/unread tracking
- File upload service with MinIO integration
- Email service for verification and notifications
- PostgreSQL database with Flyway migrations (3 migration files)
- Redis caching layer
- Global exception handling
- Input validation with Jakarta Validation
- OpenAPI/Swagger documentation
- CORS configuration
- Rate limiting support
- 8 service classes implementing business logic
- 10 REST controllers with 60+ endpoints
- 9 JPA repositories with custom queries
- 8 entity models with proper relationships
- Security utilities for JWT handling

#### Frontend
- React 19 with TypeScript 5.8
- Vite 6 build system
- Complete API client with 60+ methods
- JWT token management with auto-refresh
- Axios interceptors for authentication
- All UI components migrated to monorepo structure
- LaTeX/KaTeX support for mathematical expressions
- File upload integration
- Environment configuration

#### AI Service
- Node.js Express server
- Google Gemini 2.0 Flash integration
- Text refinement endpoint
- Abstract generation endpoint
- Bio enhancement endpoint
- Rate limiting
- Health check endpoint

#### Infrastructure
- Docker Compose orchestration for 6 services
- Multi-stage Dockerfile for backend
- Nginx configuration for frontend
- PostgreSQL 15 database
- Redis 7 cache
- MinIO S3-compatible storage
- Health checks for all services
- Volume persistence
- Network configuration

#### DevOps
- Startup script (start-dev.sh)
- Shutdown script (stop-dev.sh)
- Environment variable configuration
- Docker health checks
- Logging configuration

#### Documentation
- Professional README.md
- MONOREPO_SETUP.md with detailed instructions
- IMPLEMENTATION_STATUS.md tracking progress
- FINAL_SETUP_GUIDE.md for production deployment
- CONTRIBUTING.md for contributors
- SECURITY.md for security policies
- API documentation via Swagger

### Changed
- Migrated from Supabase to self-hosted PostgreSQL
- Replaced Supabase Auth with JWT authentication
- Converted from Next.js to React + Vite
- Restructured project as monorepo
- Updated all dependencies to latest versions

### Removed
- Supabase dependencies completely removed
- Next.js dependencies removed
- Legacy authentication system removed

### Fixed
- JWT user ID extraction in controllers
- Security utilities for proper authentication
- CORS configuration for multiple origins
- Database migration ordering

### Security
- Implemented BCrypt password hashing
- Added JWT token expiration
- Configured CORS protection
- Added rate limiting
- Input validation on all endpoints
- SQL injection prevention through JPA
- Secure file upload validation

---

## [Unreleased]

### Planned
- Unit tests for all services
- Integration tests for API endpoints
- CI/CD pipeline with GitHub Actions
- WebSocket support for real-time features
- Advanced search with Elasticsearch
- Email template system
- Two-factor authentication
- API rate limiting per user
- Monitoring dashboards
- Performance optimizations

---

## Version History

- **1.0.0** - Initial production release with complete monorepo setup
- All core features implemented
- Full backend API with 60+ endpoints
- Complete frontend integration
- AI service operational
- Docker deployment ready
- Production-ready with security measures

---

**Maintained by**: NITOR Development Team
**Repository**: https://github.com/your-org/nitor
