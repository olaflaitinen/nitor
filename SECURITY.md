# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Reporting a Vulnerability

We take the security of NITOR seriously. If you discover a security vulnerability, please report it responsibly.

### How to Report

**Please DO NOT create a public GitHub issue for security vulnerabilities.**

Instead:
1. Email security concerns to: security@nitor.io (or repository maintainer)
2. Include detailed information about the vulnerability
3. Provide steps to reproduce if applicable
4. Allow reasonable time for response before public disclosure

### What to Include

- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if available)
- Your contact information

### Response Timeline

- **Initial Response**: Within 48 hours
- **Status Update**: Within 7 days
- **Fix Timeline**: Varies by severity

## Security Measures

### Authentication & Authorization

- **JWT Tokens**: Access tokens expire in 24 hours, refresh tokens in 7 days
- **Password Security**: BCrypt hashing with salt
- **Session Management**: Secure token storage and validation
- **CORS**: Configured for specific origins only

### Data Protection

- **Database**: PostgreSQL with parameterized queries (JPA)
- **SQL Injection**: Prevented through ORM usage
- **XSS Protection**: Input sanitization and output encoding
- **CSRF**: Token-based protection for state-changing operations

### API Security

- **Rate Limiting**: Implemented to prevent abuse
- **Input Validation**: All inputs validated using Jakarta Validation
- **Output Sanitization**: Responses sanitized before sending
- **Error Handling**: Generic error messages to prevent information leakage

### File Upload Security

- **File Type Validation**: Only allowed file types accepted
- **File Size Limits**: Maximum 10MB per file
- **Virus Scanning**: Recommended for production deployment
- **Secure Storage**: Files stored in MinIO with access controls

### Infrastructure Security

- **HTTPS**: Required for production deployment
- **Environment Variables**: Sensitive data stored securely
- **Container Security**: Docker images scanned for vulnerabilities
- **Dependency Updates**: Regular updates for security patches

## Security Best Practices

### For Developers

1. Never commit sensitive data (API keys, passwords, secrets)
2. Use environment variables for configuration
3. Keep dependencies up to date
4. Follow secure coding guidelines
5. Review code for security vulnerabilities
6. Use HTTPS in production
7. Implement proper error handling

### For Deployment

1. Use strong passwords and API keys
2. Enable HTTPS/TLS
3. Configure firewall rules
4. Regular security updates
5. Monitor logs for suspicious activity
6. Implement backup strategy
7. Use secure container registries

### For Users

1. Use strong, unique passwords
2. Enable two-factor authentication (when available)
3. Keep browser and software updated
4. Be cautious with email links
5. Report suspicious activity

## Known Security Considerations

### Development Mode

- Default credentials are used (change in production)
- Debug logging may expose sensitive information
- CORS is permissive for development

### Production Requirements

- Change all default passwords
- Use strong JWT secrets (256-bit minimum)
- Configure restrictive CORS policies
- Enable HTTPS/TLS
- Implement proper monitoring
- Regular security audits

## Security Updates

Security updates will be released as needed. Check:
- GitHub Security Advisories
- CHANGELOG.md for security-related changes
- Release notes for security patches

## Compliance

This project aims to follow:
- OWASP Top 10 security practices
- Industry-standard authentication methods
- Data protection principles
- Secure development lifecycle

## Third-Party Dependencies

We regularly monitor and update dependencies for security vulnerabilities:
- Backend: Maven dependency check
- Frontend: npm audit
- Automated security scanning in CI/CD

## Contact

For security-related inquiries:
- Email: security@nitor.io
- Encrypted communication available upon request

## Acknowledgments

We appreciate responsible disclosure and may acknowledge security researchers who report vulnerabilities (with permission).

---

**Last Updated**: 2025-11-23
**Version**: 1.0.0
