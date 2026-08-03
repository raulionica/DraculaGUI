export const LICENSE_STORAGE_KEY = "dracula_license_key";

export function getSavedLicenseKey() {
    try {
        return (localStorage.getItem(LICENSE_STORAGE_KEY) || "").trim();
    } catch {
        return "";
    }
}

export function requireLicenseKey() {
    const saved = getSavedLicenseKey();
    if (saved) return saved;

    const entered = window.prompt("Introdu license key pentru DraculaGUI:");
    const licenseKey = (entered || "").trim();

    if (!licenseKey) {
        window.alert("License key lipsa. Atacul nu a fost pornit.");
        return null;
    }

    localStorage.setItem(LICENSE_STORAGE_KEY, licenseKey);
    return licenseKey;
}
