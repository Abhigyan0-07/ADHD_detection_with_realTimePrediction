# FocusFlow – Real-Time AI Tutor with ML Predictions

A comprehensive real-time learning platform with AI-powered predictions, interactive content, and live analytics for ADHD learners.

## 🚀 Features

### Real-Time Data & Predictions
- **Live Attention Tracking**: Real-time monitoring with ML predictions
- **Performance Forecasting**: TensorFlow.js-powered performance predictions
- **Engagement Monitoring**: AI-driven engagement level tracking
- **Mood Analysis**: Real-time mood and emotional state tracking

### Interactive Content Hub
- **Visual Learning**: Content with beautiful pictures and illustrations
- **Interactive Games**: Counting games, memory palaces, attention training
- **Multi-Modal Content**: Visual, auditory, and kinesthetic learning options
- **ADHD-Friendly Design**: Optimized for attention and engagement

### Advanced Analytics
- **Real-Time Dashboard**: Live metrics with animated visualizations
- **AI Predictions**: Machine learning predictions with confidence scores
- **Data Visualization**: Chart.js-powered real-time charts
- **WebSocket Integration**: Instant updates and live data streaming

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, MongoDB, Mongoose
- **ML/AI**: TensorFlow.js, Custom Neural Networks
- **Real-Time**: WebSocket (Socket.IO), Live Data Collection
- **Visualization**: Chart.js, React-ChartJS-2
- **UI/UX**: Framer Motion, Responsive Design

## 📦 Quick Start

1. **Environment Setup**:

Create `.env.local` in the project root:

```bash
MONGODB_URI=mongodb+srv://<user>:<pass>@<cluster>.mongodb.net/?retryWrites=true&w=majority&appName=<cluster>
MONGODB_DB=focusflow
JWT_SECRET=<strong-random-string>
NEXT_PUBLIC_WS_URL=http://localhost:3000
```

Generate JWT secret: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

2. **Install & Run**:

```bash
npm install
npm run dev
```

3. **Seed Content** (Optional):

```bash
node scripts/setup.js
```

4. **Verify Setup**:

Visit `http://localhost:3000/api/health` - should return `{ ok: true }`

## 🎯 Usage

### Dashboard Features
- **Overview**: Real-time metrics with animated cards
- **Content Hub**: Interactive learning with pictures and games
- **Real-Time Analytics**: Live predictions and data visualization
- **Attention Tracker**: ML-powered attention monitoring

### Content Types
- **Math Adventures**: Counting games with animal pictures
- **Reading Stories**: Visual comprehension with illustrations
- **Science Explorer**: Interactive planet exploration
- **Attention Training**: Focus-building exercises
- **Memory Palace**: Visual memory techniques

### Real-Time Features
- **Live Data Collection**: Automatic data gathering every 3 seconds
- **ML Predictions**: AI predictions every 30 seconds
- **WebSocket Updates**: Instant real-time updates
- **Confidence Scoring**: Prediction accuracy tracking

## 📊 API Endpoints

### Real-Time Data
- `POST /api/realtime/data` - Collect real-time data
- `GET /api/realtime/data` - Fetch recent data
- `GET /api/realtime/summary` - Get data summary
- `POST /api/realtime/predict` - Make ML predictions
- `GET /api/realtime/predict` - Fetch predictions

### Content Management
- `GET /api/content` - Fetch content with filters
- `POST /api/content` - Create new content
- `POST /api/content/seed` - Seed sample content

### User Management
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User authentication
- `GET /api/user/profile` - Get user profile

## 🧠 Machine Learning

### Prediction Models
- **Attention Trend Model**: Predicts attention levels
- **Performance Forecast**: Predicts learning performance
- **Engagement Level**: Predicts content engagement

### Features Used
- Recent attention data (last 30 minutes)
- Recent performance data
- Time of day and day of week
- Session duration and break count
- User age and ADHD score

### Model Architecture
- Neural networks with 2-3 hidden layers
- Dropout regularization (0.2-0.3)
- L2 regularization
- Sigmoid activation for 0-1 outputs
- Adam optimizer with learning rate 0.001

## 🎨 Content Features

### Visual Elements
- High-quality images from Unsplash
- Interactive image galleries
- Visual progress indicators
- Animated UI components

### Interactive Components
- Counting games with clickable animals
- Comprehension quizzes with visual feedback
- Planet explorer with interactive models
- Attention training with timers
- Memory palace with room exploration

### Accessibility
- Visual, auditory, and kinesthetic options
- ADHD-friendly design principles
- Adjustable difficulty levels
- Multi-modal content delivery

## 🔧 Development

### Project Structure
```
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard pages
│   └── (auth)/           # Authentication pages
├── components/            # React components
├── lib/                   # Utility libraries
│   ├── ml/               # Machine learning
│   ├── realtime/         # Real-time data
│   └── websocket/        # WebSocket handling
├── models/               # Database models
└── scripts/              # Setup scripts
```

### Key Files
- `lib/ml/predictor.ts` - ML prediction service
- `lib/realtime/collector.ts` - Data collection system
- `lib/websocket/` - WebSocket server and client
- `models/` - Database schemas
- `app/dashboard/realtime/` - Real-time dashboard
- `app/dashboard/content-hub/` - Content management

## 🚀 Deployment

### Vercel Deployment
1. Set environment variables in Vercel dashboard
2. Connect GitHub repository
3. Deploy automatically on push

### Environment Variables
```bash
MONGODB_URI=your_mongodb_connection_string
MONGODB_DB=focusflow
JWT_SECRET=your_jwt_secret
NEXT_PUBLIC_WS_URL=your_websocket_url
```

## 📈 Performance

### Real-Time Updates
- Data collection: Every 3 seconds
- ML predictions: Every 30 seconds
- WebSocket heartbeat: Every 5 seconds
- UI updates: Instant with animations

### Optimization
- Data buffering for efficient database writes
- Connection pooling for MongoDB
- Client-side caching for predictions
- Lazy loading for content images

## 🎯 Future Enhancements

- [ ] Voice recognition for accessibility
- [ ] Advanced ML models with more features
- [ ] Collaborative learning features
- [ ] Mobile app with React Native
- [ ] Advanced analytics and reporting
- [ ] Integration with external learning platforms

## 📝 License

MIT License - see LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For questions or support, please open an issue on GitHub or contact the development team.