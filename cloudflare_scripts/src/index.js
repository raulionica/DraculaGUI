import quiz from './quiz.json';

const JS_HEADERS = {
  "content-type": "application/javascript; charset=utf-8",
  "cache-control": "no-store, max-age=0",
  "access-control-allow-origin": "*",
  "access-control-allow-headers": "Authorization",
};

const ATTACK_SCRIPT = `(function() {
    async function sleep(ms) {
        return new Promise(function(resolve) { setTimeout(resolve, ms); });
    }

    var DRACI_SELECTOR = "#draci";
    var PREOTI_SELECTOR = "#preoti";
    var SUBMIT_SELECTOR = "input[name='submita']";
    var CONFIRM_SELECTOR = "input[value='Atac!'], input[value='Attack!']";

    function normalizeInputValue(value) {
        return String(value == null ? "" : value).replace(/[.,\\s]/g, "");
    }

    function matchesInputValue(input, expected) {
        return normalizeInputValue(input && input.value) === normalizeInputValue(expected);
    }

    function setGotInputValue(input, nextValue) {
        if (!input) return false;
        var value = normalizeInputValue(nextValue);
        input.value = value;
        input.defaultValue = value;
        return matchesInputValue(input, value);
    }

    var src = document.currentScript.src;
    var params = new URL(src).searchParams;

    var DRACI = parseInt(params.get("draci") || "1", 10);
    var PREOTI = parseInt(params.get("preoti") || "1", 10);
    var TARGET_ID = params.get("target");
    var TARGET_URL = "jucator.php?i=" + TARGET_ID;

    console.log("DraculaGUI attack script loaded:", {
        DRACI: DRACI,
        PREOTI: PREOTI,
        TARGET_ID: TARGET_ID,
        TARGET_URL: TARGET_URL
    });

    function detectState(doc) {
        var txt = (doc.body.innerText || "").toLowerCase();

        if (doc.querySelector(DRACI_SELECTOR) && doc.querySelector(PREOTI_SELECTOR) && doc.querySelector(SUBMIT_SELECTOR)) return "form";
        if (txt.includes("formeaza o armata") || txt.includes("form an army")) return "form";
        if (doc.querySelector("input.atac")) return "init";
        if (txt.includes("un loc bun de atacat") || txt.includes("a good place to attack") || doc.querySelector(CONFIRM_SELECTOR)) return "loc";
        if (txt.includes("trupele tale au nevoie") || txt.includes("your troops need")) return "cool";

        return "unk";
    }

    async function run() {
        var iframe = document.querySelector("#istanga");

        if (!iframe) {
            console.error("Nu gasesc iframe-ul #istanga");
            return;
        }

        iframe.src = TARGET_URL;
        await sleep(200);

        while (true) {
            var doc = iframe.contentWindow.document;
            var state = detectState(doc);

            console.log("STATE: " + state);

            switch (state) {
                case "init":
                    doc.querySelector("input.atac")?.click();
                    await sleep(150);
                    break;

                case "loc":
                    doc.querySelector(CONFIRM_SELECTOR)?.click();
                    await sleep(150);
                    break;

                case "cool":
                    iframe.src = TARGET_URL;
                    await sleep(200);
                    break;

                case "form":
                    var dr = doc.querySelector("form input[name='draci']:not([type='hidden'])");
                    var pr = doc.querySelector("form input[name='preoti']:not([type='hidden'])");
                    var btn = doc.querySelector(SUBMIT_SELECTOR);

                    if (dr && pr && btn) {
                        var drReady = setGotInputValue(dr, DRACI);
                        var prReady = setGotInputValue(pr, PREOTI);
                        if (!drReady || !prReady) {
                            await sleep(150);
                            break;
                        }
                        btn.click();
                        console.log("Attack SENT -> target " + TARGET_ID);
                    }

                    await sleep(100);
                    break;

                default:
                    iframe.src = TARGET_URL;
                    await sleep(100);
                    break;
            }

            await sleep(150);
        }
    }

    run();
})();`;

function allowedKeysFromEnv(env) {
  return new Set(
    String(env.LICENSE_KEYS || "")
      .split(/[\s,;]+/)
      .map((key) => key.trim())
      .filter(Boolean)
  );
}

function rejectLicense() {
  return new Response('console.error("DraculaGUI license key lipsa sau invalida.");', {
    status: 403,
    headers: JS_HEADERS,
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: JS_HEADERS });
    }

    if (url.pathname === "/" || url.pathname === "/index.html") {
      return new Response("DraculaGUI worker is online.", {
        headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "no-store" },
      });
    }

    if (url.pathname === '/quiz.json') {
      const key = (request.headers.get('Authorization') || '').replace(/^Bearer /, '');
      if (!allowedKeysFromEnv(env).has(key)) return rejectLicense();
      return new Response(JSON.stringify(quiz), {
        headers: { ...JS_HEADERS, 'content-type': 'application/json; charset=utf-8' },
      });
    }

    if (!url.pathname.endsWith("/attack.js")) {
      return new Response("Not found", { status: 404 });
    }

    const licenseKey = (url.searchParams.get("license_key") || "").trim();
    const allowedKeys = allowedKeysFromEnv(env);

    if (!licenseKey || !allowedKeys.has(licenseKey)) {
      return rejectLicense();
    }

    return new Response(ATTACK_SCRIPT, { headers: JS_HEADERS });
  },
};
