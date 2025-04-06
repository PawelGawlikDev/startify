import { motion } from "motion/react";
import React, { useState } from "react";

import { Button } from "@/components/Button";
import { db } from "@/indexdb/index";
import type { QuickLinkSettings } from "@/types";
import { cn } from "@/utils/cn";
import isValidUrl from "@/utils/valudUrl";

import { Input, Label, LabelInputContainer } from "./Form";
import { QuickLinkPreview } from "./QuickLink";

type ModalProps = {
  quickLinkSettings: QuickLinkSettings;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  dialName?: string;
  dialUrl?: string;
  id?: number;
};

const QuickLinkModal = (props: ModalProps) => {
  const { setShowModal, dialName, dialUrl, id, quickLinkSettings } = props;

  const [name, setName] = useState<string>(dialName ?? "");
  const [url, setUrl] = useState<string>(dialUrl ?? "");

  async function addQuickLink() {
    if (!name || !url) {
      alert("Both Name and URL are required!");

      return;
    }

    try {
      let updatedUrl = url;

      if (!isValidUrl(url)) {
        updatedUrl = `https://${url}`;
        setUrl(updatedUrl);
      }

      if (id && (await db.quickLinks.get(id))) {
        await db.quickLinks.update(id, { name, url: updatedUrl });
      } else {
        await db.quickLinks.add({ name, url: updatedUrl });
      }

      setShowModal(false);
    } catch {
      return;
    }
  }

  return (
    <motion.div
      className="flex flex-col items-center justify-center gap-3 rounded-lg bg-neutral-950 p-6"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      transition={{ duration: 0.3 }}>
      <QuickLinkPreview
        quickLinkSettings={quickLinkSettings}
        pageName={dialName}
      />
      <LabelInputContainer>
        <Label htmlFor="name">{chrome.i18n.getMessage("name") ?? "Name"}</Label>
        <Input
          id="name"
          placeholder={chrome.i18n.getMessage("name") ?? "Name"}
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </LabelInputContainer>
      <LabelInputContainer>
        <Label htmlFor="url">
          {chrome.i18n.getMessage("address") ?? "Address"}
        </Label>
        <Input
          placeholder={chrome.i18n.getMessage("address") ?? "Address"}
          id="url"
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
      </LabelInputContainer>
      <div className="mt-4 flex gap-3">
        <Button
          onClick={addQuickLink}
          data-testid={"SaveButton"}
          borderRadius="1.75rem"
          disabled={name === "" || url === ""}
          className={cn(
            "border-slate-800 text-white",
            name === "" || url === ""
              ? "cursor-not-allowed bg-gray-700"
              : "bg-slate-900 hover:bg-slate-700"
          )}>
          {chrome.i18n.getMessage("save") ?? "Save"}
        </Button>
        <Button
          onClick={() => setShowModal(false)}
          borderRadius="1.75rem"
          borderClassName="bg-[radial-gradient(var(--red-500)_40%,transparent_60%)]"
          className="border-slate-800 bg-slate-900 text-white hover:bg-slate-700">
          {chrome.i18n.getMessage("close") ?? "Colse"}
        </Button>
      </div>
    </motion.div>
  );
};

export default QuickLinkModal;
