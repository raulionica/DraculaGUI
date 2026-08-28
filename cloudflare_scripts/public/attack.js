(function() {

    async function sleep(ms) {
        return new Promise(r => setTimeout(r, ms));
    }

    const DRACI_SELECTOR = "#draci";
    const PREOTI_SELECTOR = "#preoti";
    const SUBMIT_SELECTOR = "input[name='submita']";
    const CONFIRM_SELECTOR = "input[value='Atac!'], input[value='Attack!']";

    function normalizeInputValue(value) {
        return String(value ?? "").replace(/[.,\s]/g, "");
    }

    function matchesInputValue(input, expected) {
        return normalizeInputValue(input?.value) === normalizeInputValue(expected);
    }

    function setGotInputValue(input, nextValue) {
        if (!input) return false;
        const value = normalizeInputValue(nextValue);
        input.value = value;
        input.defaultValue = value;
        return matchesInputValue(input, value);
    }
    // obține URL-ul scriptului (care conține parametri)
    const src = document.currentScript.src;
    const params = new URL(src).searchParams;

    const DRACI     = parseInt(params.get("draci") || "1", 10);
    const PREOTI    = parseInt(params.get("preoti") || "1", 10);
    const TARGET_ID = params.get("target");
    const TARGET_URL = "jucator.php?i=" + TARGET_ID;

    console.log("🔥 Attack script loaded:", {
        DRACI,
        PREOTI,
        TARGET_ID,
        TARGET_URL
    });

        // =====================================================
    // STATE DETECTOR
    // =====================================================
    function detectState(doc) {
        const txt = (doc.body.innerText || "").toLowerCase();

        if (doc.querySelector(DRACI_SELECTOR) && doc.querySelector(PREOTI_SELECTOR) && doc.querySelector(SUBMIT_SELECTOR)) return "form";
        if (txt.includes("formeaza o armata") || txt.includes("form an army")) return "form";
        if (doc.querySelector("input.atac")) return "init";
        if (txt.includes("un loc bun de atacat") || txt.includes("a good place to attack") || doc.querySelector(CONFIRM_SELECTOR)) return "loc";
        if (txt.includes("trupele tale au nevoie") || txt.includes("your troops need")) return "cool";

        return "unk";
    }

    // =====================================================
    // MAIN LOOP
    // =====================================================
    async function run() {

        const iframe = document.querySelector("#istanga");

        if (!iframe) {
            console.error("❌ Nu găsesc iframe-ul #istanga");
            return;
        }

        iframe.src = TARGET_URL;
        await sleep(200);

        while (true) {

            const doc = iframe.contentWindow.document;
            const state = detectState(doc);

            console.log(`STATE: ${state}`);

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
                    const dr = doc.querySelector("form input[name='draci']:not([type='hidden'])");
                    const pr = doc.querySelector("form input[name='preoti']:not([type='hidden'])");
                    const btn = doc.querySelector(SUBMIT_SELECTOR);

                    if (dr && pr && btn) {
                        const drReady = setGotInputValue(dr, DRACI);
                        const prReady = setGotInputValue(pr, PREOTI);
                        if (!drReady || !prReady) {
                            await sleep(150);
                            break;
                        }
                        btn.click();
                        console.log(`⚔️ Attack SENT → target ${TARGET_ID}`);
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

})();

