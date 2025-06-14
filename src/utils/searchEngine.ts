import { isFirefox, getUserLang } from "@/constants/browser";
import { Engine } from "@/types";

export enum SearchEngineEnum {
  DuckDuckGo = "DuckDuckGo",
  Google = "Google",
  Bing = "Bing",
  Yahoo = "Yahoo",
  Ecosia = "Ecosia",
  Qwant = "Qwant",
  Yandex = "Yandex",
  Brave = "Brave",
  PrivacyWall = "PrivacyWall",
  Ghostery = "Ghostery"
}

export const searchEngines = {
  [SearchEngineEnum.DuckDuckGo]: {
    name: "DuckDuckGo",
    searchURL: `https://duckduckgo.com/?q=%s&t=${isFirefox ? "firefox" : "chrome"}`,
    queryParam: "q",
    favicon: "https://duckduckgo.com/favicon.ico"
  },
  [SearchEngineEnum.Google]: {
    name: "Google",
    searchURL: "https://www.google.com/search?q=%s",
    queryParam: "q",
    favicon: "https://www.google.com/favicon.ico"
  },
  [SearchEngineEnum.Bing]: {
    name: "Bing",
    searchURL: "https://www.bing.com/search?q=%s",
    queryParam: "q",
    favicon: "https://www.bing.com/favicon.ico"
  },
  [SearchEngineEnum.Yahoo]: {
    name: "Yahoo",
    searchURL: "https://search.yahoo.com/yhs/search?p=%s",
    queryParam: "p",
    favicon: "https://www.yahoo.com/favicon.ico"
  },
  [SearchEngineEnum.Ecosia]: {
    name: "Ecosia",
    searchURL: "https://www.ecosia.org/search?q=%s",
    queryParam: "q",
    favicon: "https://www.ecosia.org/favicon.ico"
  },
  [SearchEngineEnum.Qwant]: {
    name: "Qwant",
    searchURL: "https://www.qwant.com/?q=%s",
    queryParam: "q",
    favicon: "https://www.qwant.com/favicon.ico"
  },
  [SearchEngineEnum.Yandex]: {
    name: "Yandex",
    searchURL: "https://yandex.com/search/?text=%s",
    queryParam: "text",
    favicon: "https://www.yandex.com/favicon.ico"
  },
  [SearchEngineEnum.Brave]: {
    name: "Brave",
    searchURL: "https://search.brave.com/search?q=%s",
    queryParam: "q",
    favicon: "https://brave.com/static-assets/images/brave-favicon.png"
  },
  [SearchEngineEnum.PrivacyWall]: {
    name: "PrivacyWall",
    searchURL: `https://www.privacywall.org/search/secure?q=%s&cc=${getUserLang()}`,
    queryParam: "q",
    favicon: "https://external.privacywall.org/images/favicon_hi.ico"
  },
  [SearchEngineEnum.Ghostery]: {
    name: "Ghostery",
    searchURL: `https://ghosterysearch.com/search?q=%s`,
    queryParam: "q",
    favicon: "https://ghosterysearch.com/favicon.ico"
  }
};

export function getSuggestUrl(
  engine: SearchEngineEnum,
  query: string
): string | undefined {
  const encoded = encodeURIComponent(query);

  switch (engine) {
    case SearchEngineEnum.Google:
      return `https://www.google.com/complete/search?q=${encoded}&hl=${getUserLang()}&client=gws-wiz`;
    case SearchEngineEnum.Bing:
      return `https://www.bing.com/AS/Suggestions?qry=${encoded}&mkt=${getUserLang()}&cp=5&csr=1&msbqf=false&cvid=7AE3B40123C74FFF87EF8A5ED4FAF455`;
    case SearchEngineEnum.DuckDuckGo:
      return `https://duckduckgo.com/ac/?q=${encoded}&kl=${getUserLang()}`;
    case SearchEngineEnum.Brave:
      return `https://search.brave.com/api/suggest?q=${encoded}&rich=true`;
    case SearchEngineEnum.Yahoo:
      return `https://search.yahoo.com/sugg/gossip/gossip-us-fastbreak/?command=${encoded}&output=sd1`;
    case SearchEngineEnum.Qwant:
      return `https://api.qwant.com/v3/suggest?q=${encoded}&locale=${getUserLang()}`;
    case SearchEngineEnum.Ecosia:
      return `https://ac.ecosia.org/autocomplete?q=${encoded}&type=list`;
    case SearchEngineEnum.PrivacyWall:
      return `https://www.privacywall.org/search/secure/suggestions.php?q=%s&cc=${getUserLang()}`;
    case SearchEngineEnum.Yandex:
      return `https://suggest.yandex.com/suggest-ff.cgi?part=${encoded}`;
    case SearchEngineEnum.Ghostery:
      return `https://ghosterysearch.com/suggest?q=${encoded}`;
  }
}

export function getEngineEnumKey(engine: Engine): SearchEngineEnum {
  return Object.entries(searchEngines).find(
    ([, value]) => value.name === engine.name
  )?.[0] as SearchEngineEnum;
}
