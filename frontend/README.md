# News Aggregator - React App

A comprehensive, modern news aggregator built with React.js and Tailwind CSS. Features a beautiful, vibrant interface with authentication, multiple view modes, bookmarking, search functionality, and personalized settings.

## ✨ Features

### 🔐 Authentication
- User login and registration with username/password
- Frontend authentication with localStorage
- Protected routes and user session management
- User profile with customizable information

### 📰 News Features
- **Home Page**: Latest news with featured stories and multiple view modes
- **Trending**: Most popular and viral news stories
- **Headlines**: Breaking news and top stories
- **My Feed**: Personalized news feed based on preferences
- **Categories**: Browse news by category (Technology, Politics, Sports, Business, etc.)
- **Search**: Advanced search with history and popular searches
- **Bookmarks**: Save articles for later reading
- **Analytics**: Reading statistics and engagement metrics

### 🎨 Design Features
- **Vibrant UI**: Modern, colorful design with gradients and animations
- **Modal Reading**: Expandable article modal instead of alerts
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Smooth Animations**: Hover effects, transitions, and micro-interactions
- **Beautiful Typography**: Playfair Display and Crimson Text serif fonts
- **Minimal Backgrounds**: Clean gradient backgrounds throughout

### 👤 User Features
- **Profile Management**: Edit personal information and reading preferences
- **Settings**: Comprehensive settings for display, notifications, privacy, and language
- **Personalization**: Preferred categories, sources, view modes, and themes
- **Data Management**: Export data, clear history, account management

### 🔧 Technical Features
- **React Router**: Client-side routing with protected routes
- **Context API**: Global state management for authentication
- **localStorage**: Data persistence for bookmarks and settings
- **Commented API Integration**: Ready for backend integration with axios
- **Tailwind CSS**: Utility-first styling with custom animations
- **Component Architecture**: Modular, reusable components

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Navigate to your project directory:
```bash
cd "saroon project"
2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open your browser and navigate to `http://localhost:3000`

## 📁 Project Structure

```
src/
├── components/
│   ├── AuthModal.js      # Login/Register modal
│   ├── Navbar.js         # Navigation component
│   ├── NewsCard.js       # News article card component
│   └── ArticleModal.js   # Article reading modal
├── contexts/
│   └── AuthContext.js    # Authentication context
├── pages/
│   ├── Home.js           # Home page with latest news
│   ├── Trending.js       # Trending and viral news
│   ├── Headlines.js      # Breaking news and headlines
│   ├── MyFeed.js         # Personalized news feed
│   ├── Categories.js     # Category browsing
│   ├── Search.js         # Search functionality
│   ├── Bookmarks.js      # Saved articles
│   ├── Analytics.js      # Reading statistics
│   ├── Profile.js        # User profile management
│   └── Settings.js       # User settings
├── App.js                # Main app component
├── index.js              # App entry point
└── index.css             # Global styles with animations
```

## 🎯 Usage

### Authentication
- Any username/password combination will work for demo purposes
- User data is stored in localStorage
- Authentication is required to access any page

### Navigation
- Use the top navbar to navigate between sections
- Mobile-responsive hamburger menu for smaller screens
- User dropdown menu for profile and settings

### News Viewing
- **Grid View**: Card-based layout (default)
- **List View**: Horizontal layout with image and text
- **Magazine View**: Large image with detailed text
- Use the view toggle in the top-right corner
- Click "Read More" to open articles in a modal

### Bookmarking
- Click the bookmark icon on any news card
- View saved articles in the Bookmarks section
- Organize bookmarks by category

### Search
- Enter keywords in the search box
- Browse popular searches
- Search history is automatically saved

### Personalization
- Set preferred categories in Profile
- Choose favorite news sources
- Customize display settings in Settings

## 🔌 Backend Integration

The app is ready for backend integration. Look for commented sections marked with:
```javascript
// Commented out API call - replace with actual backend later
/*
const response = await axios.get('/api/endpoint');
*/
```

### API Endpoints to Implement
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/news/latest` - Latest news
- `GET /api/news/trending` - Trending news
- `GET /api/news/headlines` - Breaking news
- `GET /api/news/category/:category` - Category news
- `GET /api/news/search?q=query` - Search news
- `PUT /api/user/profile` - Update profile
- `PUT /api/user/settings` - Update settings
- `GET /api/user/analytics` - User reading analytics

## 🎨 Customization

### Colors & Styling
- Edit `src/index.css` for global styles and animations
- Modify Tailwind classes in components
- Change color scheme in component files
- Gradient backgrounds and hover effects throughout

### Fonts
- Current: Playfair Display (headings) + Crimson Text (body)
- To change: Update Google Fonts link in `public/index.html`
- Update font-family in `src/index.css`

### Dummy Data
- News articles are currently using placeholder data
- Replace with real API calls when backend is ready
- Images use placeholder.com - replace with actual news images

## 🚀 Build for Production

```bash
npm run build
```

This creates a `build` folder with optimized production files.

## 📋 Available Scripts

- `npm start` - Run development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

## 🤝 Contributing

1. Follow the existing code structure
2. Use semantic variable names
3. Add comments for complex logic
4. Test on multiple screen sizes
5. Maintain the vibrant, modern design aesthetic

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Built with React.js and Tailwind CSS
- Typography by Google Fonts
- Icons and placeholders from various sources
- Inspired by modern news aggregation platforms
5. Maintain the serif font aesthetic

## License

This project is created for educational purposes.
