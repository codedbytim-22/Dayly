# Year Progress Web App

A minimalist, responsive web application that visualizes the passage of time with a beautiful year progress tracker.

## Features

- **Real-time Date & Time**: Updates every second
- **Year Progress Visualization**: Animated progress bar with percentage
- **Dark/Light Mode**: Toggle between themes with beautiful animations
- **Futuristic Design**: Professional glassmorphism interface
- **Responsive Layout**: Works on mobile, tablet, and desktop
- **No Backend Required**: Entirely client-side JavaScript
- **PWA Support**: Optional service worker for offline capability

## Project Structure

year-progress/
├── index.html # Main HTML file
├── styles.css # All CSS styles
├── script.js # JavaScript functionality
├── sw.js # Service worker (optional)
├── manifest.json # PWA manifest (optional)
└── README.md # This file

## Deployment

This app can be deployed to any static hosting service:

### GitHub Pages

1. Create a new repository
2. Push all files to the `main` branch
3. Go to Settings → Pages → Source: select `main` branch
4. Your app will be available at `https://username.github.io/repository-name/`

### Netlify

1. Drag and drop the folder to Netlify
2. Or connect your GitHub repository
3. Automatic deployments on push

### Firebase Hosting

1. Install Firebase CLI: `npm install -g firebase-tools`
2. Run `firebase init`
3. Select Hosting
4. Deploy: `firebase deploy`

## Development

1. Clone the repository
2. Open `index.html` in your browser
3. Make changes to CSS/JS as needed
4. Test locally before deploying

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 11+
- Edge 79+

## License

MIT License - free for personal and commercial use
