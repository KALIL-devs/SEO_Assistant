# SEO Assistant - Frontend

A modern, responsive React-based interface for comprehensive website SEO analysis. Built with Vite, React 19, and Tailwind CSS for optimal performance and user experience.

**Backend Repository:** [SEO Assistant Backend](https://github.com/KALIL-devs/SEO_Assistant_backend.git)

## Features

### 🎨 Modern User Interface
- Clean, intuitive design
- Real-time interactive components
- Responsive layout (mobile, tablet, desktop)
- Dark/Light mode support ready
- Accessibility-first approach

### 🔍 URL Discovery
- Easy URL input with validation
- Automatic page discovery from sitemaps
- Browsable page selection interface
- Search history and quick access

### 📊 SEO Analysis Dashboard
- Real-time analysis results
- Visual score cards with metrics
- Issue categorization (High, Medium, Low priority)
- Before/after suggestions
- Historical tracking

### ⚡ PageSpeed Insights
- Desktop performance scores
- Mobile performance scores
- Core Web Vitals visualization
- Opportunity analysis
- Performance metrics comparison

### 🏢 Site-Wide Audit
- Comprehensive site analysis view
- Aggregated metrics across all pages
- Issue tracking and trending
- Export capabilities

### 💾 Smart Caching
- Local storage for search history
- 1-hour cache duration for analysis results
- Quick re-analysis of previously checked URLs
- Persistent user preferences

## Technology Stack

### Core
- **React 19** - Latest React with new features
- **Vite** - Next-generation build tool with HMR
- **JavaScript/JSX** - Modern ES2022+

### Styling
- **Tailwind CSS** - Utility-first CSS framework
- **Tailwind Merge** - Smart class merging
- **PostCSS** - CSS transformation
- **Autoprefixer** - Vendor prefixes

### Components & Icons
- **Lucide React** - Beautiful, consistent icon library (560+ icons)
- **Clsx** - Conditional class joining

### HTTP Client
- **Axios** - Promise-based HTTP client with interceptors

### Development Tools
- **ESLint** - Code quality and style checking
- **ESLint Plugins** - React hooks and refresh support

## Prerequisites

- Node.js 16.x or higher
- npm 8.x or higher (or yarn/pnpm)
- Backend API running on `http://localhost:8000`

## Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd seo-assistant-frontend
```

### 2. Install Dependencies
```bash
npm install
```

Or with yarn:
```bash
yarn install
```

## Running the Application

### Development Server
```bash
npm run dev
```
- The application will be available at `http://localhost:5173`
- Hot Module Replacement (HMR) enabled
- Auto-refresh on file changes

### Production Build
```bash
npm run build
```
- Creates optimized build in `dist/` directory
- Minified and tree-shaken code
- Ready for deployment

### Preview Production Build
```bash
npm run preview
```
- Preview the production build locally
- Useful before deployment

### Code Quality
```bash
npm run lint
```
- Run ESLint checks
- Fix common issues automatically:
  ```bash
  npm run lint -- --fix
  ```

## Project Structure

```
frontend/
├── src/
│   ├── App.jsx                  # Main application component
│   ├── App.css                  # Global styles
│   ├── main.jsx                 # React entry point
│   ├── index.css                # Global CSS
│   ├── components/
│   │   ├── Dashboard.jsx        # Analysis results display
│   │   ├── UrlInput.jsx         # URL input component
│   │   ├── PageList.jsx         # Discovered pages list
│   │   ├── SiteAudit.jsx        # Site-wide audit view
│   │   ├── PageSpeedResults.jsx # PageSpeed metrics display
│   │   └── ScoreCard.jsx        # Reusable score card component
│   └── assets/                  # Static assets
├── public/                      # Public assets (favicon, etc.)
├── index.html                   # HTML entry point
├── vite.config.js              # Vite configuration
├── eslint.config.js            # ESLint configuration
├── tailwind.config.js          # Tailwind CSS configuration
├── postcss.config.js           # PostCSS configuration
├── package.json                # Project metadata & dependencies
└── README.md                   # This file
```

## Component Details

### App.jsx
Main application component managing:
- Application state and routing
- API communication
- User interactions
- Caching logic
- Search history management

**Key Features:**
- Multi-step workflow (input → select → dashboard)
- Error handling and loading states
- Cache management (1-hour duration)
- Search history tracking

### UrlInput.jsx
URL input and discovery interface:
- URL validation and normalization
- Discover pages button
- Loading indicators
- Error messages
- Search history dropdown

### PageList.jsx
Displays discovered pages:
- Paginated list of discovered pages
- Page selection checkboxes
- Bulk selection/deselection
- Analysis triggering
- Status indicators

### Dashboard.jsx
Main analysis results view:
- Overall SEO score
- Issue categorization
- Individual issue cards
- Suggestion generation
- Score breakdown

### SiteAudit.jsx
Site-wide audit dashboard:
- Aggregated metrics
- Page-by-page summary
- Trend analysis
- Report generation
- Export options

### PageSpeedResults.jsx
PageSpeed Insights visualization:
- Desktop and mobile scores
- Core Web Vitals display
- Performance metrics
- Visual gauge indicators
- Recommendations

### ScoreCard.jsx
Reusable score card component:
- Visual score representation
- Status indicators (Good/Warning/Error)
- Metrics display
- Interactive elements

## API Integration

The frontend communicates with the backend API at `http://localhost:8000`:

### API Endpoints Used

**Discover Pages:**
```javascript
POST /api/discover
{
  "url": "https://example.com"
}
```

**Analyze Page:**
```javascript
POST /api/analyze
{
  "url": "https://example.com/page"
}
```

**Generate Suggestion:**
```javascript
POST /api/suggest
{
  "issue_type": "Title Tag",
  "current_value": "Current Title",
  "page_context": "Page content"
}
```

**PageSpeed Analysis:**
```javascript
POST /api/pagespeed
{
  "url": "https://example.com/page"
}
```

## Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE=http://localhost:8000/api
VITE_CACHE_DURATION=3600000
```

In Vite, access via `import.meta.env.VITE_*`:
```javascript
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000/api";
```

### Tailwind Configuration

Customize in `tailwind.config.js`:
```javascript
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: { /* custom colors */ },
      spacing: { /* custom spacing */ },
    },
  },
  plugins: [],
}
```

## Development Workflow

### Adding a New Component

1. Create new file in `src/components/NewComponent.jsx`
2. Write functional component
3. Use Tailwind classes for styling
4. Export and use in App.jsx

Example:
```jsx
export default function NewComponent() {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-xl font-bold">Component Title</h2>
      {/* content */}
    </div>
  );
}
```

### Styling Guidelines

- Use Tailwind utility classes
- Follow mobile-first responsive design
- Use consistent spacing (gap, padding, margin)
- Color scheme: Primary (blue), Success (green), Error (red), Warning (yellow)

### State Management

Current implementation uses React hooks:
- `useState` for local component state
- `useEffect` for side effects
- localStorage for persistence

For complex state, consider:
- Context API
- Redux/Zustand
- Jotai

## Performance Optimization

### Current Optimizations
- Code splitting via Vite
- Tree shaking of unused dependencies
- Dynamic imports for components
- Result caching (1 hour)
- Lazy loading of images

### Potential Improvements
- Implement React.memo for components
- Use useMemo for expensive calculations
- Virtualize long lists
- Implement request debouncing
- Service Worker for offline support

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Deployment

### Build for Production
```bash
npm run build
npm run preview
```

### Vercel Deployment
```bash
npm install -g vercel
vercel
```

### Netlify Deployment
```bash
npm run build
# Drag and drop dist/ folder to Netlify
```

### Docker Deployment
```dockerfile
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
RUN npm install -g serve
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
```

### Docker Compose
```yaml
version: '3.8'
services:
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - VITE_API_BASE=http://backend:8000/api
    depends_on:
      - backend
```

## Troubleshooting

### Common Issues

**Issue:** "Cannot GET /" or blank page
- **Solution:** Ensure Vite dev server is running: `npm run dev`
- Check browser console for errors

**Issue:** API errors (CORS, connection refused)
- **Solution:** Verify backend is running on `http://localhost:8000`
- Check `VITE_API_BASE` environment variable
- Clear browser cache and reload

**Issue:** Tailwind styles not loading
- **Solution:** Verify Tailwind CSS files are imported in `index.css`
- Check `tailwind.config.js` includes correct content paths
- Rebuild: `npm run build`

**Issue:** Slow performance or memory leaks
- **Solution:** Check for uncleared intervals/timeouts
- Use React DevTools Profiler
- Review event listeners cleanup in useEffect

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make changes and test
4. Commit: `git commit -m 'Add amazing feature'`
5. Push: `git push origin feature/amazing-feature`
5. Submit a Pull Request

## Code Standards

- Follow existing code style
- Use meaningful variable/function names
- Comment complex logic
- Add PropTypes for component props (or TypeScript)
- Test components before pushing

## Performance Metrics

- Lighthouse Score Target: 90+
- Bundle Size: <200KB gzipped
- Time to Interactive: <3 seconds
- First Contentful Paint: <1.5 seconds

## Future Enhancements

- [ ] TypeScript migration for type safety
- [ ] Redux for complex state management
- [ ] Real-time WebSocket updates
- [ ] Advanced data visualization (charts/graphs)
- [ ] Authentication and user accounts
- [ ] Scheduled analysis and reports
- [ ] Dark mode implementation
- [ ] Internationalization (i18n)
- [ ] Progressive Web App (PWA) support
- [ ] Mobile app version (React Native)

## Dependencies Overview

| Package | Version | Purpose |
|---------|---------|---------|
| react | ^19.2.0 | UI framework |
| react-dom | ^19.2.0 | React DOM rendering |
| vite | ^7.2.4 | Build tool |
| tailwindcss | ^4.1.18 | CSS framework |
| axios | ^1.13.2 | HTTP client |
| lucide-react | ^0.562.0 | Icon library |
| clsx | ^2.1.1 | Class name utility |

## License

This project is licensed under the MIT License.

## Support

For issues, questions, or suggestions:
1. Check existing issues on GitHub
2. Create a new issue with detailed description
3. Contact maintainers

---

**Frontend for SEO Assistant - Beautiful, fast, and user-friendly! 🎨**
