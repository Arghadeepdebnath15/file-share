# Offline Migration Plan for File QR Backup System

## Current Internet Dependencies

### 1. MongoDB Atlas Connection
- **File**: `backend/server.js`
- **Issue**: Uses cloud-based MongoDB Atlas (`mongodb+srv://...`)
- **Impact**: Database operations fail without internet

### 2. Google Fonts Dependency
- **File**: `frontend/src/App.tsx`
- **Issue**: Loads Poppins font from Google Fonts CDN
- **Impact**: Fonts won't load without internet

### 3. External API Calls (Potential)
- **Files**: Various frontend components using axios/fetch
- **Issue**: All API calls currently point to local backend, but could be external
- **Impact**: Local API calls should work if backend runs locally

## Migration Steps

### Phase 1: Database Migration
1. **Install Local MongoDB**
   - Download and install MongoDB Community Edition
   - Set up local MongoDB instance

2. **Update Database Connection**
   - Modify `backend/server.js` to use local MongoDB URI
   - Change from: `mongodb+srv://...` to `mongodb://localhost:27017/qr-file-share`

3. **Data Migration (Optional)**
   - Export data from MongoDB Atlas
   - Import into local MongoDB

### Phase 2: Frontend Dependencies
1. **Remove Google Fonts**
   - Remove Poppins font import from `App.tsx`
   - Use system fonts as fallback

2. **Local Font Alternative (Optional)**
   - Download Poppins font files
   - Host locally and update CSS

### Phase 3: Configuration Updates
1. **Update API URL Configuration**
   - Ensure `frontend/src/config.ts` uses local backend
   - Current: `http://192.168.0.102:5000` (should work locally)

2. **Environment Setup**
   - Create local environment files
   - Set up proper development/production configurations

### Phase 4: Testing
1. **Local Network Testing**
   - Test backend on localhost
   - Test frontend connecting to local backend
   - Test file upload/download functionality

2. **Offline Testing**
   - Disconnect internet
   - Verify all functionality works
   - Test QR code generation and scanning

## Files to Modify

### 1. backend/server.js
```javascript
// Change from:
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://...';

// Change to:
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/qr-file-share';
```

### 2. frontend/src/App.tsx
```typescript
// Remove or comment out:
const poppinsFont = document.createElement('link');
poppinsFont.rel = 'stylesheet';
poppinsFont.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap';
document.head.appendChild(poppinsFont);

// Update typography to use system fonts:
typography: {
  fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  // ... rest remains same
}
```

## Prerequisites
- Node.js and npm installed
- MongoDB Community Edition installed locally
- All existing npm dependencies installed

## Expected Outcome
After these changes, the application should:
- Run completely offline
- Use local MongoDB database
- Function without external dependencies
- Maintain all existing features (file upload, QR generation, download)
