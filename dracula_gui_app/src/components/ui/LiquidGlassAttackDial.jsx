import React, { useState } from "react";
import { Box } from "@mui/material";
import LiquidGlassButton from "./LiquidGlassButton";

const ATTACK_CARDS = [
  { key: "primarii", title: "Attack Institutions", icon: "ui:court_house", color: "#9dff00", },
  { key: "government", title: "Attack Government", icon: "ui:government", color: "#ffb300", },
  { key: "parliament", title: "Attack Parliament", icon: "ui:parliament", color: "#00eaff", },
];

export default function LiquidGlassAttackDial({ onOpen }) {
  const [open, setOpen] = useState(false);

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 35,
        right: 35,
        zIndex: 999999999,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        gap: "12px",
      }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {ATTACK_CARDS.map((a, index) => (
        <Box
          key={a.key}
          sx={{
            transform: open ? "translateY(0px)" : "translateY(20px)",
            opacity: open ? 1 : 0,
            pointerEvents: open ? "auto" : "none",
            transition: `all ${0.25 + index * 0.05}s ease`,
          }}
        >
          <LiquidGlassButton
            size={60}
            attackActionCard={a}
            onClick={() => onOpen(a.key)}
          />
        </Box>
      ))}

      <LiquidGlassButton icon="ui:your_attack" size={85} title="Attack"/>
    </Box>
  );
}
