# TwoGether 💑

A smart couples' date planning app that learns preferences and helps partners find activities they'll both enjoy.

## 🎯 Features

### 🎬 Movie Module
- **Preference Matching**: AI-powered movie recommendations based on both partners' genres, ratings, and current mood
- **Streaming Availability**: Shows where matched movies are available (Netflix, Hulu, Disney+, etc.)
- **Snack Pairing Engine**: Recommends complementary snacks based on movie genre and mood

### 🍽️ Dining Experience
- **Restaurant Matcher**: Finds dining options that satisfy both partners' tastes, price range, and atmosphere preferences
- **Reservation Integration**: Book tables directly through the app
- **Menu Previewer**: Highlights dishes matching preferences
- **Dietary Accommodations**: Filters for allergies, vegetarian/vegan options, etc.

### 🎪 Activity Module
- **Outdoor Experiences**: Weather-aware suggestions for hikes, beaches, parks
- **Indoor Experiences**: Museums, workshops, cooking classes
- **Seasonal Events**: Holiday markets, seasonal celebrations
- **Energy Level Filtering**: Matches activities to your current energy/mood

### 🏠 Stay at Home Module
- **Cooking Together**: Recipe suggestions based on skill level and preferences
- **Game Night**: Board game and video game recommendations
- **DIY Projects**: Craft and home improvement ideas
- **Movie Marathon**: Themed movie night suggestions

### 💕 Relationship Features
- **Partner Connection System**: Secure pairing between couples
- **Mood-Based Filtering**: Both partners set their current mood
- **Surprise Generator**: Plan surprises based on partner's wishlist
- **Taking Turns System**: Fair decision-making rotation
- **Post-Date Reviews**: Discussion prompts and rating system
- **Memory Collection**: Photo/video storage with date tagging
- **Milestone Tracking**: Anniversaries and special dates

### 🌍 Long Distance Features
- **Synchronized Planning**: Coordinate activities across time zones
- **Virtual Date Ideas**: Online experiences you can share
- **Countdown Features**: Track time until next visit
- **Shared Wishlist**: Save ideas for when you're together
- **Simultaneous Experiences**: Watch parties and shared activities
- **Location-Aware Suggestions**: Activities when visiting each other

## 🛠️ Tech Stack

### Frontend
- **Mobile**: React Native (Expo)
- **Web**: React (Next.js)
- **State Management**: Zustand
- **API Client**: Axios + React Query
- **Styling**: StyleSheet (Mobile), Tailwind CSS (Web)

### Backend
- **API**: Node.js + Express
- **Database**: PostgreSQL
- **Cache**: Redis
- **File Storage**: AWS S3
- **Authentication**: JWT

### ML/AI
- **Recommendation Engine**: TensorFlow.js
- **Collaborative Filtering**: Custom implementation
- **Content-Based Filtering**: Genre/preference matching

### External APIs
- **Movies**: TMDB (The Movie Database)
- **Streaming**: Watchmode API
- **Restaurants**: Yelp Fusion API
- **Maps**: Google Places API
- **Weather**: OpenWeather API
- **Events**: Eventbrite API

## 📱 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Expo CLI
- iOS Simulator (Mac) or Android Studio

### Installation

1. Clone the repository
```bash
git clone https://github.com/stefandumitresc/TwoGether.git
cd TwoGether
```

2. Install dependencies
```bash
# Install root dependencies
npm install

# Install mobile app dependencies
cd apps/mobile
npm install
```

3. Start the development server
```bash
# From apps/mobile directory
npx expo start
```

4. Run on your device
- Download Expo Go app
- Scan the QR code
- Or press 'i' for iOS simulator / 'a' for Android emulator

## 📁 Project Structure

```
TwoGether/
├── apps/
│   ├── mobile/          # React Native mobile app
│   ├── web/            # Next.js web app
│   └── backend/        # Express API server
├── packages/
│   ├── shared/         # Shared utilities & types
│   ├── ui/            # Shared UI components
│   └── ml/            # ML models and training
├── docs/              # Documentation
└── scripts/           # Build and deployment scripts
```

## 🚀 Development Roadmap

### Phase 1: Foundation (Current)
- [x] Project setup
- [x] Authentication system
- [ ] Partner connection
- [ ] Basic navigation
- [ ] Preference onboarding

### Phase 2: Core Features
- [ ] Movie recommendations
- [ ] Restaurant finder
- [ ] Activity suggestions
- [ ] Date planning calendar

### Phase 3: Advanced Features
- [ ] ML recommendation engine
- [ ] Real-time synchronization
- [ ] Memory collection
- [ ] Social features

### Phase 4: Polish
- [ ] Animations
- [ ] Push notifications
- [ ] Offline support
- [ ] Performance optimization

## 🤝 Contributing

This is currently a private project. If you're interested in contributing, please reach out!

## 📄 License

Private - All rights reserved

## 👨‍💻 Author

Stefan Dumitrescu

---

Built with ❤️ for couples everywhere
