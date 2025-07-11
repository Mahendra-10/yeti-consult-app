# Security Guide for YetiConsultApp

## CI/CD Pipeline Security

### GitHub Actions Workflow Security

Our CI/CD pipeline includes multiple security layers:

1. **Dependency Security**
   - Automated vulnerability scanning with `npm audit`
   - Outdated dependency detection
   - Regular security updates

2. **Code Security**
   - GitHub CodeQL analysis for security vulnerabilities
   - TypeScript type checking
   - ESLint code quality checks

3. **Build Security**
   - EAS builds with secure token management
   - Docker image security scanning
   - Non-interactive builds to prevent secrets exposure

### Required GitHub Secrets

Add these secrets in your GitHub repository (Settings → Secrets and variables → Actions):

| Secret Name | Description | Required |
|-------------|-------------|----------|
| `EXPO_TOKEN` | Expo access token for EAS builds | Yes (for builds) |
| `FIREBASE_SERVICE_ACCOUNT` | Firebase service account JSON | Yes (if using Firebase) |
| `FIREBASE_API_KEY` | Firebase API key | Yes (if using Firebase) |
| `FIREBASE_AUTH_DOMAIN` | Firebase auth domain | Yes (if using Firebase) |
| `FIREBASE_PROJECT_ID` | Firebase project ID | Yes (if using Firebase) |

### How to Add Secrets

1. Go to your GitHub repository
2. Navigate to Settings → Secrets and variables → Actions
3. Click "New repository secret"
4. Add each secret with the exact name above
5. **Never commit secrets to your code repository**

### Branch Protection Rules

Recommended settings for `main` and `develop` branches:

1. **Require status checks to pass before merging**
   - `build-and-test` job
   - `security-audit` job
   - `codeql-analysis` job

2. **Require pull request reviews**
   - At least 1 approving review
   - Dismiss stale reviews when new commits are pushed

3. **Restrict pushes that create files**
   - Prevent direct pushes to protected branches

## App Security Best Practices

### Environment Variables

- Store sensitive data in environment variables
- Use `EXPO_PUBLIC_` prefix for client-side variables
- Use regular environment variables for server-side secrets

### Firebase Security

1. **Firestore Rules**
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       // User can only access their own data
       match /users/{userId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
       
       // Group access rules
       match /groups/{groupId} {
         allow read, write: if request.auth != null && 
           (resource.data.members[request.auth.uid] != null || 
            resource.data.owner == request.auth.uid);
       }
     }
   }
   ```

2. **Authentication**
   - Use Firebase Auth for user authentication
   - Implement proper sign-in/sign-out flows
   - Store user tokens securely

### Data Security

1. **Sensitive Data Storage**
   - Use `expo-secure-store` for sensitive data
   - Never store passwords in plain text
   - Encrypt sensitive user data

2. **API Security**
   - Use HTTPS for all API calls
   - Implement proper authentication headers
   - Validate all user inputs

### Code Security

1. **Input Validation**
   - Validate all user inputs
   - Sanitize data before storing
   - Use TypeScript for type safety

2. **Error Handling**
   - Don't expose sensitive information in error messages
   - Log errors securely
   - Implement proper error boundaries

## Security Checklist

### Before Each Release

- [ ] Run `npm audit` and fix any vulnerabilities
- [ ] Update dependencies to latest secure versions
- [ ] Review CodeQL analysis results
- [ ] Test authentication flows
- [ ] Verify environment variables are properly set
- [ ] Check Firebase security rules
- [ ] Review access permissions

### Monthly Security Tasks

- [ ] Review and rotate secrets if needed
- [ ] Update dependencies
- [ ] Review access logs
- [ ] Check for new security advisories
- [ ] Update security documentation

## Incident Response

### If a Security Issue is Found

1. **Immediate Actions**
   - Assess the severity and scope
   - Contain the issue if possible
   - Document the incident

2. **Communication**
   - Notify relevant team members
   - Update stakeholders if necessary
   - Prepare public communication if needed

3. **Resolution**
   - Fix the root cause
   - Implement additional security measures
   - Update security documentation

### Contact Information

For security issues, please contact:
- **Security Team**: [Your Security Contact]
- **Emergency Contact**: [Emergency Contact]

## Additional Resources

- [Expo Security Documentation](https://docs.expo.dev/guides/security/)
- [Firebase Security Rules](https://firebase.google.com/docs/rules)
- [GitHub Security Features](https://docs.github.com/en/code-security)
- [OWASP Mobile Security](https://owasp.org/www-project-mobile-top-10/) 