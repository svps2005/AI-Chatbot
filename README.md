# AI Chatbot - Production-Grade Mobile Application

A professional, full-stack AI chatbot application built with React Native, Expo, Node.js, Express, MongoDB, and Google Gemini API.

## 🌟 Features

- **Real-time Chat Interface** — Clean, professional UI with smooth animations
- **AI Integration** — Google Gemini API integration for intelligent responses
- **Chat History** — Persistent conversation storage with MongoDB
- **Authentication** — Secure user registration and JWT-based login
- **Responsive Design** — Works on phones of all sizes
- **Error Handling** — Comprehensive error states and recovery mechanisms
- **Loading States** — Professional loading indicators
- **Production Ready** — AWS deployment-ready backend

## 📱 Screens

1. **Welcome Screen** — Professional onboarding with app features
2. **Login Screen** — Secure user authentication
3. **Register Screen** — New user account creation
4. **Chat Screen** — Main interface with AI responses and suggested prompts
5. **Chat History** — Browse and manage previous conversations
6. **Settings Screen** — User profile, app info, and logout

## 🏗️ Architecture

```
React Native Mobile App
        ↓ (HTTPS REST API)
Node.js + Express Backend
        ↓
Google Gemini API
        ↓
MongoDB Atlas Database
```

**Key Design Principles:**
- API keys never exposed to mobile client
- Secure JWT authentication
- Clean separation of concerns
- Reusable components and services
- Type-safe with TypeScript

## 📋 Tech Stack

### Frontend / Mobile
- React Native 0.73+
- Expo 51+
- TypeScript 5.3+
- React Navigation 6.1+
- TanStack Query (React Query) 5.28+
- Axios for HTTP requests
- AsyncStorage for local persistence

### Backend
- Node.js 18+ or 20+
- Express.js 4.18+
- TypeScript 5.3+
- MongoDB with Mongoose ODM
- Google Generative AI SDK
- JWT for authentication
- bcryptjs for password hashing

### DevOps & Deployment
- Expo EAS for mobile builds
- MongoDB Atlas (cloud database)
- AWS EC2 or AWS App Runner (backend)
- Environment-based configuration

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm 9+
- MongoDB Atlas account
- Google Gemini API key
- Expo CLI: `npm install -g expo-cli`
- AWS account (for deployment)

### 1. Clone and Setup

```bash
cd ai-chatbot

# Setup backend
cd backend
npm install
cp .env.example .env
# Edit .env with your credentials
cd ..

# Setup mobile
cd mobile
npm install
cp .env.example .env
# Edit .env with backend URL
cd ..
```

### 2. Configure Environment Variables

**Backend (.env)**
```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/ai-chatbot
GEMINI_API_KEY=your_gemini_api_key
JWT_SECRET=your_random_secret_key
FRONTEND_URL=http://localhost:8081
LOG_LEVEL=info
```

**Mobile (.env)**
```
EXPO_PUBLIC_API_URL=http://localhost:5000/api
EXPO_PUBLIC_APP_NAME=AI Assistant
EXPO_PUBLIC_LOG_LEVEL=info
```

### 3. Start Development

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
# Server runs on http://localhost:5000
```

**Terminal 2 - Mobile:**
```bash
cd mobile
npm start
# Press 'a' for Android or 'i' for iOS
```

### 4. Test the Application

1. Create an account on the login screen
2. Start a conversation in the chat screen
3. Send messages to Gemini AI
4. View conversation history
5. Manage settings and logout

## 📁 Project Structure

```
ai-chatbot/
├── backend/                    # Node.js + Express backend
│   ├── src/
│   │   ├── config/            # Database and environment config
│   │   ├── controllers/       # Route handlers
│   │   ├── middleware/        # Auth, validation, error handling
│   │   ├── models/            # MongoDB schemas (User, Conversation, Message)
│   │   ├── routes/            # API routes
│   │   ├── services/          # Business logic (Gemini, Chat, Auth)
│   │   ├── types/             # TypeScript interfaces
│   │   ├── utils/             # Utilities (logger, error handler)
│   │   ├── app.ts             # Express app setup
│   │   └── server.ts          # Server entry point
│   ├── .env.example
│   ├── package.json
│   ├── tsconfig.json
│   └── nodemon.json
│
├── mobile/                     # React Native + Expo app
│   ├── src/
│   │   ├── screens/           # UI screens
│   │   ├── components/        # Reusable components
│   │   ├── services/          # API client services
│   │   ├── navigation/        # Navigation setup
│   │   ├── hooks/             # Custom React hooks
│   │   ├── store/             # AsyncStorage utilities
│   │   ├── types/             # TypeScript types
│   │   ├── utils/             # Utilities
│   │   ├── constants/         # Colors, spacing, messages
│   │   ├── config/            # App configuration
│   │   └── App.tsx            # App entry point
│   ├── app/
│   │   └── index.tsx          # Expo entry point
│   ├── assets/                # Images, fonts
│   ├── app.json               # Expo config
│   ├── eas.json               # Expo EAS config
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
│
├── README.md
├── .gitignore
└── DEPLOYMENT.md
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` — Register new user
- `POST /api/auth/login` — Login and get JWT token
- `GET /api/auth/profile` — Get authenticated user profile

### Chat
- `POST /api/chat/message` — Send message and get AI response
- `GET /api/conversations` — List user's conversations (paginated)
- `GET /api/conversations/:id` — Get specific conversation with messages
- `POST /api/conversations` — Create new conversation
- `DELETE /api/conversations/:id` — Delete conversation

### Health
- `GET /api/health` — Server health check

All chat endpoints require JWT authentication via `Authorization: Bearer <token>` header.

## 🗄️ Database Schema

### User Collection
```javascript
{
  _id: ObjectId,
  name: string,
  email: string (unique),
  passwordHash: string (bcrypt),
  createdAt: Date,
  updatedAt: Date
}
```

### Conversation Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  title: string,
  messageCount: number,
  createdAt: Date,
  updatedAt: Date
}
```

### Message Collection
```javascript
{
  _id: ObjectId,
  conversationId: ObjectId,
  role: "user" | "assistant",
  content: string,
  timestamp: Date,
  status: "sent" | "failed"
}
```

## 🔐 Security Features

- ✅ Passwords hashed with bcryptjs (10 salt rounds)
- ✅ JWT authentication with configurable expiration
- ✅ API keys stored securely in backend .env files
- ✅ CORS configured to accept requests from mobile app only
- ✅ Helmet.js for HTTP security headers
- ✅ Input validation on all endpoints
- ✅ Error messages don't expose sensitive information
- ✅ MongoDB Atlas IP whitelisting support
- ✅ Rate limiting ready for implementation

## 📱 Building for Production

### Android APK Build
```bash
cd mobile
eas build --platform android --profile production
# APK will be available for download
```

### iOS Build
```bash
cd mobile
eas build --platform ios --profile production
# IPA will be available for download
```

### Backend Deployment
See [DEPLOYMENT.md](DEPLOYMENT.md) for comprehensive AWS deployment guide.

## 🧪 Testing Checklist

- [ ] App launches without errors
- [ ] User can register with valid email and password
- [ ] User can login with correct credentials
- [ ] User can send messages to AI
- [ ] AI responds with relevant answers
- [ ] Loading indicator appears during AI response
- [ ] Error handling displays user-friendly messages
- [ ] Conversations are saved to MongoDB
- [ ] Chat history loads previous conversations
- [ ] Conversations can be deleted
- [ ] Settings screen loads user info
- [ ] User can logout successfully
- [ ] Backend health endpoint responds
- [ ] Database connection works
- [ ] Gemini API key is not exposed
- [ ] Production build is optimized

## 🐛 Troubleshooting

### "Cannot connect to backend"
- Ensure backend is running: `npm run dev` in backend folder
- Check `EXPO_PUBLIC_API_URL` in mobile/.env
- On Android emulator, use `10.0.2.2` instead of `localhost`

### "Gemini API error"
- Verify `GEMINI_API_KEY` in backend/.env
- Check API key is valid and not expired
- Ensure quota is not exceeded

### "MongoDB connection failed"
- Verify `MONGODB_URI` in backend/.env
- Check IP whitelist in MongoDB Atlas
- Ensure connection string includes credentials

### "Authentication errors"
- Clear AsyncStorage: uninstall and reinstall app
- Check token expiration in backend logs
- Verify JWT_SECRET matches between sessions

## 📚 Additional Resources

- [React Native Docs](https://reactnative.dev)
- [Expo Docs](https://docs.expo.dev)
- [Express.js Docs](https://expressjs.com)
- [MongoDB Docs](https://docs.mongodb.com)
- [Google Gemini API](https://ai.google.dev)
- [AWS Deployment Guide](./DEPLOYMENT.md)

## 📄 License

MIT License - feel free to use this for commercial projects.

## 👨‍💻 Author

Built as a production-ready example of a full-stack AI application.

---

**Ready to deploy?** See [DEPLOYMENT.md](DEPLOYMENT.md) for complete AWS deployment instructions.
