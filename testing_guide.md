# SellIt - Frontend-Only Testing Guide

This guide explains how to test the SellIt application in its frontend-only configuration. In this mode, the application runs entirely in the browser, using `localStorage` for data persistence and client-side API calls for AI features.

## Prerequisites Checklist

- ✅ Node.js installed (v18+)
- ✅ Dependencies installed (`npm install`)
- ✅ `.env.local` file configured with `VITE_GEMINI_API_KEY`

---

## Quick Start Commands

### 1. Setup Environment
```bash
# Copy template
cp .env.example .env.local

# Edit .env.local and add your VITE_GEMINI_API_KEY
```

### 2. Run the Application
```bash
npm run dev
```

### 3. Access the Application
Open browser to: **http://localhost:3000**

---

## Testing Checklist

### 🔐 Authentication Flow
- [ ] **Sign Up:** Enter details. Click "Create Account".
- [ ] **Verification:** Enter any 4-digit code (mocked).
- [ ] **Login:** Use any credentials or the ones you just created.
- [ ] **Persistence:** Refresh the page. You should remain logged in.
- [ ] **Logout:** Click Logout in Profile. Verify you are redirected to Login.

### 🏠 Dashboard & Persistence
- [ ] **Listings:**
  - Create a new listing (Upload image, fill details).
  - Verify it appears in "My Listings" and Home feed.
  - Refresh page. **Verify listing is still there.**
- [ ] **Saved Items:**
  - Heart a listing.
  - Refresh page. **Verify it remains saved.**
- [ ] **Broadcasts:**
  - Create a "Broadcast" request.
  - Refresh page. **Verify it persists.**

### 💬 Messaging
- [ ] Start a chat from a listing or support.
- [ ] Send messages.
- [ ] Refresh page. **Verify chat history is preserved.**

### 🤖 AI Features
- [ ] **Smart Advice:** Open AI Assistant and ask for selling tips.
- [ ] **Price Suggestion:** In Listing Form, use "Suggest Price" (if implemented).
- [ ] **Note:** These require a valid `VITE_GEMINI_API_KEY`.

---

## Important Notes & Limitations

### Data Persistence
- **Storage:** All data (users, listings, chats) is stored in your browser's `localStorage`.
- **Browser Clearing:** Clearing browser cache/cookies will **erase all data**.
- **Cross-Device:** Data does NOT sync between devices or browsers.

### Security
- **API Keys:** Your Gemini API key is exposed in the browser network traffic. This is acceptable for development/demos but unsafe for production.
- **Authentication:** Login is simulated. Any password works for a known email.

### Deployment
- This app is ready for static hosting (Vercel, Netlify).
- See `vercel.json` and `netlify.toml` for configuration.

---

## Troubleshooting

### App Won't Start
- **Error:** `VITE_GEMINI_API_KEY is missing`
- **Fix:** Ensure `.env.local` exists and contains the key. Restart the server.

### Images Not Loading
- **Issue:** Old images from previous versions might be broken.
- **Fix:** Clear `localStorage` (via DevTools Application tab) to reset to seed data.

### Resetting Data
To reset the application to its initial state:
1. Open DevTools (F12).
2. Go to **Application** > **Local Storage**.
3. Right-click and **Clear**.
4. Refresh the page. (Seed data will be reloaded).
