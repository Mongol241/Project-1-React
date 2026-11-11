# AI Model Watch — Migration Plan (HTML/CSS/JS -> React)

## 1. Overview & Current Application Architecture
The existing project is a client-side vanilla JavaScript, HTML5, and CSS3 single-page dashboard for AI/LLM model tracking. It queries `https://models.dev/api.json`, parses and slices the models to 100 entries, provides multi-criteria filtering and sorting, and displays statistics and responsive model cards with animations.

---

## 2. Page & Screen Inventory
- **Single Page Dashboard (`/` or `index.html`)**:
  - **Header / Hero**: Shows app brand (logo emoji with float animation, title, subtitle) and real-time total models tracked count (`#totalModels`).
  - **Filter & Search Form**:
    - Keyword text search (searches model name, model ID, provider name, and description).
    - Provider select dropdown (dynamically populated from unique provider IDs & names in fetched models, sorted alphabetically).
    - Status select dropdown (All statuses, Active, Deprecated, Beta).
    - Capability select dropdown (Any capability, Reasoning, Tool calling, Attachments/Vision, Open weights).
    - Sort By select dropdown (Name A–Z, Context window ↓, Input price ↑, Input price ↓, Newest first).
    - Action buttons: "Apply" (submits form / triggers render) and "Reset" (resets form inputs and triggers re-render).
  - **Stats Bar**:
    - "Showing X models"
    - "X active"
    - "X deprecated"
    - "X free / $0"
  - **Loading State**:
    - Animated spinner and pulsing text (`Fetching live model data…`).
  - **Error State**:
    - Icon, error message, and "Retry" button.
  - **Model Cards Grid**:
    - Responsive grid containing model cards (each with staggered animation delay, name, provider, status badge, optional 2-line description, 2x2 stats for Context tokens, Output tokens, Input price / 1M, Output price / 1M, capability badges, and release date).
  - **Empty State**:
    - Rendered when 0 models match filters (`No models match your filters. Try adjusting your search.`).
  - **Footer**:
    - Source attribution links and notes (`Updated daily · No API key required`).

---

## 3. UI Component Breakdown
The application will be broken down into clean, reusable React components:

- `src/components/Header.jsx`: Sticky glassmorphic navbar with logo, title, subtitle, and total count indicator.
- `src/components/FilterForm.jsx`: Search input, provider select, status select, capability select, sort select, Apply & Reset buttons.
- `src/components/StatsBar.jsx`: Showing, active, deprecated, and free badge counters.
- `src/components/LoadingSpinner.jsx`: Spinner and pulse message.
- `src/components/ErrorBox.jsx`: Error alert display with retry action.
- `src/components/ModelGrid.jsx`: Grid wrapper handling card list or empty state.
- `src/components/ModelCard.jsx`: Individual card with formatted statistics, capability tags, status badges, and staggered animation delay.
- `src/components/Footer.jsx`: Attribution links and footer copy.

---

## 4. JavaScript Behavior & Logic Audit
- **API Fetching**:
  - `fetch('https://models.dev/api.json')`
  - Response parsed as JSON: object keyed by provider ID, each having `name` and `models` object.
  - Slices total models array to first 100 items: `list.slice(0, 100)`.
  - Handles network/HTTP errors, toggles loader and error views.
- **Event Listeners**:
  - Form `submit`: `e.preventDefault()`, recalculate filtered list.
  - Form `input` & `change`: Live re-render as inputs/selects change.
  - Reset button `click`: Form inputs cleared/reset, triggers re-render.
  - Retry button `click`: Re-invokes API fetch.
- **Formatting Utilities**:
  - `formatTokens(tokens)`: Formats numbers as `X.XM`, `XK`, or comma-separated locale string.
  - `formatPrice(cost)`: Formats costs as `Free`, `$0.0000`, `$0.00`, or `—`.
  - `formatReleaseDate(date)`: Formats date to `Released MMM D, YYYY` or `Release date unknown`.
  - `statusClass`: Maps `active` -> `badge--green`, `deprecated` / `legacy` -> `badge--red`, `beta` -> `badge--amber`.
- **Filtering Logic**:
  - Keyword matching in lowercase across name, id, providerName, and description.
  - Provider matching by providerId.
  - Status matching (mapping legacy/deprecated to deprecated).
  - Capability matching (`reasoning`, `tool_call`, `attachment`, `open_weights`).
- **Sorting Logic**:
  - `name`: alphabetical localeCompare.
  - `context_desc`: descending context tokens limit.
  - `cost_asc`: ascending input cost (Infinity for null).
  - `cost_desc`: descending input cost (-Infinity for null).
  - `release_desc`: descending release date.

---

## 5. State Management & Data Flow
- **Global / App State**:
  - `models`: Raw loaded list of 100 models.
  - `providers`: List of unique `{ id, name }` extracted from models.
  - `filters`: Current filter criteria `{ keyword, provider, status, capability, sort }`.
  - `loading`: Boolean state for loading spinner.
  - `error`: Error message or null.
- **Derived State (computed via useMemo)**:
  - `filteredModels`: Filtered and sorted models.
  - `stats`: Counts for total showing, active, deprecated, free.

---

## 6. External Libraries & CDN Dependencies
- Fonts: Google Fonts `Inter` (`https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap`).
- CSS / Icons: Native emojis used in markup (🤖, 🔍, 🏢, 📌, ✨, ↕️, ⚠️, 🔭, 📅, 🧠, 🔧, 🖼️, 🔓).
- External API: `https://models.dev/api.json` (configured via `VITE_API_URL` env variable with fallback).

---

## 7. Migration Risks & Mitigation
- **Direct DOM Manipulation**: Vanilla code directly mutated `.innerHTML`, `.textContent`, and `.classList`. -> Mitigated by declarative React state, props, and conditional JSX rendering.
- **Form Reset**: In vanilla JS, `form.reset()` restored initial HTML values. -> Mitigated by controlled React form state with an explicit reset function.
- **Animation Delays**: Vanilla code computed `style="animation-delay:${Math.min(index * 25, 400)}ms"`. -> Preserved in JSX via inline `style={{ animationDelay: `${Math.min(index * 25, 400)}ms` }}`.
- **CSS Selectors & Structure**: The existing styles use BEM naming conventions (`.header__inner`, `.card__header`, `.btn--primary`). Moving CSS into `src/styles/` while preserving class names ensures zero visual regression.

---

## 8. Status & Verification Matrix
| Original Item | React Component / Module | Verified |
| :--- | :--- | :--- |
| `index.html` (Hero Header) | `src/components/Header.jsx` | Pending |
| `index.html` (Search/Filter Form) | `src/components/FilterForm.jsx` | Pending |
| `index.html` (Stats Bar) | `src/components/StatsBar.jsx` | Pending |
| `index.html` (Loader) | `src/components/LoadingSpinner.jsx` | Pending |
| `index.html` (Error Box) | `src/components/ErrorBox.jsx` | Pending |
| `index.html` (Grid & Empty State) | `src/components/ModelGrid.jsx` | Pending |
| `script.js` (Model Class & Card HTML) | `src/components/ModelCard.jsx` | Pending |
| `index.html` (Footer) | `src/components/Footer.jsx` | Pending |
| `script.js` (fetchData / API) | `src/services/api.js` | Pending |
| `script.js` (formatting helpers) | `src/utils/formatters.js` | Pending |
| `style.css` | `src/styles/style.css` | Pending |
