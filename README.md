# 🤖 AI Model Watch — Dashboard (React + Vite)

A modern, responsive web application built with **React** and **Vite** that fetches **live AI/LLM model data** — prices, context windows, capabilities, and deprecation status — straight from the [models.dev](https://models.dev) public API.

---

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Bundler / Build Tool**: [Vite 6](https://vitejs.dev/)
- **Testing**: [Vitest](https://vitest.dev/) + [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- **Linting**: [ESLint 9](https://eslint.org/) (Flat Config with React rules)
- **Styling**: Pure CSS3 with glassmorphic dark theme and responsive flex/grid layouts

---

## 📁 Project Structure

```
Proiect-1/
├── public/
│   └── favicon.svg         – Application robot favicon
├── src/
│   ├── assets/             – Static assets
│   ├── components/         – Modular React components
│   │   ├── ErrorBox.jsx       – Error view with retry action
│   │   ├── FilterForm.jsx     – Search input, provider/status/cap selects, apply & reset
│   │   ├── Footer.jsx         – Data source attribution footer
│   │   ├── Header.jsx         – Sticky glassmorphic navbar with total count
│   │   ├── LoadingSpinner.jsx – Animated spinner and pulse indicator
│   │   ├── ModelCard.jsx      – Responsive model card with stats & capability badges
│   │   ├── ModelGrid.jsx      – Grid container and empty state view
│   │   └── StatsBar.jsx       – Active, deprecated, free, and total count badges
│   ├── services/
│   │   └── api.js          – Fetch, transform and slice API data
│   ├── styles/
│   │   └── style.css       – Preserved CSS design system & media queries
│   ├── test/
│   │   ├── setup.js           – Test setup with jest-dom
│   │   ├── formatters.test.js – Unit tests for utility functions
│   │   ├── components.test.jsx– Unit tests for isolated UI components
│   │   └── App.test.jsx       – Integration tests for filtering, reset, error handling
│   ├── utils/
│   │   └── formatters.js   – Price, token, date formatters & filter matching
│   ├── App.jsx             – Main application state and data orchestration
│   └── main.jsx            – React entry point (StrictMode & DOM mount)
├── .env.example            – Environment variable template
├── .gitignore              – Git ignore rules (node_modules, dist, .env)
├── eslint.config.js        – ESLint 9 configuration
├── index.html              – HTML shell and entry point for Vite
├── package.json            – Dependencies, scripts, and project metadata
├── vite.config.js          – Vite configuration with relative base and Vitest setup
└── README.md               – This documentation file
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or newer recommended, tested on v24)
- `npm` (comes with Node.js)

### Installation

```bash
# Clone the repository and switch to the project directory
git clone https://github.com/Mongol241/Project-1-React.git
cd Project-1-React

# Install dependencies
npm install
```

### Running Locally (Development Mode)

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Building for Production

```bash
npm run build
```

The production assets will be output to the `dist/` directory.

### Previewing the Production Build

```bash
npm run preview
```

### Running Tests and Linting

```bash
# Run unit and integration tests (Vitest)
npm run test

# Run code style and lint checks (ESLint)
npm run lint
```

---

## ⚙️ Environment Variables

The application can be configured using environment variables. Create a `.env` file in the project root:

```bash
cp .env.example .env
```

| Variable | Description | Default |
| :--- | :--- | :--- |
| `VITE_API_URL` | API endpoint for live models data | `https://models.dev/api.json` |

> **Note**: `.env` is ignored by git to protect credentials. Never commit API keys or private endpoints.

---

## 🔌 API Details

| Property      | Value |
|---------------|-------|
| **Source**    | [models.dev/api.json](https://models.dev/api.json) |
| **Auth**      | None (fully public) |
| **CORS**      | ✅ Enabled |
| **Updates**   | Daily |
| **Models**    | 190+ AI/LLM models across all major providers (first 100 displayed) |
| **Data**      | Prices · Context windows · Capabilities · Deprecation dates |

---

## 🔄 Migrare HTML/CSS/JS -> React

The project was migrated from plain HTML5, CSS3, and vanilla JavaScript into a modern React application:

1. **Architecture & State Management**:
   - Replaced imperative DOM updates (`document.getElementById`, `.innerHTML`, `.classList`) with declarative React components and state (`useState`, `useMemo`, `useCallback`).
   - Dynamic provider list and filtering/sorting are computed efficiently using memoized selectors.
2. **Componentization**:
   - Extracted logical UI blocks into isolated components (`Header`, `FilterForm`, `StatsBar`, `ModelGrid`, `ModelCard`, `LoadingSpinner`, `ErrorBox`, `Footer`).
3. **Style Preservation**:
   - Preserved 100% of the original CSS classes, design tokens, responsive breakpoints (900px, 600px), and animations (`cardIn`, `float`, `spin`, `pulse`). Moved CSS to `src/styles/style.css` with git history tracked.
4. **Resilience & Testing**:
   - Added automated tests with Vitest and React Testing Library covering token formatting, price calculations, filtering criteria, form reset, error recovery, and component rendering.
5. **Tooling & Build System**:
   - Set up Vite for instant HMR and optimized builds, plus ESLint 9 for code quality.

---

## 🌐 Deployment Notes

The Vite configuration uses `base: './'`, enabling deployment to:
- **GitHub Pages**: You can deploy the `dist/` folder via GitHub Actions or the `gh-pages` branch.
- **Vercel / Netlify / Cloudflare Pages**: Connect the repository with build command `npm run build` and publish directory `dist`.
