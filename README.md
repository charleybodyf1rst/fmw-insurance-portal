# fmw-insurance-portal

# Build & Deployment

## 🚫 NO LOCAL BUILDS

**DO NOT BUILD LOCALLY - All builds happen in Google Cloud Console**

- Build process: `git push` → Cloud Build → Deploy
- Backend API: `https://bodyf1rst-backend-clean-mdkalcrowq-uc.a.run.app`
- Secrets: Google Secret Manager (not local .env)

For development:
- Use dev server (`npm run dev` or equivalent)
- Point to production API: `https://bodyf1rst-backend-clean-mdkalcrowq-uc.a.run.app`

---

