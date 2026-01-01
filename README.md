# fmw-insurance-portal

# Build & Deployment

## 🚫 NO LOCAL BUILDS

**DO NOT BUILD LOCALLY - All builds happen in Google Cloud Console**

- Build process: `git push` → Cloud Build → Deploy
- Backend API: `https://api.bodyf1rst.net`
- Secrets: Google Secret Manager (not local .env)

For development:
- Use dev server (`npm run dev` or equivalent)
- Point to production API: `https://api.bodyf1rst.net`

---

