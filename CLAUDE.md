# fmw-insurance-portal

## 🚫 Build & Deployment - CRITICAL

### NO LOCAL BUILDS - DO NOT ASK CHARLEY TO BUILD LOCALLY

- ❌ We do **NOT** build locally
- ✅ All builds happen in **Google Cloud Console**
- ✅ Build process: `git push` → Cloud Build → Cloud Run/Firebase

### Backend API

- All API calls go to: `https://bodyf1rst-backend-clean-mdkalcrowq-uc.a.run.app`
- Backend repo: `BodyF1rst-Backend-CLEAN`
- Authentication: Laravel Sanctum tokens

### Deployment Method

- Platform: Cloud Build → Cloud Run or Firebase Hosting
- Triggered by: Git push to `main` branch (automatic)
- Secrets: Google Secret Manager (NOT local .env files)
- Build config: `cloudbuild.yaml` or `.github/workflows/*.yml`

### For Developers

- ❌ DO NOT run `npm run build` or production builds locally
- ❌ DO NOT use local .env files for production values
- ✅ Testing: Use dev server with API pointing to bodyf1rst-backend-clean-mdkalcrowq-uc.a.run.app
- ✅ Secrets: Fetch from Google Secret Manager when needed

---

