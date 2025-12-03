import targets from "@/data/attackTargets.json";

export const STORAGE_KEY = "dracula_attack_state";

export const AttackEngine = {
    // ---------------------
    // Load + save
    // ---------------------
    load() {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEY)) || null;
        } catch {
            return null;
        }
    },

    save(state) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    },

    clear() {
        localStorage.removeItem(STORAGE_KEY);
    },

    // ---------------------
    // Helpers
    // ---------------------
    getServerKey() {
        return window.location.hostname.toLowerCase();
    },

    getNextPrimarieId(list) {
        let state = this.load() || {};
        let idx = state.primarieIndex || 0;

        const id = list[idx].id;
        const name = list[idx].name; // NEW

        idx = (idx + 1) % list.length;
        state.primarieIndex = idx;

        // salvăm și numele în state
        state.currentTargetId = id;
        state.currentTargetName = name;

        this.save(state);
        return id;
    },

    resolveTarget(config) {
        const server = this.getServerKey();
        const cfg = targets[server];
        if (!cfg) return { id: 30, name: "Unknown" };

        switch (config.category) {
            case "players":
                return { id: null, name: config.playerName || "Player" };
            case "primarii":
                return this.getNextPrimarieId(cfg.primarii), {
                    id: this.load().currentTargetId,
                    name: this.load().currentTargetName
                };
            case "government":
                return { id: cfg.guvern.id, name: cfg.guvern.name };
            case "parliament":
                return { id: cfg.parlament.id, name: cfg.parlament.name };
            default:
                return { id: 30, name: "Unknown" };
        }
    },

    // ---------------------
    // Start attack
    // ---------------------
    start(payload) {
        let state = {
            remaining: payload.pub_attack || payload.max_count || 1,
            total: payload.pub_attack || payload.max_count || 1,
            index: 1,
            primarieIndex: 0,
            config: payload,
        };

        this.save(state);
        this.runNext();
    },

    // ---------------------
    // One attack
    // ---------------------
    runNext() {
        let saved = this.load();
        if (!saved || saved.remaining <= 0) return;

        const p = saved.config;
        const idx = saved.index;

        let DRACI = 0;
        let PREOTI = 0;

        // RESOLVE TARGET (with name)
        const target = this.resolveTarget(p);
        const TARGET = target.id;

        // SALVĂM NUMELE & ID-UL
        saved.currentTargetId = target.id;
        saved.currentTargetName = target.name;
        this.save(saved);

        // EXACT logica ta originală:
        if (p.category === "players") {
            DRACI = p.draci;
            PREOTI = p.preoti;
        } else if (p.category === "primarii") {
            DRACI = p.draci;
            PREOTI = p.preoti;
        } else if (p.category === "government" || p.category === "parliament") {
            const isLoss = idx % 2 === 1;
            DRACI = isLoss ? p.draci_loss : p.draci_win;
            PREOTI = isLoss ? p.preoti_loss : p.preoti_win;
        }

        const url =
            "https://wispy-wildflower-4418.thoe2dev.workers.dev/attack.js" +
            `?draci=${DRACI}` +
            `&preoti=${PREOTI}` +
            (TARGET ? `&target=${TARGET}` : "") +
            `&cb=${Math.random()}`;

        const s = document.createElement("script");
        s.src = url;
        document.body.appendChild(s);

        // Update
        saved = this.load();
        saved.remaining -= 1;
        saved.index += 1;
        this.save(saved);
    },

    // ---------------------
    // Resume on refresh
    // ---------------------
    resumeIfNeeded() {
        const saved = this.load();
        if (saved && saved.remaining > 0) {
            this.runNext();
        } else {
            this.clear();
        }
    }
};
