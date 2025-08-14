# AI Compliment & Haiku Generator

A playful, G-rated compliment and haiku generator with a modern, bubble-style UI. Generate delightful compliments and beautiful haikus for coworkers, friends, family, and more using AI-powered kindness and poetry.

## ✨ Features

- **AI-Powered Generation**: Uses GPT-5 to create contextual, personalized compliments and haikus
- **Dual Content Types**: Generate compliments or traditional 5-7-5 haikus
- **Multiple Styles**: Classic, Goofy, Poetic, and Professional styles for both content types
- **Context-Aware**: Add up to 8 context hints for personalized results
- **Adjustable Specificity**: Control how much context is woven into content (1-5 levels)
- **Favorites System**: Save and organize your favorite compliments and haikus
- **History Tracking**: Keep track of your last 10 generated items
- **Privacy-First**: Optional name storage with privacy controls
- **Modern UI**: Beautiful bubble-style design with smooth animations
- **Dark Mode**: Automatic theme switching with system preference detection
- **Sound Effects**: Optional audio feedback for interactions
- **Accessibility**: Full keyboard support and ARIA compliance
- **Mobile-First**: Responsive design that works on all devices

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd ai-compliment-generator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ContextChips.tsx    # Context input with chips
│   ├── StyleSelector.tsx   # Style selection interface
│   ├── SpecificitySlider.tsx # Specificity control
│   ├── ResultCard.tsx      # Generated compliment display
│   ├── LoadingCard.tsx     # Loading state
│   ├── ErrorCard.tsx       # Error handling
│   ├── Header.tsx          # Navigation header
│   └── Footer.tsx          # App footer
├── contexts/            # React context providers
│   ├── PreferencesContext.tsx  # User preferences
│   └── ComplimentsContext.tsx  # Favorites & history
├── pages/               # Main application pages
│   ├── Generator.tsx        # Main compliment generator
│   ├── Favorites.tsx        # Saved compliments
│   ├── History.tsx          # Generation history
│   └── Settings.tsx         # User preferences
├── api/                 # API integration
│   └── compliment.ts        # Compliment generation logic
├── App.tsx              # Main application component
├── main.tsx             # Application entry point
└── index.css            # Global styles
```

## 🎨 Design System

### Colors
- **Primary**: Warm orange (#f17a1a) for CTAs and accents
- **Surface**: Neutral grays for backgrounds and cards
- **Success**: Green for positive actions
- **Warning**: Amber for safety notices
- **Error**: Red for error states

### Typography
- **Display**: Poppins for headings and titles
- **Body**: Inter for body text and UI elements
- **Scale**: 16px base with 20px, 28px, and 36px steps

### Spacing
- **Grid**: 8px base unit
- **Sections**: 16px, 24px, 32px, 48px rhythm
- **Cards**: 20px, 28px border radius

### Animations
- **Micro-interactions**: 150ms for button clicks
- **Transitions**: 200-500ms for state changes
- **Reduced Motion**: Respects system preferences

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# GPT-5 API Configuration
VITE_GPT_5_API_KEY=your_developer_token_here
VITE_API_BASE_URL=http://localhost:3001

# Optional: Analytics
VITE_ANALYTICS_ID=your_analytics_id
```

### API Integration

The app includes a mock API for development. To integrate with GPT-5:

1. **Update the API endpoint** in `src/api/compliment.ts`
2. **Add your developer token** to environment variables
3. **Implement rate limiting** (20 requests per minute per IP)
4. **Add safety filters** for G-rated content

### Customization

#### Styles
Modify `tailwind.config.js` to customize:
- Color palette
- Typography scales
- Animation timings
- Border radius values

#### Content
Update mock responses in `src/api/compliment.ts` for:
- Different compliment styles
- Custom tags and categories
- Style-specific emoji rules

## 📱 Usage

### Generating Content

1. **Enter Context**: Add 1-8 context hints about the person
2. **Choose Style**: Select from Classic, Goofy, Poetic, or Professional
3. **Set Specificity**: Adjust how contextual the content should be (1-5)
4. **Choose Type**: Select "Generate Compliment" or "Generate Haiku"
5. **Generate**: Click the appropriate button to create your content
6. **Save & Share**: Favorite, copy, or generate another

### Keyboard Shortcuts

- **Enter**: Generate compliment
- **F**: Toggle favorite
- **C**: Copy to clipboard
- **Escape**: Cancel context input

### Privacy Features

- **Name Privacy**: Toggle to prevent name storage
- **Local Storage**: All data stored locally on your device
- **No Tracking**: No analytics or external data collection

## 🧪 Testing

### Run Tests
```bash
npm run test
```

### Run Linter
```bash
npm run lint
```

### Build for Production
```bash
npm run build
npm run preview
```

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository
2. Set environment variables
3. Deploy automatically on push

### Netlify
1. Build the project: `npm run build`
2. Upload the `dist` folder
3. Configure redirects for SPA routing

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

## 🔒 Security

- **Client-Side Validation**: Input sanitization and length limits
- **API Rate Limiting**: 20 requests per minute per IP
- **Content Filtering**: G-rated content only, no sensitive topics
- **Privacy Controls**: Optional name storage with user control
- **Local Storage**: No server-side data persistence

## 📊 Performance

### Targets
- **First Interaction**: < 3 seconds
- **Lighthouse Mobile**: Performance ≥ 90, Accessibility ≥ 95
- **Bundle Size**: < 500KB gzipped
- **Animation Performance**: 60fps on mobile devices

### Optimizations
- **Lazy Loading**: Sound effects and confetti
- **Debounced API**: 300ms delay to prevent spam
- **Image Optimization**: SVG icons and optimized assets
- **Code Splitting**: Route-based chunking

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

### Development Guidelines
- Follow TypeScript best practices
- Use functional components with hooks
- Maintain accessibility standards
- Add proper error handling
- Include loading states

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Design Inspiration**: Modern bubble-style UI patterns
- **Icons**: Lucide React icon library
- **Animations**: Framer Motion
- **Styling**: Tailwind CSS
- **AI Model**: GPT-5 for compliment generation

## 📞 Support

- **Issues**: GitHub Issues
- **Documentation**: This README
- **Community**: GitHub Discussions

---

Made with ❤️ for spreading kindness and positivity
