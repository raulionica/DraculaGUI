(function() {

    async function sleep(ms) {
        return new Promise(r => setTimeout(r, ms));
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

        if (txt.includes("formeaza o armata")) return "form";
        if (doc.querySelector("input.atac")) return "init";
        if (txt.includes("un loc bun de atacat") || doc.querySelector("input[value='Atac!']")) return "loc";
        if (txt.includes("trupele tale au nevoie")) return "cool";

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
                    doc.querySelector("input[value='Atac!']")?.click();
                    await sleep(150);
                    break;

                case "cool":
                    iframe.src = TARGET_URL;
                    await sleep(200);
                    break;

                case "form":
                    const dr = doc.querySelector("#draci");
                    const pr = doc.querySelector("#preoti");
                    const btn = doc.querySelector("input[name='submita']");

                    if (dr && pr && btn) {
                        dr.value = DRACI;
                        pr.value = PREOTI;
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

