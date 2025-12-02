import React, { useEffect, useState } from "react";
import {
  Box,
  Modal,
  Typography,
  Button,
  Switch,
  FormControlLabel,
  TextField,
} from "@mui/material";

import AttackActionCard from "./AttackActionCard";
import AttackSelectInput from "./AttackSelectInput";
import attackFields from "./attackFields";
import IconThoe2 from "../custom-icons";
import CloseButton from "../styled-components/button/CloseButton";

export default function AttackModal({ type, open, onClose, onSubmit }) {
  const config = attackFields[type];

  const [form, setForm] = useState(config?.getInitialValues() ?? {});

  useEffect(() => {
    if (open && config) {
      setForm(config.getInitialValues());
    }
  }, [open, config]);

  if (!config) return null;

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    const { runner, method, payload } = config.buildCommand(form);
    if (onSubmit) onSubmit(payload);
    if (onClose) onClose();
  };

  return (
    <Modal
      open={open}
      disableEscapeKeyDown
      BackdropProps={{
        sx: {
          background: "rgba(0,0,0,0.75)",
          backdropFilter: "blur(6px)",
        },
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 520,
          maxWidth: "95vw",
          p: 3,
          borderRadius: "22px",

          background: "rgba(255,255,255,0.06)",
          backdropFilter: "blur(18px)",
          border: "1px solid rgba(255,255,255,0.12)",
          boxShadow: "0 18px 40px rgba(0,0,0,0.65)",
        }}
      >
        {/* Title */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1.5,
            mb: 2.5,
          }}
        >
          <IconThoe2
            icon={config.icon}
            sx={{ fontSize: 34, color: "#e5c07b" }}
          />

          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              color: "#e5c07b",
              letterSpacing: 0.4,
            }}
          >
            {config.title}
          </Typography>

          <Box
            sx={{
              position: "absolute",
              top: 10,
              right: 10,
              zIndex: 10,
            }}
          >
            <CloseButton onClick={onClose} />
          </Box>
        </Box>

        {/* Number of attacks + wine */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr auto",
            alignItems: "center",
            mb: 3,
          }}
        >
          <TextField
            label="Number of attacks"
            type="number"
            fullWidth
            value={form.count ?? ""}
            onChange={(e) => handleChange("count", e.target.value)}
            InputLabelProps={{ sx: { color: "rgba(255,255,255,0.7)" } }}
            InputProps={{
              sx: {
                color: "#fff",
                borderRadius: "12px",
                background: "rgba(255,255,255,0.08)",
              },
            }}
          />

          {config.supportsWine && (
            <FormControlLabel
              control={
                <Switch
                  checked={!!form.with_wine}
                  onChange={(e) =>
                    handleChange("with_wine", e.target.checked)
                  }
                />
              }
              label="Attack with wine"
              sx={{ color: "rgba(255,255,255,0.85)" }}
            />
          )}
        </Box>

        {/* Sections UI */}
        {config.sections.map((section) => (
          <Box key={section.title} sx={{ mb: 3 }}>
            {section.title && (
              <Typography
                sx={{
                  color: "rgba(255,255,255,0.85)",
                  fontWeight: 900,
                  mb: 1.5,
                }}
              >
                {section.title}
              </Typography>
            )}

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "16px",
              }}
            >
              {section.fields.map((field) => (
                <AttackActionCard key={field.key}>
                  <Typography
                    sx={{
                      color: "#fff",
                      fontSize: 18,
                      mb: 1,
                      display: "flex",
                      alignItems: "center",
                      gap: 1.2,
                    }}
                  >
                    <IconThoe2
                      icon={field.icon}
                      sx={{ fontSize: 22, color: field.color }}
                    />
                    {field.label}
                  </Typography>

                  <AttackSelectInput
                    value={form[field.key] ?? ""}
                    onChange={(v) => handleChange(field.key, v)}
                    suggestions={field.suggestions}
                  />
                </AttackActionCard>
              ))}
            </Box>
          </Box>
        ))}

        {/* Submit */}
        <Box sx={{ textAlign: "center", mt: 3 }}>
          <Button
            variant="outlined"
            color="info"
            onClick={handleSubmit}
            startIcon={
              <IconThoe2
                icon="inventory:sword"
                sx={{ fontSize: 20, color: "#00b6cc" }}
              />
            }
            sx={{
              px: 4,
              py: 1,
              borderRadius: "12px",
              fontWeight: 700,
            }}
          >
            Start Attack
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
