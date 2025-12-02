import React, { useState } from "react";
import { Box, Typography } from "@mui/material";

export function TextTooltip({ title, children }) {
  const [visible, setVisible] = useState(false);

  return (
    <Box
      sx={{ position: "relative", display: "inline-flex" }}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}

      {visible && (
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "-12px",
            transform: "translate(-100%, -50%)",
            whiteSpace: "nowrap",

            background: "rgba(255,255,255,0.12)",
            backdropFilter: "blur(8px)",
            padding: "6px 10px",
            borderRadius: "10px",
            border: "1px solid rgba(255,255,255,0.2)",
            color: "white",
            fontSize: "13px",
            zIndex: 999999999,
            pointerEvents: "none",
            boxShadow:"0 8px 25px rgba(0,0,0,0.45), inset 0 0 18px rgba(255,255,255,0.10)",
          }}
        >
          {title}
        </Box>
      )}
    </Box>
  );
}
