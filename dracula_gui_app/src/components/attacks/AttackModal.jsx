import { useEffect, useState } from "react";
import {
  Box,
  Modal,
  Typography,
  Button,
  Switch,
  FormControlLabel,
  TextField,
  MenuItem,
  IconButton,
} from "@mui/material";

import AttackActionCard from "./AttackActionCard";
import AttackSelectInput from "./AttackSelectInput";
import attackFields from "./attackFields";
import IconThoe2 from "@/components/custom-icons";
import CloseButton from "../styled-components/button/CloseButton";

const PRESET_STORAGE_PREFIX = "dracula_attack_preset_v1";

function getPresetKey(type) {
  return `${PRESET_STORAGE_PREFIX}:${window.location.hostname}:${type}`;
}

const PRESET_ICONS = [
  { value: "inventory:sword", label: "Sword" },
  { value: "ui:parliament", label: "Parliament" },
  { value: "ui:government", label: "Government" },
  { value: "ui:court_house", label: "Institution" },
  { value: "bonus:gremlins", label: "Gremlins" },
  { value: "bonus:priests", label: "Priests" },
  { value: "ui:characters", label: "Players" },
];

function readPresets(type) {
  try {
    const stored = JSON.parse(localStorage.getItem(getPresetKey(type)));
    if (Array.isArray(stored)) return stored;

    // Migrate the original single-slot Save/Load format automatically.
    if (stored?.values) {
      return [{
        id: "legacy-preset",
        name: "Saved setup",
        icon: "inventory:sword",
        values: stored.values,
        savedAt: stored.savedAt,
      }];
    }

    return [];
  } catch {
    return [];
  }
}

export default function AttackModal({ type, open, onClose, onSubmit }) {
  const config = attackFields[type];

  const [form, setForm] = useState(config?.getInitialValues() ?? {});
  const [presets, setPresets] = useState(() => readPresets(type));
  const [presetMessage, setPresetMessage] = useState("");
  const [showPresetEditor, setShowPresetEditor] = useState(false);
  const [presetName, setPresetName] = useState("");
  const [presetIcon, setPresetIcon] = useState(PRESET_ICONS[0].value);

  useEffect(() => {
    if (open && config) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setForm(config.getInitialValues());
      setPresets(readPresets(type));
      setPresetMessage("");
      setShowPresetEditor(false);
    }
  }, [open, config, type]);

  if (!config) return null;

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    const { payload } = config.buildCommand(form);
    if (onSubmit) onSubmit(payload);
    if (onClose) onClose();
  };

  const persistPresets = (nextPresets) => {
    localStorage.setItem(getPresetKey(type), JSON.stringify(nextPresets));
    setPresets(nextPresets);
  };

  const handleOpenPresetEditor = () => {
    setPresetName(`Setup ${presets.length + 1}`);
    setPresetIcon(PRESET_ICONS[0].value);
    setShowPresetEditor(true);
    setPresetMessage("");
  };

  const handleSavePreset = () => {
    const name = presetName.trim();
    if (!name) {
      setPresetMessage("Please enter a preset name.");
      return;
    }

    const preset = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name,
      icon: presetIcon,
      values: { ...form },
      savedAt: new Date().toISOString(),
    };

    try {
      persistPresets([...presets, preset]);
      setShowPresetEditor(false);
      setPresetMessage(`Preset "${name}" saved.`);
    } catch {
      setPresetMessage("Could not access browser storage.");
    }
  };

  const handleLoadPreset = (preset) => {
    const defaults = config.getInitialValues() ?? {};
    const values = Object.fromEntries(
      Object.keys(defaults).map((key) => [key, preset.values[key] ?? defaults[key]]),
    );
    setForm(values);
    setPresetMessage(`Preset "${preset.name}" loaded.`);
  };

  const handleDeletePreset = (event, presetId) => {
    event.stopPropagation();
    try {
      persistPresets(presets.filter((preset) => preset.id !== presetId));
      setPresetMessage("Preset deleted.");
    } catch {
      setPresetMessage("Could not update browser storage.");
    }
  };

  const handleRestoreDefaults = () => {
    setForm(config.getInitialValues() ?? {});
    setPresetMessage("Default values restored.");
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
          width: 850,
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

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "minmax(0, 1fr) 260px" },
            gap: 2.5,
            alignItems: "start",
          }}
        >
        <Box>
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

        <Box
          sx={{
            p: 2,
            borderRadius: "16px",
            background: "rgba(255,255,255,0.055)",
            border: "1px solid rgba(255,255,255,0.14)",
            boxShadow: "inset 0 0 18px rgba(255,255,255,0.04)",
          }}
        >
          <Typography sx={{ color: "#e5c07b", fontWeight: 800, fontSize: 16, mb: 0.75 }}>
            Attack presets
          </Typography>
          <Typography sx={{ color: "rgba(255,255,255,0.65)", fontSize: 12, mb: 2 }}>
            Save several setups and click a card to load its values.
          </Typography>

          {showPresetEditor ? (
            <Box
              sx={{
                display: "grid",
                gap: 1.25,
                mb: 2,
                p: 1.5,
                borderRadius: "12px",
                border: "1px solid rgba(0,182,204,0.55)",
                background: "rgba(0,182,204,0.07)",
              }}
            >
              <TextField
                size="small"
                label="Preset name"
                value={presetName}
                onChange={(event) => setPresetName(event.target.value)}
                inputProps={{ maxLength: 32 }}
                InputLabelProps={{ sx: { color: "rgba(255,255,255,0.65)" } }}
                InputProps={{ sx: { color: "#fff" } }}
              />
              <TextField
                select
                size="small"
                label="Icon"
                value={presetIcon}
                onChange={(event) => setPresetIcon(event.target.value)}
                InputLabelProps={{ sx: { color: "rgba(255,255,255,0.65)" } }}
                InputProps={{ sx: { color: "#fff" } }}
              >
                {PRESET_ICONS.map((icon) => (
                  <MenuItem key={icon.value} value={icon.value}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <IconThoe2 icon={icon.value} sx={{ fontSize: 20 }} />
                      {icon.label}
                    </Box>
                  </MenuItem>
                ))}
              </TextField>
              <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1 }}>
                <Button size="small" variant="contained" onClick={handleSavePreset}>
                  Save
                </Button>
                <Button size="small" onClick={() => setShowPresetEditor(false)}>
                  Cancel
                </Button>
              </Box>
            </Box>
          ) : (
            <Button
              fullWidth
              variant="outlined"
              color="info"
              onClick={handleOpenPresetEditor}
              sx={{ mb: 1.5, borderRadius: "10px", fontWeight: 700 }}
            >
              + Save as preset
            </Button>
          )}

          <Box sx={{ display: "grid", gap: 1, maxHeight: 260, overflowY: "auto", pr: 0.5 }}>
            {presets.length === 0 && (
              <Typography sx={{ py: 2, color: "rgba(255,255,255,0.45)", fontSize: 12, textAlign: "center" }}>
                No presets saved yet.
              </Typography>
            )}
            {presets.map((preset) => (
              <Box
                key={preset.id}
                role="button"
                tabIndex={0}
                onClick={() => handleLoadPreset(preset)}
                onKeyDown={(event) => event.key === "Enter" && handleLoadPreset(preset)}
                sx={{
                  display: "grid",
                  gridTemplateColumns: "36px minmax(0, 1fr) 28px",
                  alignItems: "center",
                  gap: 1,
                  p: 1,
                  borderRadius: "11px",
                  cursor: "pointer",
                  color: "#fff",
                  background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  transition: "all 0.18s ease",
                  "&:hover": {
                    background: "rgba(0,182,204,0.15)",
                    borderColor: "rgba(0,182,204,0.7)",
                    transform: "translateY(-1px)",
                  },
                }}
              >
                <Box sx={{ display: "grid", placeItems: "center", width: 36, height: 36, borderRadius: "9px", background: "rgba(229,192,123,0.12)" }}>
                  <IconThoe2 icon={preset.icon || PRESET_ICONS[0].value} sx={{ color: "#e5c07b", fontSize: 23 }} />
                </Box>
                <Box sx={{ minWidth: 0 }}>
                  <Typography sx={{ fontWeight: 750, fontSize: 13, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {preset.name}
                  </Typography>
                  <Typography sx={{ color: "rgba(255,255,255,0.48)", fontSize: 10 }}>
                    {Object.keys(preset.values || {}).length} saved values
                  </Typography>
                </Box>
                <IconButton
                  size="small"
                  title="Delete preset"
                  onClick={(event) => handleDeletePreset(event, preset.id)}
                  sx={{ color: "rgba(255,255,255,0.5)", "&:hover": { color: "#ff6b6b" } }}
                >
                  ×
                </IconButton>
              </Box>
            ))}
          </Box>

          <Box sx={{ display: "grid", gap: 1, mt: 1.5 }}>
            <Button
              variant="text"
              onClick={handleRestoreDefaults}
              sx={{ color: "rgba(255,255,255,0.72)", borderRadius: "10px" }}
            >
              Restore defaults
            </Button>
          </Box>
          {presetMessage && (
            <Typography sx={{ mt: 1.5, color: "#72d7e8", fontSize: 12, lineHeight: 1.35 }}>
              {presetMessage}
            </Typography>
          )}
        </Box>
        </Box>
      </Box>
    </Modal>
  );
}
