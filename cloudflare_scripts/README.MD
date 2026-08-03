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

### License keys

Worker-ul cere `license_key` pe `/attack.js`. Extensiile vechi care nu trimit cheia primesc `403`.

Seteaza cheile valide ca secret Cloudflare, separate prin virgula/spatiu/linie noua:

```sh
wrangler secret put LICENSE_KEYS
```

Exemplu valoare:

```txt
DRACULA-KEY-1,DRACULA-KEY-2,DRACULA-KEY-3
```

Extensia salveaza cheia introdusa de user in `localStorage` sub `dracula_license_key`.

### Structure
```
cloudflare_scripts
│── wrangler.toml
│── package.json
│── public/
│     └── attack.js
│     └── index.html
```
