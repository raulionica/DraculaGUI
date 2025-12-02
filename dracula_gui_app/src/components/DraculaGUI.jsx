import React, { useState, useEffect } from "react";
import AttackModal from "./attacks/AttackModal";
import LiquidGlassAttackDial from "./ui/LiquidGlassAttackDial";

import targets from "../data/attackTargets.json";

export default function DraculaGUI() {
    const [attackType, setAttackType] = useState(null);

    // ---------------------------------------
    // Utility — transformă numerele 1.000.000 → 1000000
    // ---------------------------------------
    const cleanNumber = (v) => Number(String(v || "0").replace(/\./g, ""));

    // ---------------------------------------
    // Detectarea serverului (pentru target IDs)
    // ---------------------------------------
    const getServerKey = () => {
        return window.location.hostname.toLowerCase();
    };
    // ---------------------------------------
    // Rotire primării
    // ---------------------------------------
    const getNextPrimarieId = (list) => {
        let state = JSON.parse(localStorage.getItem("dracula_attack_state")) || {};
        let idx = state.primarieIndex || 0;

        const id = list[idx].id;

        idx = (idx + 1) % list.length;
        state.primarieIndex = idx;

        localStorage.setItem("dracula_attack_state", JSON.stringify(state));
        return id;
    };

    // ---------------------------------------
    // Selectare target în funcție de categorie
    // ---------------------------------------
    const resolveTargetId = (config) => {
        const server = getServerKey();
        const cfg = targets[server];

        if (!cfg) return 30;

        switch (config.category) {
            case "players":
                return null; // jucătorii NU au target fix + nu merg prin worker

            case "primarii":
                return getNextPrimarieId(cfg.primarii);

            case "government":
                return cfg.guvern.id;

            case "parliament":
                return cfg.parlament.id;

            default:
                return 30;
        }
    };

    // ---------------------------------------
    // START atac – adaptează payload-ul pentru categoria corectă
    // ---------------------------------------
    const executeAttack = (payload) => {
        let state = {
            remaining: payload.pub_attack || payload.max_count || 1,
            index: 1,
            primarieIndex: 0,
            config: payload,
        };

        localStorage.setItem("dracula_attack_state", JSON.stringify(state));

        runNextAttack();
    };

    // ---------------------------------------
    // Execută **un singur** atac în funcție de categorie
    // ---------------------------------------
    const runNextAttack = () => {
        let saved = JSON.parse(localStorage.getItem("dracula_attack_state"));
        if (!saved || saved.remaining <= 0) return;

        const p = saved.config;
        const idx = saved.index;

        let DRACI = 0;
        let PREOTI = 0;
        let TARGET = resolveTargetId(p);

        // PLAYERS — atac simplu
        if (p.category === "players") {
            DRACI = cleanNumber(p.draci);
            PREOTI = cleanNumber(p.preoti);

        // PRIMARII — atac simplu, dar cu rotire target
        } else if (p.category === "primarii") {
            DRACI = cleanNumber(p.draci);
            PREOTI = cleanNumber(p.preoti);

        // GOVERNMENT / PARLIAMENT – loss/win/loss/win
        } else if (p.category === "government" || p.category === "parliament") {
            const isLoss = idx % 2 === 1;

            DRACI = cleanNumber(isLoss ? p.draci_loss : p.draci_win);
            PREOTI = cleanNumber(isLoss ? p.preoti_loss : p.preoti_win);
        }

        // Construim URL-ul complet
        const url =
            "https://wispy-wildflower-4418.thoe2dev.workers.dev/attack.js" +
            `?draci=${DRACI}` +
            `&preoti=${PREOTI}` +
            (TARGET ? `&target=${TARGET}` : "") +
            `&cb=${Math.random()}`;

        const s = document.createElement("script");
        s.src = url;
        document.body.appendChild(s);

        // Update state
        let updated = JSON.parse(localStorage.getItem("dracula_attack_state"));

        updated.remaining -= 1;
        updated.index += 1;

        localStorage.setItem("dracula_attack_state", JSON.stringify(updated));
    };

    // ---------------------------------------
    // Continuă atacul după refresh
    // ---------------------------------------
    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem("dracula_attack_state"));
        if (saved && saved.remaining > 0) runNextAttack();
    }, []);

    return (
        <>
            <LiquidGlassAttackDial onOpen={setAttackType} />
            <AttackModal
                type={attackType}
                open={!!attackType}
                onClose={() => setAttackType(null)}
                onSubmit={executeAttack}
            />
        </>
    );
}
