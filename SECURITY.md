# Security Policy

## Overview

NITOR maintains enterprise-grade security standards for protecting academic data, researcher information, and institutional assets. This policy outlines security practices, vulnerability reporting procedures, and incident response protocols.

**Security Contact:** security@nitor.io

---

## Supported Versions

| Version | Status | Security Support |
|---------|--------|------------------|
| 1.0.x   | Active | Full support |
| 0.9.x   | Legacy | Critical fixes only |
| < 0.9   | Unsupported | No support |

---

## Vulnerability Disclosure

### Reporting Process

**DO NOT** create public GitHub issues for security vulnerabilities.

**Report via:**
- Email: security@nitor.io
- Response time: Within 24 hours
- Status updates: Every 48-72 hours

**Include:**
- Vulnerability description
- Reproduction steps
- Affected components/versions
- Proof of concept
- Suggested remediation (optional)

### Severity Classification

**Critical (CVSS 9.0-10.0)**
- Remote code execution, authentication bypass
- Resolution: Emergency patch within 24 hours

**High (CVSS 7.0-8.9)**
- Privilege escalation, data exposure
- Resolution: Patch within 7 days

**Medium (CVSS 4.0-6.9)**
- XSS, insecure references, information disclosure
- Resolution: Next scheduled release (30 days)

**Low (CVSS 0.1-3.9)**
- Configuration issues, information leakage
- Resolution: Quarterly release

---

## Security Architecture

### Authentication

**JWT Token Security**
- HS256 signing (minimum 256-bit keys)
- Access tokens: 24 hours expiration
- Refresh tokens: 7 days with rotation
- Token revocation via Redis blacklist

**Two-Factor Authentication**
- TOTP-based (RFC 6238)
- Backup codes for recovery
- Mandatory for administrative accounts

**OAuth 2.0**
- Providers: Google, GitHub, LinkedIn
- Authorization Code flow with PKCE
- Token refresh rotation

**Password Requirements**
- Minimum 12 characters
- Complexity requirements enforced
- BCrypt hashing (work factor: 12)

### Data Protection

**Encryption**
- TLS 1.3 for data in transit
- AES-256 for sensitive data at rest
- Database field-level encryption for PII

**Data Classification**
1. Public: Published research, public profiles
2. Internal: Draft content, connections
3. Confidential: Email, credentials
4. Restricted: Admin access, audit logs

### API Security

**Protection Mechanisms**
- Input validation and sanitization
- Parameterized queries (SQL injection prevention)
- XSS protection (Content Security Policy)
- CSRF tokens (double-submit cookie)
- Request size limits (10MB)

**Rate Limiting**
- Authentication: 5 requests/minute
- API calls: 100 requests/minute
- Search queries: 50 requests/minute

### Infrastructure

**PostgreSQL Security**
- Role-based access control
- SSL/TLS required for connections
- Audit logging enabled
- Regular backups with encryption

**Redis Security**
- Password authentication required
- ACL-based access control
- TLS encryption enabled

**MinIO Security**
- Bucket policies (least privilege)
- Presigned URLs (15-minute expiration)
- Content-Type validation
- File size limits enforced

---

## Production Security Checklist

### Critical Requirements

**Environment Configuration**
- [ ] Change all default passwords
- [ ] Generate strong JWT secret (256+ bits)
- [ ] Enable HTTPS with valid certificates
- [ ] Configure restrictive CORS origins
- [ ] Enable audit logging
- [ ] Set up monitoring and alerting

**Network Security**
- [ ] Configure firewall rules
- [ ] Enable rate limiting
- [ ] Implement DDoS protection
- [ ] Restrict database access to app servers only
- [ ] Disable unnecessary services

**Access Control**
- [ ] Enable 2FA for admin accounts
- [ ] Implement least privilege principle
- [ ] Regular access review
- [ ] Rotate secrets every 90 days

---

## Secure Development

### Code Security Guidelines

**Required Practices**
- Never commit secrets to version control
- Use parameterized queries exclusively
- Validate all user inputs
- Sanitize all outputs
- Implement proper error handling
- Follow OWASP Top 10 guidelines

**Dependency Management**
```bash
# Check for vulnerabilities
npm audit
mvn dependency-check:check

# Update dependencies
npm update
mvn versions:use-latest-releases
```

### Code Review Checklist

- [ ] Authentication/authorization verified
- [ ] Input validation implemented
- [ ] SQL injection prevention confirmed
- [ ] XSS prevention confirmed
- [ ] CSRF protection enabled
- [ ] No sensitive data in logs
- [ ] Error messages sanitized
- [ ] No hardcoded secrets

---

## Incident Response

### Response Process

1. **Detection**: Automated monitoring, user reports, disclosure
2. **Assessment**: Severity classification, impact analysis
3. **Containment**: Threat isolation, access revocation
4. **Remediation**: Patching, configuration updates
5. **Recovery**: Service restoration, integrity verification
6. **Post-Incident**: Root cause analysis, documentation

### Communication Protocol

**Internal**
- Security team: Immediate
- Engineering: Within 1 hour
- Management: Within 4 hours

**External**
- Affected users: Within 24 hours
- Public disclosure: 30 days post-remediation
- Regulators: As required (GDPR: 72 hours)

---

## Compliance

### Regulatory Standards

**GDPR (General Data Protection Regulation)**
- Data minimization
- User consent management
- Right to erasure
- Data portability
- Breach notification (72 hours)

**ISO 27001 Alignment**
- Information security management
- Risk assessment procedures
- Security controls implementation

### Audit Logging

**Logged Events**
- Authentication attempts
- Authorization failures
- Data access operations
- Configuration changes
- Administrative actions
- Security triggers

**Retention**
- Application logs: 90 days
- Audit logs: 1 year
- Security incidents: 7 years

---

## Security Testing

### Automated Testing

- Daily: Dependency vulnerability scanning
- Daily: Static application security testing (SAST)
- Weekly: Dynamic application security testing (DAST)
- Monthly: Container image scanning

### Manual Testing

- Quarterly: Internal security review
- Annually: External penetration testing
- As needed: Incident-driven assessments

---

## Security Headers

```
Strict-Transport-Security: max-age=31536000; includeSubDomains
Content-Security-Policy: default-src 'self'
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
```

---

## Resources

### Security Tools
- Spring Security 6.x
- BCrypt password hashing
- OWASP Java Encoder
- Hibernate Validator
- Bucket4j rate limiting

### Documentation
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [OWASP API Security](https://owasp.org/www-project-api-security/)
- [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework)

---

## Contact

**Security Team**
- Email: security@nitor.io
- Response SLA: 24 hours

**Emergency**
- Subject: "URGENT: Security Incident"
- Response: 1 hour (business hours), 4 hours (outside)

---

**Last Updated:** 2025-11-25
**Version:** 2.0.0
**Next Review:** 2025-12-25
