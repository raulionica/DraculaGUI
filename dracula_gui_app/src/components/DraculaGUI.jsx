import React, { useState, useEffect } from "react";
import AttackModal from "./attacks/AttackModal";
import LiquidGlassAttackDial from "./ui/LiquidGlassAttackDial";
import AttackProgressCard from "./attacks/AttackProgressCard";

import { STORAGE_KEY } from "@/constants/attacks";
import { requireLicenseKey } from "@/core/license";
import targets from "../data/attackTargets.json";

export default function DraculaGUI() {
    const [attackType, setAttackType] = useState(null);

    const getServerKey = () => {
        const hostname = window.location.hostname.toLowerCase();
        if (targets[hostname]) return hostname;

        const withoutWww = hostname.replace(/^www\./, "");
        return targets[withoutWww] ? withoutWww : hostname;
    };

    // ----------------------------------------------------
    // PORNEȘTE ATACUL
    // ----------------------------------------------------
    const executeAttack = (payload) => {
        const licenseKey = requireLicenseKey();
        if (!licenseKey) return;

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

        const licenseKey = requireLicenseKey();
        if (!licenseKey) return;

        const p = saved.config;
        const server = getServerKey();
        const cfg = targets[server];
        if (!cfg) {
            console.error(`DraculaGUI: unsupported attack server "${window.location.hostname}".`);
            return;
        }
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
        const params = new URLSearchParams({
            draci: String(usedDRACI),
            preoti: String(usedPREOTI),
            license_key: licenseKey,
            cb: String(Math.random()),
        });

        if (TARGET) params.set("target", String(TARGET));

        const url = `https://dracula-attack.thoe2dev.workers.dev/attack.js?${params.toString()}`;

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
