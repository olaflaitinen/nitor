# Contributing to NITOR

We appreciate your interest in contributing to NITOR. This document provides guidelines for contributing to the project.

## Code of Conduct

By participating in this project, you agree to maintain a professional and respectful environment for all contributors.

## How to Contribute

### Reporting Issues

- Use the GitHub Issues tracker
- Provide a clear description of the issue
- Include steps to reproduce the problem
- Add relevant logs or error messages
- Specify your environment (OS, Java/Node version, etc.)

### Submitting Changes

1. **Fork the Repository**
   ```bash
   git clone https://github.com/your-org/nitor
   ```

2. **Create a Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make Your Changes**
   - Follow the existing code style
   - Add tests for new functionality
   - Update documentation as needed
   - Ensure all tests pass

4. **Commit Your Changes**
   ```bash
   git commit -m "feat: add new feature"
   ```

   Follow conventional commit format:
   - `feat:` New feature
   - `fix:` Bug fix
   - `docs:` Documentation changes
   - `test:` Adding tests
   - `refactor:` Code refactoring
   - `chore:` Maintenance tasks

5. **Push to Your Fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Submit a Pull Request**
   - Provide a clear description of the changes
   - Reference any related issues
   - Ensure CI checks pass

## Development Guidelines

### Backend (Java)

- Follow Java coding conventions
- Use Lombok annotations appropriately
- Write meaningful JavaDoc comments
- Add unit tests for new services
- Ensure database migrations are reversible

### Frontend (TypeScript/React)

- Follow TypeScript best practices
- Use functional components with hooks
- Maintain consistent styling with Tailwind CSS
- Add TypeScript interfaces for all props
- Write component tests

### API Development

- Follow RESTful principles
- Document endpoints with OpenAPI annotations
- Validate all inputs
- Handle errors appropriately
- Return consistent response formats

### Database

- Use Flyway for migrations
- Write reversible migrations when possible
- Add indexes for frequently queried columns
- Follow PostgreSQL naming conventions

## Testing

- Write unit tests for services
- Add integration tests for API endpoints
- Ensure test coverage is maintained
- Run tests before submitting PR

```bash
# Backend tests
cd packages/backend
mvn test

# Frontend tests
cd packages/frontend
npm test
```

## Code Review Process

1. All submissions require review
2. Reviewers will provide feedback
3. Address review comments
4. Maintain professional communication
5. Be patient with the review process

## Documentation

- Update README.md if adding new features
- Add API documentation for new endpoints
- Update CHANGELOG.md
- Include inline code comments for complex logic

## Questions

If you have questions, please:
- Check existing documentation
- Search existing issues
- Open a new issue for discussion

Thank you for contributing to NITOR.
