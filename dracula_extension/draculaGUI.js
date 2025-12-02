// 1) Creează nodul unde se va monta React (id-ul trebuie să fie același ca în index.html)
const mount = document.createElement("div");
mount.id = "dracula-gui-react-root";

// Poți să-l pui unde vrei, eu îl pun la final de body
document.body.appendChild(mount);

// 2) Injectează bundle-ul React generat de Vite
const script = document.createElement("script");
script.type = "module";
script.src = chrome.runtime.getURL("dracula_app/main.js");
document.body.appendChild(script);
