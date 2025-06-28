# Contributing to Car Rental SaaS Platform

Thank you for your interest in contributing to our car rental SaaS platform! We welcome contributions from the community and are grateful for any help you can provide.

## 🤝 How to Contribute

### Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When creating a bug report, please include:

- **Clear description** of the issue
- **Steps to reproduce** the behavior
- **Expected behavior** vs actual behavior
- **Screenshots** if applicable
- **Environment details** (OS, browser, Node.js version)
- **Additional context** that might be helpful

### Suggesting Enhancements

Enhancement suggestions are welcome! Please provide:

- **Clear description** of the enhancement
- **Use case** and why it would be useful
- **Possible implementation** approach if you have ideas
- **Examples** from other platforms if relevant

### Pull Requests

1. **Fork the repository** and create your branch from `main`
2. **Install dependencies** and set up the development environment
3. **Make your changes** following our coding standards
4. **Add tests** for new functionality
5. **Update documentation** if needed
6. **Test your changes** thoroughly
7. **Submit a pull request** with a clear description

## 🛠️ Development Setup

### Prerequisites
- Node.js 18+
- MySQL 8.0+
- Git

### Setup Steps
```bash
# Clone your fork
git clone https://github.com/yourusername/car-rental-saas.git
cd car-rental-saas

# Install dependencies
npm install
cd backend && npm install && cd ..

# Set up database
mysql -u root -p
CREATE DATABASE car_rental_platform_dev;
mysql -u root -p car_rental_platform_dev < database/schema.sql

# Configure environment
cp backend/.env.example backend/.env
# Edit backend/.env with your settings

# Start development servers
npm run dev
```

## 📝 Coding Standards

### TypeScript
- Use TypeScript for all new code
- Define proper interfaces and types
- Avoid `any` type unless absolutely necessary
- Use meaningful variable and function names

### React Components
- Use functional components with hooks
- Follow the single responsibility principle
- Use proper prop types and interfaces
- Implement proper error boundaries

### Code Style
- Use Prettier for code formatting
- Follow ESLint rules
- Use meaningful commit messages
- Write self-documenting code with comments where needed

### Database
- Follow existing naming conventions
- Use proper foreign key relationships
- Add appropriate indexes for performance
- Include migration scripts for schema changes

## 🧪 Testing

### Frontend Testing
```bash
# Run frontend tests
npm test

# Run tests with coverage
npm run test:coverage
```

### Backend Testing
```bash
# Run backend tests
cd backend
npm test

# Run integration tests
npm run test:integration
```

### Manual Testing
- Test all affected functionality
- Verify responsive design on different screen sizes
- Test with different user roles (admin, agency, client)
- Check browser compatibility

## 📚 Documentation

### Code Documentation
- Add JSDoc comments for functions and classes
- Document complex business logic
- Update README.md for new features
- Include examples in documentation

### API Documentation
- Document new API endpoints
- Include request/response examples
- Update Postman collections if applicable
- Document authentication requirements

## 🔄 Git Workflow

### Branch Naming
- `feature/description` - New features
- `bugfix/description` - Bug fixes
- `hotfix/description` - Critical fixes
- `docs/description` - Documentation updates

### Commit Messages
Follow conventional commits format:
```
type(scope): description

[optional body]

[optional footer]
```

Examples:
- `feat(auth): add JWT refresh token functionality`
- `fix(dashboard): resolve vehicle count display issue`
- `docs(readme): update installation instructions`

### Pull Request Process

1. **Update your branch** with the latest main
2. **Run tests** and ensure they pass
3. **Update documentation** if needed
4. **Create pull request** with:
   - Clear title and description
   - Link to related issues
   - Screenshots for UI changes
   - Testing instructions

## 🏷️ Issue Labels

- `bug` - Something isn't working
- `enhancement` - New feature or request
- `documentation` - Improvements or additions to docs
- `good first issue` - Good for newcomers
- `help wanted` - Extra attention is needed
- `priority: high` - High priority issues
- `priority: low` - Low priority issues

## 🎯 Areas for Contribution

### High Priority
- Bug fixes and performance improvements
- Test coverage improvements
- Documentation enhancements
- Accessibility improvements

### Medium Priority
- New features from the roadmap
- UI/UX improvements
- Code refactoring
- Integration with third-party services

### Low Priority
- Code style improvements
- Minor feature enhancements
- Example applications
- Tutorials and guides

## 📞 Getting Help

If you need help with contributing:

- **GitHub Discussions** - For general questions
- **GitHub Issues** - For specific problems
- **Email** - contribute@yourplatform.com
- **Discord** - Join our community server

## 🏆 Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes for significant contributions
- Special contributor badge in Discord
- Annual contributor appreciation post

## 📋 Checklist for Contributors

Before submitting a pull request:

- [ ] Code follows the style guidelines
- [ ] Self-review of the code completed
- [ ] Code is commented, particularly in hard-to-understand areas
- [ ] Corresponding changes to documentation made
- [ ] Tests added that prove the fix is effective or feature works
- [ ] New and existing unit tests pass locally
- [ ] Any dependent changes have been merged and published

## 🚫 What Not to Contribute

Please avoid:
- Cosmetic changes without functional improvements
- Breaking changes without discussion
- Code that doesn't follow our standards
- Features that don't align with project goals
- Duplicate functionality

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to the Car Rental SaaS Platform! 🚗✨
