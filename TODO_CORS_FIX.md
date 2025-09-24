# TODO: Fix CORS Errors for Local Development

## Steps to Complete
- [x] Update vercel.json to include CORS headers for /api/* routes allowing localhost:3000
- [ ] Commit and push the changes to the repository
- [ ] Redeploy the project on Vercel to apply the new CORS headers
- [ ] Test the frontend locally (npm run client) to verify CORS errors are resolved
- [ ] If needed, update CORS origins for production (netlify URL) in vercel.json

## Notes
- CORS headers added: Access-Control-Allow-Origin: http://localhost:3000, Methods: GET,POST,PUT,DELETE,OPTIONS, Headers: Content-Type, device-id, Credentials: true
- This allows the local frontend to access the Vercel-deployed API without CORS errors
