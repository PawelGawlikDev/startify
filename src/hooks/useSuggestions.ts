/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback } from "react";
import { SearchEngineEnum } from "@/utils/searchEngine";
import { Suggestion } from "@/types";
import { getSuggestUrl } from "@/utils/searchEngine";

const headers = {
  "Accept-Language": "en-US,en;q=0.9"
};

export function useSuggestions() {
  const fetchSuggestions = useCallback(
    async (query: string, engine: SearchEngineEnum): Promise<Suggestion[]> => {
      if (!query) return [];

      const url = getSuggestUrl(engine, query);
      if (!url) return [];

      try {
        const res = await fetch(url, { headers });
        if (!res.ok) return [];

        if (engine === SearchEngineEnum.Google) {
          const text = await res.text();
          return parseGoogle(text);
        }

        const json = await res.json();

        switch (engine) {
          case SearchEngineEnum.Bing:
            return parseBing(json);
          case SearchEngineEnum.DuckDuckGo:
            return json.map((item: any) => ({ text: item.phrase }));
          case SearchEngineEnum.Brave:
            return json[1].map((item: any) => ({
              text: item.q,
              desc: item.desc,
              image: item.img
            }));
          case SearchEngineEnum.Yahoo:
            return json.r.map((item: any) => ({
              text: item.k,
              image: item.fd?.imageUrl
            }));
          case SearchEngineEnum.Qwant:
            return json.data.items.map((item: any) => ({ text: item.value }));
          default:
            return json[1]?.map((t: string) => ({ text: t })) || [];
        }
      } catch {
        return [];
      }
    },
    []
  );

  return fetchSuggestions;
}

function parseGoogle(raw: string): Suggestion[] {
  try {
    const clean = raw.replace("window.google.ac.h(", "").slice(0, -1);
    const json = JSON.parse(clean);
    return json[0].map((item: any) => {
      const wordDefinition = item[3]?.ansa?.l?.[1]?.il?.t?.[0]?.t;
      const text = item[0]
        .replaceAll("<b>", "")
        .replaceAll("</b>", "")
        .replaceAll("&#39;", "'");
      const desc = (wordDefinition ?? item[3]?.zi ?? "").replaceAll(
        "&#39;",
        "'"
      );
      const image = item[3]?.zs;
      return { text, desc, image };
    });
  } catch {
    return [];
  }
}

function parseBing(json: any): Suggestion[] {
  return (
    json?.s?.map((item: any) => ({
      text: item.q.replace("\ue000", "").replace("\ue001", ""),
      desc: item.ext?.des,
      image: item.ext?.im ? "https://th.bing.com" + item.ext.im : undefined
    })) || []
  );
}
