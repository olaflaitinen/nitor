# Contributing to NITOR

Thank you for your interest in contributing to NITOR Academic Social Network Platform. This guide outlines the process and standards for contributing to this project.

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Process](#development-process)
- [Coding Standards](#coding-standards)
- [Testing Requirements](#testing-requirements)
- [Documentation](#documentation)
- [Pull Request Process](#pull-request-process)
- [Security](#security)

---

## Code of Conduct

By participating in this project, you agree to maintain a professional, respectful, and inclusive environment. Please review our [Code of Conduct](CODE_OF_CONDUCT.md).

---

## Getting Started

### Prerequisites

**Required Software:**
- Java 17 or higher
- Node.js 20 or higher
- PostgreSQL 15 or higher
- Redis 7 or higher
- Maven 3.9 or higher
- Git 2.30 or higher

### Development Environment Setup

**1. Fork and Clone**
```bash
git clone https://github.com/YOUR_USERNAME/nitor.git
cd nitor
```

**2. Configure Environment**
```bash
cp .env.example .env
# Edit .env with your local configuration
```

**3. Install Dependencies**
```bash
# Backend
cd packages/backend
mvn clean install

# Frontend
cd packages/frontend
npm install

# AI Service
cd packages/ai-service
npm install
```

**4. Start Development Services**
```bash
# Start all services
./scripts/start-dev.sh

# Or start individually
cd packages/backend && mvn spring-boot:run
cd packages/ai-service && npm run dev
cd packages/frontend && npm run dev
```

---

## Development Process

### Branch Strategy

**Main Branches:**
- `main` - Production-ready code
- `develop` - Integration branch for features

**Feature Branches:**
```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Create bugfix branch
git checkout -b fix/bug-description

# Create documentation branch
git checkout -b docs/documentation-update
```

### Commit Message Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):

**Format:**
```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only changes
- `style`: Code formatting (no logic changes)
- `refactor`: Code restructuring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Maintenance tasks
- `security`: Security improvements

**Examples:**
```bash
feat(auth): add two-factor authentication support

Implements TOTP-based 2FA using RFC 6238 standard.
Includes backup codes and QR code generation.

Closes #123

fix(api): correct pagination offset calculation

The offset was being calculated incorrectly for page numbers
greater than 10, causing incorrect results.

Fixes #456

docs(readme): update installation instructions

Added clarification for PostgreSQL version requirements
and included troubleshooting section.
```

---

## Coding Standards

### Backend (Java/Spring Boot)

**Code Style:**
- Follow [Google Java Style Guide](https://google.github.io/styleguide/javaguide.html)
- Use Lombok annotations appropriately
- Maintain 80-character line limit
- Use meaningful variable and method names

**Structure:**
```java
@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    /**
     * Creates a new user account.
     *
     * @param request User registration data
     * @return Created user entity
     * @throws EmailAlreadyExistsException if email is taken
     */
    @Transactional
    public User createUser(RegisterRequest request) {
        // Implementation
    }
}
```

**Best Practices:**
- Use constructor injection (via `@RequiredArgsConstructor`)
- Add `@Transactional` for database operations
- Implement proper exception handling
- Write JavaDoc for public methods
- Use Optional for nullable returns
- Validate inputs with Jakarta Validation

### Frontend (TypeScript/React)

**Code Style:**
- Follow [Airbnb TypeScript Style Guide](https://github.com/airbnb/javascript)
- Use functional components with hooks
- Maintain strict TypeScript configuration
- Use Tailwind CSS for styling

**Component Structure:**
```typescript
interface UserProfileProps {
  userId: string;
  onUpdate?: (user: User) => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({
  userId,
  onUpdate
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, [userId]);

  const loadUser = async () => {
    try {
      const data = await api.getUser(userId);
      setUser(data);
    } catch (error) {
      console.error('Failed to load user:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!user) return <ErrorMessage />;

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Component content */}
    </div>
  );
};
```

**Best Practices:**
- Define TypeScript interfaces for all props
- Use React hooks (useState, useEffect, useCallback)
- Implement proper error boundaries
- Memoize expensive computations
- Use semantic HTML elements
- Ensure accessibility (ARIA labels, keyboard navigation)

### API Development

**RESTful Principles:**
- Use appropriate HTTP methods (GET, POST, PUT, PATCH, DELETE)
- Return proper status codes
- Use plural nouns for resources
- Implement HATEOAS where appropriate

**Endpoint Structure:**
```
GET    /api/users              - List users
GET    /api/users/{id}         - Get user
POST   /api/users              - Create user
PUT    /api/users/{id}         - Update user (full)
PATCH  /api/users/{id}         - Update user (partial)
DELETE /api/users/{id}         - Delete user

GET    /api/users/{id}/posts   - Get user's posts
POST   /api/users/{id}/posts   - Create post for user
```

**Request/Response Format:**
```json
{
  "data": {
    "id": "123",
    "type": "user",
    "attributes": {
      "name": "Dr. Jane Smith",
      "email": "jane@university.edu"
    },
    "relationships": {
      "institution": {
        "data": { "id": "456", "type": "institution" }
      }
    }
  },
  "meta": {
    "timestamp": "2025-11-25T12:00:00Z"
  }
}
```

### Database

**Migration Guidelines:**
- Use Flyway for all schema changes
- Make migrations reversible when possible
- Test migrations on sample data
- Document breaking changes

**Naming Conventions:**
```sql
-- Tables: plural, snake_case
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes: idx_table_column
CREATE INDEX idx_users_email ON users(email);

-- Foreign keys: fk_table_referenced_table
ALTER TABLE posts
  ADD CONSTRAINT fk_posts_users
  FOREIGN KEY (user_id) REFERENCES users(id);
```

---

## Testing Requirements

### Unit Tests

**Backend:**
```java
@SpringBootTest
@Transactional
class UserServiceTest {

    @Autowired
    private UserService userService;

    @Test
    void createUser_WithValidData_ShouldSucceed() {
        // Arrange
        RegisterRequest request = new RegisterRequest(
            "test@example.com",
            "SecurePassword123!"
        );

        // Act
        User user = userService.createUser(request);

        // Assert
        assertThat(user.getEmail()).isEqualTo("test@example.com");
        assertThat(user.getId()).isNotNull();
    }
}
```

**Frontend:**
```typescript
import { render, screen, waitFor } from '@testing-library/react';
import { UserProfile } from './UserProfile';

describe('UserProfile', () => {
  it('renders user information correctly', async () => {
    render(<UserProfile userId="123" />);

    await waitFor(() => {
      expect(screen.getByText('Dr. Jane Smith')).toBeInTheDocument();
    });
  });
});
```

### Integration Tests

**API Endpoint Testing:**
```java
@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
class UserControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void getUser_WithValidId_ShouldReturnUser() throws Exception {
        mockMvc.perform(get("/api/users/123"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.email").value("test@example.com"));
    }
}
```

### Test Coverage Requirements

- **Minimum Coverage:** 70% overall
- **Critical Paths:** 90% coverage
- **New Features:** 80% coverage required for PR approval

**Run Tests:**
```bash
# Backend
mvn test
mvn verify  # Integration tests

# Frontend
npm test
npm run test:coverage

# E2E Tests
npm run test:e2e
```

---

## Documentation

### Code Documentation

**JavaDoc (Backend):**
```java
/**
 * Authenticates a user with email and password.
 *
 * @param email User's email address
 * @param password User's password
 * @return Authentication token
 * @throws InvalidCredentialsException if credentials are invalid
 * @throws AccountLockedException if account is locked
 */
public AuthToken authenticate(String email, String password) {
    // Implementation
}
```

**JSDoc (Frontend):**
```typescript
/**
 * Fetches user profile data from the API.
 *
 * @param userId - Unique identifier of the user
 * @returns Promise resolving to user data
 * @throws {ApiError} When the request fails
 */
async function getUserProfile(userId: string): Promise<User> {
  // Implementation
}
```

### API Documentation

- Update OpenAPI/Swagger annotations
- Include request/response examples
- Document error codes
- Specify authentication requirements

### README Updates

- Add new features to feature list
- Update installation instructions if needed
- Include configuration examples
- Update troubleshooting section

---

## Pull Request Process

### Before Submitting

**Checklist:**
- [ ] Code follows project style guidelines
- [ ] All tests pass locally
- [ ] New tests added for new features
- [ ] Documentation updated
- [ ] Commit messages follow convention
- [ ] No merge conflicts with target branch
- [ ] Code reviewed by yourself first
- [ ] No console.log or debug statements
- [ ] No commented-out code
- [ ] Environment variables documented

### PR Template

```markdown
## Description
Brief description of changes made.

## Type of Change
- [ ] Bug fix (non-breaking change fixing an issue)
- [ ] New feature (non-breaking change adding functionality)
- [ ] Breaking change (fix or feature causing existing functionality to change)
- [ ] Documentation update

## Related Issues
Fixes #(issue number)

## Testing
Describe testing performed:
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing performed

## Screenshots (if applicable)
Add screenshots for UI changes

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex logic
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Tests added and passing
- [ ] Dependent changes merged
```

### Review Process

1. **Automated Checks** - CI/CD pipeline runs
2. **Code Review** - At least one approval required
3. **Testing** - QA testing for major features
4. **Approval** - Maintainer approval
5. **Merge** - Squash and merge to target branch

**Review Timeline:**
- Initial response: 24-48 hours
- Follow-up reviews: 24 hours
- Approval/merge: After all checks pass

---

## Security

### Security Guidelines

**Never Commit:**
- API keys or secrets
- Database credentials
- OAuth client secrets
- Private keys
- Environment files (.env)

**Security Checklist:**
- [ ] Input validation implemented
- [ ] Output sanitization applied
- [ ] SQL injection prevention verified
- [ ] XSS prevention verified
- [ ] CSRF protection enabled
- [ ] Authentication required
- [ ] Authorization checks in place
- [ ] Rate limiting applied
- [ ] Sensitive data encrypted
- [ ] Error messages sanitized

### Reporting Security Issues

**DO NOT** create public issues for security vulnerabilities.

Report to: security@nitor.io

See [SECURITY.md](SECURITY.md) for details.

---

## Questions and Support

**Documentation:**
- [README.md](README.md) - Project overview
- [API_DOCUMENTATION.md](docs/API_DOCUMENTATION.md) - API reference
- [DEPLOYMENT_GUIDE.md](docs/DEPLOYMENT_GUIDE.md) - Deployment instructions
- [USER_GUIDE.md](docs/USER_GUIDE.md) - End-user guide

**Community:**
- GitHub Discussions - General questions
- GitHub Issues - Bug reports and feature requests
- Email: support@nitor.io - Direct support

**Response Times:**
- Bug reports: 48 hours
- Feature requests: 1 week
- Questions: 72 hours

---

## License

By contributing to NITOR, you agree that your contributions will be licensed under the MIT License.

---

## Recognition

Contributors will be acknowledged in:
- CONTRIBUTORS.md file
- Release notes
- Project documentation

Thank you for contributing to NITOR and supporting academic research collaboration!

---

**Last Updated:** 2025-11-25
**Version:** 2.0.0
