import React, { useEffect, useState } from "react";
import { Box, Typography, Avatar, LinearProgress } from "@mui/material";
import IconThoe2 from "@/components/custom-icons";
import CloseButton from "@/components/styled-components/button/CloseButton";
import { ATTACK_CARDS, STORAGE_KEY } from "@/constants/attacks";
import { formatNumber } from "@/utils/formatted/numberFormat";

export default function AttackProgressCard() {
    const [state, setState] = useState(null);

    useEffect(() => {
        const interval = setInterval(() => {
            const s = JSON.parse(localStorage.getItem(STORAGE_KEY));
            setState(s || null);
        }, 150);

        return () => clearInterval(interval);
    }, []);

    if (!state) return null;

    // Basic numbers
    const progressIndex = state.index - 1;
    const percent = Math.round((progressIndex / state.total) * 100);
    
    const card = ATTACK_CARDS.find(c => c.key === state?.config?.category);
    
    const category = state?.category;
    const isGovOrParl = category === "government" || category === "parliament";
    let color;
    
    if (isGovOrParl) {
        const isLoss = state.index % 2 === 1;
        color = isLoss ? "#ff5959" : "#3bd7ff";
    } else {
        color = card?.color || "#3bd7ff";
    }

    const icon = card?.icon || "ui:characters";

    // Target name
    const targetName = state.currentTargetName || "Unknown";
    const draci = state?.lastAttack?.draci ?? 0;
    const preoti = state?.lastAttack?.preoti ?? 0;

    const clearStorage = () => {
        localStorage.removeItem(STORAGE_KEY);
        setState(null);
    };

    return (
        <Box
            sx={{
                position: "fixed",
                bottom: "25px",
                left: "50%",
                transform: "translateX(-50%)",
                width: "fit-content",
                maxWidth: "90vw",
                p: 2.5,
                borderRadius: "10px",
                background: "rgba(255,255,255,0.04)",
                backdropFilter: "blur(18px)",
                border: "1px solid rgba(255,255,255,0.12)",
                color: "#fff",
                boxShadow: "0 8px 25px rgba(0,0,0,0.45), inset 0 0 18px rgba(255,255,255,0.10)",
                zIndex: 999999,
            }}
        >
            <CloseButton onClick={clearStorage} />

            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                {/* ICON */}
                <Avatar
                    sx={{
                        width: 78,
                        height: 78,
                        bgcolor: `${color}22`,
                        border: `2px solid ${color}`,
                        boxShadow: `0 0 14px ${color}aa`,
                        backdropFilter: "blur(8px)",
                    }}
                >
                    <IconThoe2
                        icon={icon}
                        sx={{
                            fontSize: 44,
                            color,
                            filter: "drop-shadow(0 0 8px rgba(255,255,255,0.8))",
                        }}
                    />
                </Avatar>

                <Box sx={{ flex: 1 }}>
                    {/* TEXT LINE */}
                    <Box sx={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 1 }}>
                        <Typography sx={{ fontWeight: 400, fontSize: "17px" }}>
                            Attacking
                        </Typography>

                        <Typography sx={{ fontWeight: 900, fontSize: "17px", color: "#fff" }}>
                            {targetName}
                        </Typography>

                        <Typography sx={{ fontWeight: 400, fontSize: "17px" }}>
                            with
                        </Typography>

                        <IconThoe2 icon="bonus:gremlins" sx={{ fontSize: 20, color: "#ff5959" }} />
                        <Typography sx={{ fontWeight: 900, fontSize: "17px", color: "#fff" }}>
                            {formatNumber(draci)}
                        </Typography>

                        <IconThoe2 icon="bonus:priests" sx={{ fontSize: 20, color: "#000000ff" }} />
                        <Typography sx={{ fontWeight: 900, fontSize: "17px", color: "#fff" }}>
                            {formatNumber(preoti)}
                        </Typography>
                    </Box>

                    {/* PROGRESS ROW */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
                        <Typography
                            sx={{ fontSize: "14px", fontWeight: 900, textAlign: "left", minWidth: "55px" }}
                        >
                            {progressIndex} / {state.total}
                        </Typography>

                        <LinearProgress
                            variant="determinate"
                            value={percent}
                            sx={{
                                flex: 1,
                                height: "12px",
                                borderRadius: "8px",
                                background: "rgba(255,255,255,0.08)",
                                "& .MuiLinearProgress-bar": {
                                    background: color,
                                    boxShadow: `0 0 10px ${color}`,
                                },
                            }}
                        />

                        <Typography
                            sx={{ fontSize: "14px", fontWeight: 900, textAlign: "right", minWidth: "55px" }}
                        >
                            {percent}%
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}
