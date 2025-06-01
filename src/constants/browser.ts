export const isFirefox =
  typeof navigator !== "undefined" && navigator.userAgent.includes("Firefox");
export const userLang =
  typeof navigator !== "undefined" ? navigator.language.split("-")[0] : "en";
