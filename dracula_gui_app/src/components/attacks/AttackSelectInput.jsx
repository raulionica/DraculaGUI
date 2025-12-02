import { Autocomplete, TextField } from "@mui/material";

export default function AttackSelectInput({ value, onChange, suggestions }) {
  return (
    <Autocomplete
      fullWidth
      freeSolo
      disableClearable={false}

      ListboxProps={{
        sx: {
          padding: "6px",
          boxSizing: "border-box",
        },
      }}

      slotProps={{
        popper: {
          disablePortal: false,
          sx: { zIndex: 99999 },
        },

        paper: {
          sx: {
            backgroundColor: "rgba(255,255,255,0.06)",
            backdropFilter: "blur(14px)",
            borderRadius: "14px",
            border: "1px solid rgba(255,255,255,0.12)",
            color: "white",
            boxSizing: "border-box",
            boxShadow: "0 8px 25px rgba(0,0,0,0.45)",
          },
        },

        option: {
          sx: {
            padding: "10px 14px",
            borderRadius: "10px",
            transition: "background-color 0.15s ease",
            "&:hover": {
              backgroundColor: "rgba(255,255,255,0.10)",
            },
          },
        },
      }}

      options={(suggestions || []).map((s) =>
        typeof s === "string" ? s : s.label || s.value || ""
      )}

      inputValue={value || ""}

      onInputChange={(_, inputValue) => {
        const cleaned = inputValue.replace(/[^0-9.]/g, "");
        onChange(cleaned);
      }}

      renderInput={(params) => (
        <TextField
          {...params}
          size="small"
          sx={{
            width: "100%",
            "& .MuiAutocomplete-inputRoot": {
              boxSizing: "border-box !important",
            },

            "& .MuiOutlinedInput-root": {
              borderRadius: "14px",
              backgroundColor: "rgba(255,255,255,0.06)",
              backdropFilter: "blur(8px)",
              transition: "none !important",   // ← FIX SHIFTING

              "& fieldset": {
                borderColor: "rgba(255,255,255,0.12)",
                transition: "none !important", // ← FIX BORDER JUMP
              },

              "&:hover fieldset": {
                borderColor: "rgba(255,255,255,0.20)",
              },

              "&.Mui-focused fieldset": {
                borderColor: "rgba(0, 200, 255, 0.55)",
                boxShadow: "0 0 6px rgba(0, 200, 255, 0.25)",
              },
            },

            "& input": {
              color: "white",
              boxSizing: "border-box !important",
            },
          }}
        />
      )}
    />
  );
}
