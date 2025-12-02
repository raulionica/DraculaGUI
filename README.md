# 🧛‍♂️ DraculaGUI  
React UI Chrome Extension for GotGremlins / Aidraci  
Automated attacks • Dynamic target rotation • Parliament/Government Logic • Full React interface

---

## 📦 Project Structure

```
scripts/
│
├── dracula_extension/            # Chrome extension root
│   ├── dracula_app/              # Auto-generated build copied here
│   ├── draculaGUI.js             # Injection script
│   └── manifest.json             # Chrome extension manifest
│
├── dracula_gui_app/              # React (Vite) source project
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

DraculaGUI poate fi instalat în două moduri:

---

# ✅ **1. Instalare directă (FĂRĂ BUILD) — Recomandat**

Folderul `dracula_extension/` este deja pregătit pentru Chrome.

### ✔️ Pași:

1. Deschide Chrome și accesează:
   ```
   chrome://extensions/
   ```
2. Activează **Developer Mode** (dreapta sus)
3. Apasă **Load unpacked**
4. Selectează folderul:
   ```
   scripts/dracula_extension/
   ```

Extensia este gata de utilizare fără să instalezi Node, npm sau să construiești build-ul.

---

# 🛠️ **2. Install WITH BUILD (pentru dezvoltatori React / contribuții)**

Dacă vrei să modifici UI-ul și să reconstruiești build-ul React:

---

## 2.1. Instalare dependențe

Intră în folderul:

```
scripts/dracula_gui_app/
```

Rulează:

```sh
npm install
```

---

## 2.2. Development mode (hot reload)

```sh
npm run dev
```

Acesta rulează UI-ul în browser pentru dezvoltare, dar **nu este folosit de Chrome**.  
Extensia Chrome folosește DOAR build-ul final.

---

## 2.3. Generare build (automat copiat în extensie)

```sh
npm run build
```

Build-ul apare în:

```
scripts/dracula_gui_app/dist/
```

Și este copiat automat în:

```
scripts/dracula_extension/dracula_app/
```

Chrome Extension va folosi automat acest build nou fără să muți manual fișiere.

---

# 🚀 Using DraculaGUI in the Game

1. Deschide jocul GotGremlins / Aidraci  
2. Extensia injectează un panou UI în colțul ecranului  
3. Poți:
   - Ataca Parlament / Guvern cu logică LOSS → WIN automată
   - Ataca Primării cu rotire automată după listă
   - Ataca jucători
   - Folosi Cloudflare Worker pentru execuția scripturilor de atac
   - Configura numere mari folosind sugestii presetate

Totul este salvat automat în `localStorage`.

---

# 📁 Build Output Explained

- **`dracula_extension/dracula_app/`** – conține build-ul final React (JS + CSS + assets)
- **`dracula_extension/manifest.json`** – declară extensia Chrome
- **`dracula_gui_app/`** – codul sursă React pentru dezvoltare

---

# 📄 .gitignore

Repo ignoră automat:

```
node_modules/
dist/
.DS_Store
```

---

# Demo:
![alt text](image.png)

# 🤝 Contributing

Pull requests and improvements are welcome!  
Poți deschide Issue pentru buguri, funcționalități noi sau întrebări.

---

# 📄 License

MIT License – free for personal and educational use.
