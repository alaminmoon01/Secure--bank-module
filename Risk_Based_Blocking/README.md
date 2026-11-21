# Risk Based Blocking

This folder contains copies of source files related to this feature from the main SecureBank project.

- Original paths are preserved under `source/` for easy tracing.
- Some files are shared by multiple features, so the same source file may appear in more than one feature folder.
- These feature folders are for team separation/review; they are not standalone applications. Run the complete project from the main `backend/` and `frontend/` folders.
- Do not edit only a copied file here and expect the main app to change; make final changes in the matching original path in the main project, then copy the update back if needed.


## API endpoint
Admin risk records are loaded from `GET /api/admin/risk-based-blocking`. The endpoint is registered in `backend/routes/admin.routes.js`, which is mounted by `backend/server.js` at `/api/admin`.
