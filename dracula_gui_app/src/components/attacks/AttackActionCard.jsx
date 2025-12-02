import React from "react";
import { Box } from "@mui/material";

export default function AttackActionCard({ children }) {
  return (
    <Box
      sx={{
        p: 2,
        borderRadius: "18px",
        background: "rgba(255,255,255,0.05)",
        border: "1px solid rgba(255,255,255,0.12)",
        backdropFilter: "blur(10px)",
      }}
    >
      {children}
    </Box>
  );
}
