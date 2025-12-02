import React from "react";
import { Box, Typography, LinearProgress, Avatar } from "@mui/material";
import IconThoe2 from "@/components/custom-icons";
import { formatNumber } from "./utils/formatted/numberFormat";

export default function AttackProgressCard({ runningData, cardConfig }) {

    if (!runningData) return null;

    const icon = cardConfig?.icon || "ui:characters";
    const color = cardConfig?.color || "#00eaff";

    return (
        <Box
            sx={{
                mt: 2,
                p: 2,
                borderRadius: "18px",
                background: "rgba(255,255,255,0.06)",
                backdropFilter: "blur(18px)",
                border: "1px solid rgba(255,255,255,0.12)",
                boxShadow: "0 12px 30px rgba(0,0,0,0.45)",
                color: "#fff",
            }}
        >
            {/* ROW: AVATAR */}
            <Box sx={{ display: "flex", gap: 2 }}>
                {/* Avatar */}
                <Avatar
                    sx={{
                        width: 108,
                        height: 108,
                        bgcolor: `${color}20`,
                        border: `2px solid ${color}`,
                        boxShadow: `0 0 14px ${color}80`,
                        mt: 0.5,
                    }}
                >
                    <IconThoe2
                        icon={icon}
                        color={runningData.mode == "LOSS" ? "rgba(216,20,20,0.45)" : "rgba(233, 219, 219, 0.94)"}
                        sx={{ 
                            fontSize: 64, 
                        }}
                    />
                </Avatar>

                {/* CONTENT */}
                <Box sx={{ flex: 1 }}>
                    {/* Header line: username + icon + target */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Typography sx={{ fontWeight: 400, fontSize: "17px" }}>
                            {"Attacking "}
                        </Typography>

                        <IconThoe2 icon="ui:your_attack"

                            sx={{ 
                                fontSize: 20,
                                color: runningData.mode == "LOSS"
                                    ? "rgba(216, 95, 25, 0.62)"
                                    : "#5bc0ff",
                            }} 
                        />

                        <Typography sx={{ fontWeight: 900, fontSize: "17px", color: "#fff"}}>
                            {runningData.target}
                        </Typography>
                        <Typography sx={{ fontWeight: 400, fontSize: "17px" }}>
                            {" with "}
                        </Typography>
                        <IconThoe2 icon="bonus:gremlins" color='red' sx={{ fontSize: 20 }} />
                        <Typography sx={{ fontWeight: 900, fontSize: "17px", color: "#fff"}}>
                            {formatNumber(runningData.gremlins)}
                        </Typography>
                        <IconThoe2 icon="bonus:priests" color='black' sx={{ fontSize: 20 }} />
                        <Typography sx={{ fontWeight: 400, fontSize: "17px", color: "#fff" }}>
                            {formatNumber(runningData.priests)}
                        </Typography>
                    </Box>

                    {/* Progress Row */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 1 }}>
                        <Typography
                            sx={{
                                fontSize: "14px",
                                color: "rgba(255,255,255,0.85)",
                                fontWeight: 600,
                            }}
                        >
                            {runningData.current} / {runningData.total}
                        </Typography>

                        <LinearProgress
                            variant="determinate"
                            value={runningData.percent}
                            sx={{
                                flex: 1,
                                height: "10px",
                                borderRadius: "6px",
                                background: "rgba(255,255,255,0.12)",
                                "& .MuiLinearProgress-bar": {
                                    background: `linear-gradient(90deg, ${color}, ${color}aa)`,
                                    borderRadius: "6px",
                                    boxShadow: `0 0 8px ${color}`,
                                },
                            }}
                        />

                        <Typography
                            sx={{
                                fontSize: "14px",
                                color: "rgba(255,255,255,0.85)",
                                fontWeight: 900,
                                textAlign: "right",
                            }}
                        >
                            {runningData.percent}%
                        </Typography>
                    </Box>
                    {/* LOG Container */}
                    <Box
                        sx={{
                            mt: 2,
                            p: 2,
                            borderRadius: "18px",
                            background: "rgba(255,255,255,0.02)",
                            backdropFilter: "blur(18px)",
                            border: "1px solid rgba(255,255,255,0.12)",
                            boxShadow: "0 12px 30px rgba(0,0,0,0.45)",
                            color: "#fff",
                        }}
                    >
                        <Typography
                            sx={{
                                mt: 2,
                                textAlign: "left",
                                fontSize: "14px",
                                color: runningData.mode == "LOSS" ? "rgba(216, 95, 25, 0.62)" : "rgba(25, 216, 143, 0.42)",
                                fontWeight: 900,
                            }}
                        >
                            {runningData.message}
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}
