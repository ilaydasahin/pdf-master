# GitHub Actions CI/CD Setup Guide

## Overview

This project uses GitHub Actions for automated CI/CD pipelines covering:

- Backend (.NET API) - Build, test, security scan, deployment
- Frontend (Next.js) - Lint, test, E2E, build, Vercel deployment
- Security - Vulnerability scanning, CodeQL analysis

---

## Workflows

### 1. Backend CI/CD (`backend-ci.yml`)

**Triggers:**

- Push to `main` or `develop` branches (when backend files change)
- Pull requests to `main`

**Jobs:**

- **build-and-test**: Restore, build, test, code coverage, security scan
- **deploy-production**: Publish and deploy to production (main branch only)

**Requirements:**

- .NET 9.0 SDK
- Azure/Docker credentials (for deployment)

---

### 2. Frontend CI/CD (`frontend-ci.yml`)

**Triggers:**

- Push to `main` or `develop` branches (when frontend files change)
- Pull requests to `main`

**Jobs:**

- **lint-and-type-check**: ESLint + TypeScript validation
- **test**: Vitest unit tests with coverage
- **e2e-tests**: Playwright E2E tests
- **build**: Production build
- **deploy-vercel**: Deploy to Vercel (main branch only)
- **lighthouse**: Performance audit post-deployment

**Requirements:**

- Node.js 18
- Vercel credentials

---

### 3. Security Scan (`security-scan.yml`)

**Triggers:**

- Weekly schedule (Mondays 9 AM UTC)
- Manual workflow dispatch
- Push to `main`

**Jobs:**

- **dependency-review**: Check for vulnerable dependencies (PRs)
- **backend-security**: .NET package vulnerabilities, security code scan
- **frontend-security**: npm audit, Snyk scan
- **codeql-analysis**: GitHub CodeQL static analysis (C#, JavaScript)

---

## Required Secrets

### GitHub Repository Secrets

Configure these in: `Repository Settings → Secrets and variables → Actions`

#### Backend Deployment:

```
AZURE_WEBAPP_NAME              # Azure App Service name
AZURE_WEBAPP_PUBLISH_PROFILE   # Azure publish profile XML
# OR for Docker:
DOCKER_REGISTRY                # Docker registry URL
DOCKER_USERNAME                # Docker username
DOCKER_PASSWORD                # Docker password/token
```

#### Frontend Deployment (Vercel):

```
VERCEL_TOKEN                   # Vercel CLI token
VERCEL_ORG_ID                  # Vercel organization ID
VERCEL_PROJECT_ID              # Vercel project ID
NEXT_PUBLIC_API_URL            # Production API URL
NEXT_PUBLIC_GA_ID              # Google Analytics ID
NEXT_PUBLIC_ADSENSE_ID         # Google AdSense Publisher ID
```

#### Code Coverage:

```
CODECOV_TOKEN                  # Codecov.io token (optional but recommended)
```

#### Security Scanning:

```
SNYK_TOKEN                     # Snyk API token (optional)
```

---

## Setup Instructions

### 1. Enable GitHub Actions

- Go to repository `Settings → Actions → General`
- Enable "Allow all actions and reusable workflows"
- Enable "Read and write permissions" for GITHUB_TOKEN

### 2. Configure Vercel Deployment

**Get Vercel Token:**

```bash
npm i -g vercel
vercel login
vercel link
```

**Get Organization and Project IDs:**

```bash
cat .vercel/project.json
```

Add to GitHub Secrets:

- `VERCEL_TOKEN`: From Vercel dashboard → Settings → Tokens
- `VERCEL_ORG_ID`: From `.vercel/project.json` → `orgId`
- `VERCEL_PROJECT_ID`: From `.vercel/project.json` → `projectId`

### 3. Configure Azure Deployment (Backend)

**Option A: Azure App Service**

1. Create Azure App Service (Linux, .NET 9)
2. Download publish profile: `App Service → Deployment Center → Manage publish profile`
3. Copy XML content to GitHub Secret: `AZURE_WEBAPP_PUBLISH_PROFILE`
4. Set `AZURE_WEBAPP_NAME` secret

**Option B: Docker Deployment**

1. Create Docker registry (Docker Hub, Azure ACR, etc.)
2. Add credentials to GitHub Secrets
3. Uncomment Docker deployment section in `backend-ci.yml`

### 4. Enable Code Coverage (Optional)

**Codecov:**

1. Sign up at https://codecov.io
2. Connect your GitHub repository
3. Copy upload token
4. Add to GitHub Secret: `CODECOV_TOKEN`

### 5. Enable CodeQL (Already configured)

- CodeQL is enabled by default for public repositories
- For private repos: Enable in Security → Code scanning

---

## Local Testing

### Test Backend Workflow Locally

```bash
# Build
dotnet build PdfTools.Api/PdfTools.Api.csproj --configuration Release

# Test
dotnet test PdfTools.Api/PdfTools.Api.csproj --configuration Release

# Security scan
dotnet list PdfTools.Api/PdfTools.Api.csproj package --vulnerable
```

### Test Frontend Workflow Locally

```bash
cd pdf-tools-client

# Lint
npm run lint

# Type check
npx tsc --noEmit

# Unit tests
npm run test

# E2E tests
npx playwright test

# Build
npm run build
```

---

## Workflow Status Badges

Add to README.md:

```markdown
[![Backend CI](https://github.com/YOUR_USERNAME/pdf-master/actions/workflows/backend-ci.yml/badge.svg)](https://github.com/YOUR_USERNAME/pdf-master/actions/workflows/backend-ci.yml)

[![Frontend CI](https://github.com/YOUR_USERNAME/pdf-master/actions/workflows/frontend-ci.yml/badge.svg)](https://github.com/YOUR_USERNAME/pdf-master/actions/workflows/frontend-ci.yml)

[![Security Scan](https://github.com/YOUR_USERNAME/pdf-master/actions/workflows/security-scan.yml/badge.svg)](https://github.com/YOUR_USERNAME/pdf-master/actions/workflows/security-scan.yml)
```

---

## Monitoring and Notifications

### Enable Slack/Discord Notifications (Optional)

Add to any workflow:

```yaml
- name: Notify deployment status
  if: always()
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

---

## Troubleshooting

### Common Issues:

**1. Workflow doesn't trigger:**

- Check file paths in `on.push.paths`
- Verify branch names match

**2. Deployment fails:**

- Check secrets are set correctly
- Verify credentials haven't expired
- Check deployment logs in Actions tab

**3. Tests fail:**

- Run tests locally first
- Check for environment-specific issues
- Review test logs in workflow run

**4. Build artifacts too large:**

- Add `.gitignore` patterns
- Clean unnecessary files before upload
- Use artifact retention policies

---

## Best Practices

✅ **Do:**

- Run lint and tests before merging PRs
- Monitor workflow execution times
- Keep secrets rotated regularly
- Use caching for dependencies
- Set reasonable artifact retention periods

❌ **Don't:**

- Commit secrets to code
- Skip security scans
- Deploy without tests passing
- Ignore failed workflow runs

---

## Next Steps

After setup:

1. Push code to GitHub to trigger workflows
2. Monitor first run in Actions tab
3. Review coverage reports
4. Configure deployment environments
5. Set up branch protection rules
6. Enable status checks for PRs
