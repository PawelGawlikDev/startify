import React, { useState } from "react"

import { Storage } from "@plasmohq/storage"
import { useStorage } from "@plasmohq/storage/hook"

import type { Engine } from "~types"

import SearchInput from "./SearchInput"

export default function SeatchBox() {
  const [engine] = useStorage<Engine>("engine")
  const [vanish] = useStorage<boolean>("vanish")
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [query, setQuery] = useState<string>("")
  const placeholders = [
    "Search the web for anything...",
    "Find the latest news or updates...",
    "Looking for a tutorial? Start typing here...",
    "Discover new information about technology...",
    "Type a question or keyword to begin your search..."
  ]

  const storage = new Storage()

  storage.watch({
    engine: () => {
      setSuggestions([])
    }
  })

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value

    setQuery(query)

    if (!query) {
      setSuggestions([])

      return
    }

    try {
      const suggestionsURL = engine?.suggestionsURL.replace(
        "%s",
        encodeURIComponent(query)
      )
      const res = await fetch(suggestionsURL)

      if (!res.ok) {
        return
      }

      const data = await res.json()

      if (
        engine?.name === "Google" ||
        engine?.name === "Bing" ||
        engine?.name === "DuckDuckGo" ||
        engine?.name === "Brave"
      ) {
        setSuggestions(data[1])
      } else {
        setSuggestions(data[1] || data)
      }
    } catch {
      return
    }
  }

  const onSubmit = () => {
    if (!query) return

    const searchUrl = engine?.searchURL.replace("%s", encodeURIComponent(query))

    window.location.href = searchUrl
  }

  return (
    <SearchInput
      placeholders={placeholders}
      onChange={handleChange}
      onSubmit={onSubmit}
      suggestions={suggestions}
      skipAnimation={!vanish}
      engine={engine}
    />
  )
}
