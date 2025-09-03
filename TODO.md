# QR Code URL Fix - Progress Tracking

## Completed Tasks
- [x] Updated UploadQRCode.tsx to import API_URL from config.ts
- [x] Modified QR code URL generation to use API_URL instead of window.location.hostname
- [x] Ensured consistent backend URL usage across components
- [x] Created .env file with REACT_APP_API_URL configuration
- [x] Verified config.ts properly uses environment variable

## Next Steps
- [x] Set REACT_APP_API_URL environment variable in Netlify deployment to your Render backend URL
- [x] Redeploy frontend to Netlify with the new environment variable
- [ ] Debug AxiosError during file upload
- [ ] Test QR code scanning on mobile devices
- [ ] Verify file upload functionality works with new URL
- [ ] Test download QR codes in RecentFiles component

## Debugging AxiosError

### Step 1: Verify Environment Variable
1. Open your deployed Netlify site
2. Open browser developer tools (F12)
3. Go to Console tab
4. Type: `console.log(process.env.REACT_APP_API_URL)`
5. Should output your Render backend URL

### Step 2: Test Backend Connectivity
1. Open new browser tab
2. Go to: `https://your-render-backend.onrender.com/api/files/upload-page`
3. Should load the mobile upload page

### Step 3: Check Network Requests
1. Open browser developer tools (F12)
2. Go to Network tab
3. Try uploading a file
4. Look for the upload request and check:
   - Request URL (should point to Render backend)
   - Status code
   - Response body for error details

### Step 4: Check Console for Detailed Errors
1. Open browser developer tools (F12)
2. Go to Console tab
3. Try uploading a file
4. Look for detailed error messages (not just "AxiosError")

### Common Issues & Solutions

#### Issue: Still pointing to localhost
**Solution**: Ensure REACT_APP_API_URL is set correctly in Netlify environment variables

#### Issue: CORS error
**Solution**: Backend CORS is configured for your Netlify domain, but verify the exact domain matches

#### Issue: Network error
**Solution**: Check if Render backend is running and accessible

#### Issue: 404 error
**Solution**: Verify the upload endpoint exists and is accessible

## Environment Variable Setup Instructions

### For Netlify Deployment:
1. Go to your Netlify dashboard
2. Select your site (filetnf.netlify.app)
3. Go to Site Settings > Environment Variables
4. Add a new variable:
   - Key: `REACT_APP_API_URL`
   - Value: Your Render backend URL (e.g., `https://your-backend.onrender.com`)
5. Redeploy your site to apply the changes

### For Local Development:
- The .env file is already configured with `REACT_APP_API_URL=http://localhost:5000`
- This will be used automatically when running locally

## Notes
- The fix ensures QR codes point to the correct backend URL
- API_URL should be set to the deployed backend URL in production
- For local development, API_URL defaults to http://localhost:5000
- Make sure your Render backend allows CORS from your Netlify domain
