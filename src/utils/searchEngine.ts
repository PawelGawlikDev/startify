import { isFirefox, userLang } from "@/constants/browser";

export enum SearchEngineEnum {
  DuckDuckGo = "DuckDuckGo",
  Google = "Google",
  Bing = "Bing",
  Yahoo = "Yahoo",
  Ecosia = "Ecosia",
  Qwant = "Qwant",
  Yandex = "Yandex",
  Brave = "Brave",
  PrivacyWall = "PrivacyWall "
}

export const searchEngines = {
  [SearchEngineEnum.DuckDuckGo]: {
    name: "DuckDuck",
    searchURL: `https://duckduckgo.com/?q=%s&t=${isFirefox ? "firefox" : "chrome"}`,
    suggestionsURL: `https://ac.duckduckgo.com/ac/?q=%s&type=list&t=${isFirefox ? "firefox" : "chrome"}`,
    queryParam: "q",
    favicon: "https://duckduckgo.com/favicon.ico"
  },
  [SearchEngineEnum.Google]: {
    name: "Google",
    searchURL: "https://www.google.com/search?q=%s",
    suggestionsURL: `https://suggestqueries.google.com/complete/search?client=${isFirefox ? "firefox" : "chrome"}&q=%s&hl=${userLang}`,
    queryParam: "q",
    favicon: "https://www.google.com/favicon.ico"
  },
  [SearchEngineEnum.Bing]: {
    name: "Bing",
    searchURL: "https://www.bing.com/search?q=%s",
    suggestionsURL: "https://www.bing.com/osjson.aspx?query=%s",
    queryParam: "q",
    favicon: "https://www.bing.com/favicon.ico"
  },
  [SearchEngineEnum.Yahoo]: {
    name: "Yahoo",
    searchURL: "https://search.yahoo.com/yhs/search?p=%s",
    suggestionsURL: "https://search.yahoo.com/sugg/os?command=%s&output=fxjson",
    queryParam: "p",
    favicon: "https://www.yahoo.com/favicon.ico"
  },
  [SearchEngineEnum.Ecosia]: {
    name: "Ecosia",
    searchURL: "https://www.ecosia.org/search?q=%s",
    suggestionsURL: "https://ac.ecosia.org/autocomplete?q=%s&type=list",
    queryParam: "q",
    favicon: "https://www.ecosia.org/favicon.ico"
  },
  [SearchEngineEnum.Qwant]: {
    name: "Qwant",
    searchURL: "https://www.qwant.com/?q=%s",
    suggestionsURL: "https://api.qwant.com/api/suggest/?q=%s&client=opensearch",
    queryParam: "q",
    favicon: "https://www.qwant.com/favicon.ico"
  },
  [SearchEngineEnum.Yandex]: {
    name: "Yandex",
    searchURL: "https://yandex.com/search/?text=%s",
    suggestionsURL: "https://suggest.yandex.com/suggest-ff.cgi?part=%s",
    queryParam: "text",
    favicon: "https://www.yandex.com/favicon.ico"
  },
  [SearchEngineEnum.Brave]: {
    name: "Brave",
    searchURL: "https://search.brave.com/search?q=%s",
    suggestionsURL: "https://search.brave.com/api/suggest?q=%s",
    queryParam: "q",
    favicon: "https://brave.com/static-assets/images/brave-favicon.png"
  },
  [SearchEngineEnum.PrivacyWall]: {
    name: "PrivacyWall",
    searchURL: `https://www.privacywall.org/search/secure?q=%s&cc=${userLang}`,
    suggestionsURL: `https://www.privacywall.org/search/secure/suggestions.php?q=%s&cc=${userLang}`,
    queryParam: "q",
    favicon: "https://external.privacywall.org/images/favicon_hi.ico"
  }
};
