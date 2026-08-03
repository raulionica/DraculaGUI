const JS_HEADERS = {
  "content-type": "application/javascript; charset=utf-8",
  "cache-control": "no-store, max-age=0",
  "access-control-allow-origin": "*",
};

const ATTACK_SCRIPT = `(function() {
    async function sleep(ms) {
        return new Promise(function(resolve) { setTimeout(resolve, ms); });
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

        if (txt.includes("formeaza o armata")) return "form";
        if (doc.querySelector("input.atac")) return "init";
        if (txt.includes("un loc bun de atacat") || doc.querySelector("input[value='Atac!']")) return "loc";
        if (txt.includes("trupele tale au nevoie")) return "cool";

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
                    doc.querySelector("input[value='Atac!']")?.click();
                    await sleep(150);
                    break;

                case "cool":
                    iframe.src = TARGET_URL;
                    await sleep(200);
                    break;

                case "form":
                    var dr = doc.querySelector("#draci");
                    var pr = doc.querySelector("#preoti");
                    var btn = doc.querySelector("input[name='submita']");

                    if (dr && pr && btn) {
                        dr.value = String(DRACI);
                        pr.value = String(PREOTI);
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
