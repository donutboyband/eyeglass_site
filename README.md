# Eyeglass

Landing page and documentation hub for Eyeglass. It includes:

- **Landing page** with interactive demo showing how Eyeglass works
- **Documentation** covering installation, core concepts, MCP integration, and advanced configuration
- **Live Eyeglass integration** - the site itself uses `@eyeglass/inspector` for development

## Tech Stack

- React 19
- TypeScript
- Vite
- React Router
- Prism.js (syntax highlighting)

## Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── docs/           # Documentation pages
│   │   └── pages/      # Individual doc sections
│   ├── HeroSection.tsx
│   ├── DemoSection.tsx
│   ├── LandingDemo.tsx # Interactive demo component
│   └── ...
├── App.tsx             # Main app with routing
├── App.css             # Global styles
└── main.tsx            # Entry point
```

## Documentation Pages

- **Getting Started** - Quick start guide
- **Installation** - Detailed setup instructions
- **Core Concepts** - Inspector, Bridge, Semantic Snapshots
- **MCP Integration** - Tool reference for AI agents
- **Features** - Framework detection, multi-select, etc.
- **Packages** - Package reference (@eyeglass/cli, inspector, bridge, types)
- **Advanced** - Full schema, configuration, troubleshooting

## License

MIT
