<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>


# SellIt - Campus Marketplace

A frontend-only campus marketplace application with persisted state, AI-powered features, and real-time messaging simulation.

## 🏗️ Tech Stack

**Frontend:**
- React 19 with TypeScript
- Vite (build tool)
- TailwindCSS (styling)
- Lucide React (icons)
- Google Gemini AI (Client-side)
- LocalStorage (Data Persistence)

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **Gemini API Key** - [Get from Google AI Studio](https://ai.google.dev/)

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd sellit
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` and fill in your values:
   ```env
   VITE_GEMINI_API_KEY=your_actual_gemini_api_key
   ```
   
   **Important:**
   - Get Gemini API key from: https://ai.google.dev/

### Running the Application

**Start the Frontend Dev Server:**
```bash
npm run dev
```
Expected output: `VITE vX.X.X ready in XXX ms`

**Access the app:**
Open http://localhost:3000

## 📁 Project Structure

```
sellit/
├── backend/              # Express backend
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API endpoints
│   ├── middleware/      # Auth & validation
│   └── server.ts        # Entry point
├── components/          # React components
├── services/            # Frontend services
├── context/             # React context providers
├── types.ts             # TypeScript definitions
├── App.tsx              # Main React component
└── index.html           # Entry HTML file
```

## 🔧 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start frontend development server (port 3000) |
| `npm run server` | Start backend server (port 5000) |
| `npm run build` | Build frontend for production |
| `npm run preview` | Preview production build locally |

## ⚠️ Known Issues & Fixes

### Issue: Frontend auth doesn't connect to backend
**Status:** 🚧 In Progress  
**Workaround:** Currently using mock authentication. Backend routes exist but aren't connected yet.

### Issue: Gemini service exposed in frontend
**Status:** 🚧 Needs Fix  
**Security Note:** API keys should never be in frontend code. Move to backend endpoints.

### Issue: Mock data in Dashboard
**Status:** 🚧 In Progress  
**Note:** Dashboard uses hardcoded data. Backend routes exist but not yet integrated.

## 🔐 Security Notes

- Never commit `.env` file (already in `.gitignore`)
- Never share your `GEMINI_API_KEY` or `JWT_SECRET`
- In production, use strong JWT secrets (32+ characters)
- Configure CORS properly for production deployments

## 🌐 API Endpoints

Backend runs on `http://localhost:5000`

### Authentication
- `POST /api/auth/register` - Create new user
- `POST /api/auth/login` - Login user

### Listings
- `GET /api/listings` - Get all listings
- `POST /api/listings` - Create listing
- `PUT /api/listings/:id` - Update listing
- `DELETE /api/listings/:id` - Delete listing

### Additional Routes
- `/api/escrow` - Escrow transactions
- `/api/ai` - AI-powered features
- `/api/broadcasts` - User broadcasts
- `/api/chats` - Messaging
- `/api/notifications` - Notification management

## 🧪 Testing

Currently no automated tests. Manual testing workflow:
1. Start both servers
2. Open `http://localhost:3000`
3. Test signup/login flows
4. Navigate dashboard features

## 📝 Environment Variables Reference

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `GEMINI_API_KEY` | ✅ Yes | Google Gemini API key | `AIzaSy...` |
| `JWT_SECRET` | ✅ Yes | Secret for JWT signing | `random_32_char_string` |
| `MONGODB_URI` | ✅ Yes | MongoDB connection string | `mongodb://localhost:27017/sellit` |
| `PORT` | ❌ No | Backend server port | `5000` (default) |
| `NODE_ENV` | ❌ No | Environment mode | `development` |

## 🤝 Contributing

This is a work-in-progress campus marketplace project. Current priorities:
1. Connect frontend authentication to backend APIs
2. Move Gemini service to backend-only
3. Replace mock data with real database queries
4. Add input validation and error handling

## 📄 License

[Add your license here]

## 🔗 Links

- **AI Studio Project**: https://ai.studio/apps/drive/1VC1nODe5nk-TEwJURsuwRNpcKK0HSKL4
- **Google Gemini API**: https://ai.google.dev/
- **MongoDB Atlas**: https://www.mongodb.com/cloud/atlas
