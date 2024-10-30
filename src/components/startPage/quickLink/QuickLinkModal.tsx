import faviconFetch from "favicon-fetch"
import { AnimatePresence, motion } from "framer-motion"
import React, { useState } from "react"

import { Button } from "~components/Button"
import { db } from "~indexdb/index"
import type { QuickLinkSettings } from "~types"
import isValidUrl from "~utils/valudUrl"

import { Input, Label, LabelInputContainer } from "./Form"
import { QuickLinkPreview } from "./QuickLink"

interface ModalProps {
  quickLinkSettings: QuickLinkSettings
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>
  dialName?: string
  dialUrl?: string
  favicon?: string
  id?: number
}

const QuickLinkModal = (props: ModalProps) => {
  const { setShowModal, dialName, dialUrl, id, favicon, quickLinkSettings } =
    props

  const [name, setName] = useState<string>(dialName ?? "")
  const [url, setUrl] = useState<string>(dialUrl ?? "")

  async function addQuickLink() {
    if (!name || !url) {
      alert("Both Name and URL are required!")

      return
    }

    try {
      let favicon: string | undefined

      if (id && (await db.quickLinks.get(id))) {
        if (isValidUrl(url)) {
          favicon = await faviconFetch({
            uri: url
          })
        }

        await db.quickLinks.update(id, {
          name,
          url,
          favicon
        })
      } else {
        if (isValidUrl(url)) {
          favicon = await faviconFetch({
            uri: url
          })
        }

        await db.quickLinks.add({
          name,
          url,
          favicon
        })
      }

      setShowModal(false)
    } catch {
      return
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        data-testid="QuickLinkModal"
        className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}>
        <motion.div
          className="bg-neutral-950 flex flex-col items-center justify-center gap-3 p-6 rounded-lg"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.3 }}>
          <QuickLinkPreview
            quickLinkSettings={quickLinkSettings}
            pageName={dialName}
            favicon={favicon}
          />
          <LabelInputContainer>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="Name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </LabelInputContainer>
          <LabelInputContainer>
            <Label htmlFor="url">Address</Label>
            <Input
              placeholder="URL"
              id="url"
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </LabelInputContainer>
          <div className="flex gap-3 mt-4">
            <Button
              onClick={addQuickLink}
              borderRadius="1.75rem"
              className="bg-slate-900 text-white border-slate-800 hover:bg-slate-700">
              Save
            </Button>
            <Button
              onClick={() => setShowModal(false)}
              borderRadius="1.75rem"
              borderClassName="bg-[radial-gradient(var(--red-500)_40%,transparent_60%)]"
              className="bg-slate-900 text-white border-slate-800 hover:bg-slate-700">
              Close
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default QuickLinkModal
