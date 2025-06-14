export const isFirefox =
  typeof navigator !== "undefined" && navigator.userAgent.includes("Firefox");
export function getUserLang() {
  return typeof navigator !== "undefined"
    ? navigator.language.split("-")[0]
    : "en";
}
