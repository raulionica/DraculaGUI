import React, { useState, useEffect } from "react";
import AttackModal from "./attacks/AttackModal";
import LiquidGlassAttackDial from "./ui/LiquidGlassAttackDial";
import AttackProgressCard from "./attacks/AttackProgressCard";

import { STORAGE_KEY } from "@/constants/attacks";
import targets from "../data/attackTargets.json";

export default function DraculaGUI() {
    const [attackType, setAttackType] = useState(null);

    const getServerKey = () => window.location.hostname.toLowerCase();

    // ----------------------------------------------------
    // PRIMĂRII ROTATOR
    // ----------------------------------------------------
    const getNextPrimarieId = (list) => {
        let state = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
        let idx = state.primarieIndex || 0;

        const entry = list[idx];
        const id = entry.id;

        // avansează pointerul
        const nextIdx = (idx + 1) % list.length;
        state.primarieIndex = nextIdx;

        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        return id;
    };

    // ----------------------------------------------------
    // REZOLVARE TARGET
    // ----------------------------------------------------
    const resolveTargetId = (config) => {
        const server = getServerKey();
        const cfg = targets[server];
        if (!cfg) return 30;

        switch (config.category) {
            case "players": return null;
            case "primarii": return getNextPrimarieId(cfg.primarii);
            case "government": return cfg.guvern.id;
            case "parliament": return cfg.parlament.id;
            default: return 30;
        }
    };

    // ----------------------------------------------------
    // PORNEȘTE ATACUL
    // ----------------------------------------------------
    const executeAttack = (payload) => {
        let state = {
            remaining: payload.pub_attack || payload.max_count || 1,
            total: payload.pub_attack || payload.max_count || 1,
            index: 1,
            primarieIndex: 0,
            config: payload,
            lastTargetId: null,
            currentTargetName: null,
            lastAttack: null
        };

        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        runNextAttack();
    };

    // ----------------------------------------------------
    // EXECUTĂ UN ATAC
    // ----------------------------------------------------
    const runNextAttack = () => {
        let saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
        if (!saved || saved.remaining <= 0) return;

        const p = saved.config;
        const server = getServerKey();
        const cfg = targets[server];
        const attackIndex = saved.index;

        // ============================
        // 1️⃣ TARGET ID – ROTATION FIX
        // ============================
        let TARGET;
        let targetName = "Unknown";

        if (p.category === "primarii") {

            // folosim indexul ACTUAL, nu incrementăm încă
            const list = cfg.primarii;
            const currentIdx = saved.primarieIndex || 0;

            TARGET = list[currentIdx].id;
            targetName = list[currentIdx].name;

            // pregătim indexul pentru următorul atac
            saved.primarieIndex = (currentIdx + 1) % list.length;

        } else if (p.category === "players") {

            TARGET = null;
            targetName = p.player_name || "Player";

        } else if (p.category === "government") {

            TARGET = cfg.guvern.id;
            targetName = cfg.guvern.name;

        } else if (p.category === "parliament") {

            TARGET = cfg.parlament.id;
            targetName = cfg.parlament.name;
        }

        // ============================
        // 2️⃣ DRACI / PREOTI
        // ============================
        let usedDRACI = 0;
        let usedPREOTI = 0;
        let isLoss = null;

        if (p.category === "players" || p.category === "primarii") {
            usedDRACI = p.draci;
            usedPREOTI = p.preoti;
        } else {
            isLoss = attackIndex % 2 === 1;
            usedDRACI = isLoss ? p.draci_loss : p.draci_win;
            usedPREOTI = isLoss ? p.preoti_loss : p.preoti_win;
        }

        // ============================
        // 3️⃣ SALVARE STARE COMPLETĂ
        // ============================
        const nextState = {
            ...saved,
            remaining: saved.remaining - 1,
            index: saved.index + 1,
            lastTargetId: TARGET,
            currentTargetName: targetName,
            lastAttack: {
                draci: usedDRACI,
                preoti: usedPREOTI,
                loss: isLoss,
                targetName,
                attackNumber: attackIndex
            }
        };

        localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));

        // ============================
        // 4️⃣ EXECUTĂ ATACUL
        // ============================
        const url =
            "https://dracula-attack.thoe2dev.workers.dev/attack.js" +
            `?draci=${usedDRACI}` +
            `&preoti=${usedPREOTI}` +
            (TARGET ? `&target=${TARGET}` : "") +
            `&cb=${Math.random()}`;

        const s = document.createElement("script");
        s.src = url;
        document.body.appendChild(s);

    };


    // ----------------------------------------------------
    // CONTINUĂ LA REFRESH
    // ----------------------------------------------------
    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
        if (saved && saved.remaining > 0) {
            runNextAttack();
        } else {
            localStorage.removeItem(STORAGE_KEY);
        }
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

            <AttackProgressCard />
        </>
    );
}
