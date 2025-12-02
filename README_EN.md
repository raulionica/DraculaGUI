# 🧛‍♂️ DraculaGUI  
React-based Chrome Extension UI for GotGremlins / Aidraci  
Automated attacks • Dynamic target rotation • Parliament/Government logic • Full React interface

---

## 📦 Project Structure

```
scripts/
│
├── dracula_extension/            # Chrome extension root
│   ├── dracula_app/              # Auto-generated React build copied here
│   ├── draculaGUI.js             # Injection script
│   └── manifest.json             # Chrome extension manifest
│
├── dracula_gui_app/              # Vite + React source code
│   ├── public/
│   ├── src/
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
└── cloudflare_scripts/           # Optional Cloudflare Worker scripts
```

---

# 🧩 Installation (Chrome Extension)

DraculaGUI can be installed in **two ways**:

---

# ✅ **1. Direct Installation (NO BUILD REQUIRED)** — Recommended

The folder `dracula_extension/` already contains a full working extension.

### ✔️ Steps:

1. Open Chrome and go to:
   ```
   chrome://extensions/
   ```
2. Enable **Developer Mode** (top-right corner)
3. Click **Load unpacked**
4. Select the folder:
   ```
   scripts/dracula_extension/
   ```

Done — the extension works immediately without installing Node or building anything.

---

# 🛠️ **2. Installation WITH BUILD (for React developers / contributors)**

If you want to modify the UI and rebuild it:

---

## 2.1. Install dependencies

Navigate to:

```
scripts/dracula_gui_app/
```

Run:

```sh
npm install
```

---

## 2.2. Development mode (hot reload)

```sh
npm run dev
```

This runs the React UI for development purposes.  
⚠️ **Chrome does NOT use this dev server.**  
The extension only uses the build output.

---

## 2.3. Build the extension (auto-copied)

```sh
npm run build
```

This creates:

```
scripts/dracula_gui_app/dist/
```

And automatically copies it to:

```
scripts/dracula_extension/dracula_app/
```

Chrome Extension will now load the new UI.

---

# 🚀 Using DraculaGUI in the Game

Once the extension is loaded:

1. Open GotGremlins / Aidraci
2. The DraculaGUI panel appears on screen
3. You can:

### 🏛️ Parliament & Government  
- LOSS → WIN pattern automatically  
- Configurable gremlins/priests  
- Optional wine boost  

### 🏤 City Halls (Primării)  
- Automatic rotating target system  
- Saves state between refreshes  

All settings persist using `localStorage`.

---

# 📁 Build Output Overview

- **`dracula_extension/dracula_app/`** → final production build used by Chrome  
- **`dracula_gui_app/`** → editable React source code  
- **`manifest.json`** → defines permissions + content scripts  

---

# 📄 .gitignore

This repository ignores:

```
node_modules/
dist/
.DS_Store
```

---

# 🤝 Contributing

All contributions are welcome.  
If you want to improve logic, UI, automation, or documentation, feel free to create:

- Issues  
- Pull Requests  
- Feature suggestions  

---

# 📄 License

Licensed under the **MIT License** — free for personal and educational use.

