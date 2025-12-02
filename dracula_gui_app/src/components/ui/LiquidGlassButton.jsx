import React from "react";
import { Box } from "@mui/material";
import IconThoe2 from "../custom-icons";
import { TextTooltip } from "../styled-components/tooltip/TextTooltip";

export default function LiquidGlassButton({
    attackActionCard = null,
    icon = null,
    title = null,
    size = 80,
    onClick = () => { },
}) {
    const displayIcon = attackActionCard?.icon || icon;
    const color = attackActionCard?.color || "#00eaff";
    const tooltip = attackActionCard?.title || title;

    return (
        <>

            <TextTooltip title={tooltip}>

                <Box
                    onClick={onClick}
                    sx={{
                        width: size,
                        height: size,
                        borderRadius: "22px",
                        background: "rgba(255,255,255,0.04)",
                        backdropFilter: "blur(15px)",
                        border: "1px solid rgba(255,255,255,0.12)",
                        boxShadow:
                            "0 8px 25px rgba(0,0,0,0.45), inset 0 0 18px rgba(255,255,255,0.10)",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "all 0.25s ease",
                        userSelect: "none",

                        "&:hover": {
                            background: "rgba(255,255,255,0.12)",
                            transform: "translateY(-4px)",
                            boxShadow:
                                "0 12px 32px rgba(0,0,0,0.55), inset 0 0 22px rgba(255,255,255,0.18)",
                        },

                        "&:active": {
                            transform: "scale(0.96)",
                        },
                    }}
                >
                    <IconThoe2
                        icon={displayIcon}
                        sx={{
                            fontSize: size * 0.45,
                            color,
                            filter: "drop-shadow(0 0 6px #00eaffaa)",
                            pointerEvents: "none",
                        }}
                    />
                </Box>
            </TextTooltip>
        </>
    );
}
