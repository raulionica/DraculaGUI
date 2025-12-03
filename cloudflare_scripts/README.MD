### ✔️ Pași:

1. Install
   ```
    npm install -g wrangler

   ```
2. Run
 ```
 wrangler login
  ```
2. Run
 ```
    wrangler deploy

  ```
Ex: Cloudflare return: https://dracula-attack.<tld>.workers.dev/attack.js and use this link on your project in order to use this js.

### Structure
```
cloudflare_scripts
│── wrangler.toml
│── package.json
│── public/
│     └── attack.js
│     └── index.html
```