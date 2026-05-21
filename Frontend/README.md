# Online Debate and Presentation Platform

A modern, real-time debating and presentation platform built with a sleek neon purple aesthetic. Users can create debates, join discussions, and showcase their presentation skills.

## Features

### Authentication
- User login, signup, and password recovery
- Secure session management

### Dashboard
- Real-time notifications
- Upcoming debates feed
- Joined rooms management
- Quick access to create/join debates
- Fully responsive design (mobile-first)

### Debate Features
- Create custom debates with configurable settings
- Join existing debates from a curated list
- Timer functionality for timed arguments
- Voting system for debate outcomes
- Live chat during debates

### User Profiles
- User profile with avatar and bio
- Achievement system (badges, milestones)
- Statistics tracking (debates won, participation rate, average rating)
- Topics of expertise showcase

### Topics Library
- Categorized topics (Politics, Technology, Science, Economics, etc.)
- Featured debate topics with popularity metrics
- Browse and explore debate topics
- Search and filter functionality

## Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Design**: Neon Purple & Cyan Theme
- **Responsive**: Mobile-first approach

## Project Structure

```
Front End/
├── index.html (redirect to login)
├── login.html
├── signup.html
├── forgot-password.html
├── dashboard.html
├── profile.html
├── create-debate.html
├── join-debate.html
├── library.html
├── CSS/
│   ├── common.css
│   ├── login.css
│   ├── signup.css
│   ├── forgot-password.css
│   ├── dashboard.css
│   ├── profile.css
│   ├── create-debate.css
│   ├── join-debate.css
│   └── library.css
├── JS/
│   ├── login.js
│   ├── signup.js
│   ├── forgot-password.js
│   ├── dashboard.js
│   ├── profile.js
│   ├── create-debate.js
│   ├── join-debate.js
│   └── library.js
└── images/
    └── default-avatar.png
```

## Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Backend server (Node.js + Express recommended)
- Database (MongoDB or PostgreSQL recommended)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd webeng-project-<yourname>
   ```

2. **Frontend Setup**
   - Navigate to `Front End/` directory
   - Serve files using any HTTP server:
   ```bash
   # Using Python
   python -m http.server 8000

   # Using Node.js (http-server)
   npx http-server

   # Using Live Server (VS Code extension)
   # Right-click on login.html and select "Open with Live Server"
   ```

3. **Access the Application**
   - Open `http://localhost:8000` in your browser
   - Start with `login.html`

## Usage Guide

### Login & Authentication
1. Navigate to `login.html`
2. Enter credentials or use social login (Google, LinkedIn, Apple)
3. Redirects to dashboard upon successful login

### Dashboard
- View upcoming debates and join with one click
- Check notifications from the notification bell
- Access your joined rooms from the sidebar
- Create new debate or join existing ones

### Creating a Debate
1. Click "Create Debate" button on dashboard sidebar
2. Fill in debate details (title, category, difficulty level)
3. Configure settings (timer, max participants, voting)
4. Submit to create the debate room

### Joining Debates
1. Click "Join Debate" from sidebar or "Find & Join" from dashboard
2. Browse available debates with filters
3. Click "JOIN DEBATE" to enter the room

### Profile Management
1. Navigate to Profile page from top navigation
2. View your achievements and statistics
3. Click "EDIT PROFILE" to update bio and preferences
4. Track your debate wins and average rating

### Topics Library
1. Access from top navigation menu
2. Browse debate topics by category
3. View featured topics and popularity metrics
4. Search for specific debate topics

## API Endpoints (Backend Required)

The frontend expects the following API endpoints:

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration
- `POST /api/auth/logout` - User logout
- `POST /api/auth/forgot-password` - Password reset request

### Debates
- `GET /api/debates` - Fetch all debates
- `POST /api/debates` - Create new debate
- `GET /api/debates/:id` - Get debate details
- `POST /api/debates/:id/join` - Join a debate

### User Profile
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update user profile
- `GET /api/users/:id/statistics` - Get user statistics
- `GET /api/users/:id/achievements` - Get achievements

### Notifications
- `GET /api/notifications` - Fetch user notifications
- `POST /api/notifications/:id/read` - Mark as read

## Styling & Theme

The platform uses a modern **Neon Purple & Cyan** theme:

- **Primary Color**: `#a050ff` (Neon Purple)
- **Background**: `#050208` (Dark)
- **Accent**: `#00d4ff` (Cyan)
- **Text Primary**: `#ffffff` (White)
- **Text Secondary**: `#d090ff` (Light Purple)

### Custom Fonts
- **Bebas Neue** - Headers and titles
- **Space Mono** - Monospace for technical text
- **DM Sans** - Descriptions and body text

## Responsive Breakpoints

- **Desktop**: 1200px and above
- **Tablet**: 768px - 1199px
- **Mobile**: Below 768px

All pages are optimized for mobile-first experience.

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Deployment

### Deploy to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Deploy to Railway
1. Push code to GitHub
2. Connect GitHub repository to Railway
3. Deploy automatically

### Deploy to Render
1. Connect GitHub repository
2. Create new Static Site
3. Set build command and publish directory
4. Deploy

## Environment Variables

Create a `.env` file in the root directory (backend):

```
REACT_APP_API_URL=http://localhost:5000
REACT_APP_AUTH_TOKEN_KEY=auth_token
DATABASE_URL=mongodb://username:password@host:port/dbname
JWT_SECRET=your_jwt_secret
```

## Development Notes

### Adding New Pages
1. Create HTML file in `Front End/`
2. Create corresponding CSS file in `Front End/CSS/`
3. Create JS file in `Front End/JS/`
4. Link in navigation menus

### Common CSS Classes
- `.wrapper` - Main container with border
- `.field-input` - Form input styling
- `.btn`, `.submit-btn` - Button styling
- `.nav-item` - Navigation links
- `.card` - Card containers

### JavaScript Conventions
- Use vanilla JavaScript (no frameworks in frontend yet)
- Keep functions modular and reusable
- Use event delegation for dynamic content

## Testing

### Manual Testing Checklist
- [ ] All navigation links work correctly
- [ ] Forms validate input properly
- [ ] Responsive design works on mobile/tablet/desktop
- [ ] No console errors or warnings
- [ ] Theme colors consistent across pages
- [ ] All buttons are clickable and responsive

### Unit Tests (Coming Soon)
```bash
npm test
```

### E2E Tests (Coming Soon)
```bash
npm run e2e
```

## Performance Optimization

- Minimized CSS and JavaScript
- Lazy loading for images
- Responsive images for different screen sizes
- CSS Grid and Flexbox for efficient layouts
- Hardware acceleration for animations

## Known Issues

- Backend integration not yet implemented
- Authentication currently mocked
- Database not connected
- Real-time features (socket.io) not implemented yet

## Future Enhancements

1. Real-time debate rooms using WebSocket
2. Screen share functionality
3. Video/audio integration
4. Debate recording and replay
5. Advanced analytics dashboard
6. AI-powered debate suggestions
7. Mobile app (React Native)
8. Integration with external APIs

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Contact & Support

For support, email: `support@debatearena.com`

## Acknowledgments

- Design inspiration from modern SaaS platforms
- Font libraries: Google Fonts
- Community feedback and testing

---

**Status**: Active Development (May 2026)
**Last Updated**: May 13, 2026
**Version**: 1.0.0 (Beta)