# 🤖 AI Model Watch — Dashboard

A lightweight, fully client-side web app that fetches **live AI/LLM model data** — prices, context windows, capabilities, and deprecation status — straight from the [models.dev](https://models.dev) public API (the data source powering **ArtificialWatch / AI Model Watch**).

---

## 📁 Project Structure

```
Proiect-1/
├── index.html   – Page markup, search form, model grid layout
├── style.css    – Dark glassmorphism design, responsive grid
├── script.js    – API fetch, filter/sort logic, card rendering
└── README.md    – This file
```

---

## 🚀 How to Run

### Option A — Open directly in the browser (simplest)

**If you use VS Code**, install the **Live Server** extension, right-click `index.html` → *Open with Live Server*.

---

## 🔌 API Used

| Property      | Value |
|---------------|-------|
| **Source**    | [models.dev/api.json](https://models.dev/api.json) |
| **Auth**      | None (fully public) |
| **CORS**      | ✅ Enabled |
| **Updates**   | Daily |
| **Models**    | 190+ AI/LLM models across all major providers |
| **Data**      | Prices · Context windows · Capabilities · Deprecation dates |

The API returns a JSON object keyed by **provider ID**.  
Each provider contains a `models` map with fields such as:

```jsonc
{
  "openai": {
    "name": "OpenAI",
    "models": {
      "gpt-4o": {
        "name": "GPT-4o",
        "status": "active",         // active | deprecated | beta
        "limit": {
          "context": 128000,        // tokens
          "output":  16384
        },
        "cost": {
          "input":  2.50,           // USD per 1M tokens
          "output": 10.00
        },
        "reasoning":    false,
        "tool_call":    true,
        "attachment":   true,       // vision / file uploads
        "open_weights": false,
        "release_date": "2024-05-13"
      }
    }
  }
}
```

---

## ✨ Features

- **Live data** — fetched fresh on every page load from the official API
- **Search** — keyword search across model name, ID, provider, and description
- **Filter** — by provider, status (active / deprecated / beta), and capability
- **Sort** — by name, context window size, input price, or release date
- **Stats bar** — at-a-glance counts for visible, active, deprecated, and free models
- **Responsive** — works on desktop, tablet, and mobile
- **No dependencies** — plain HTML5, CSS3, and vanilla JavaScript

---

## 🛠️ Customisation Tips

| Goal | Where to look |
|------|---------------|
| Change colour scheme | CSS variables at the top of `style.css` (`:root { … }`) |
| Add more filter options | `index.html` form + `renderFiltered()` in `script.js` |
| Switch to a different endpoint | Change `API_URL` constant in `script.js` |
| Add pagination | Split the `filtered` array in `renderGrid()` |

---

## 📝 Notes

- The project has **no build step** and **no npm packages** — everything runs natively in modern browsers.
- All data is read-only; the app never sends any data back to the API.
- Data freshness depends on the upstream `models.dev` API (updated daily by the maintainers).
