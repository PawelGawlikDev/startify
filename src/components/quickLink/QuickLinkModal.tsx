import { motion } from "motion/react";
import React, { useState } from "react";

import { db } from "@/indexdb/index";
import { cn } from "@/utils/cn";
import isValidUrl from "@/utils/validUrl";

import { Input, Label, LabelInputContainer } from "./Form";
import { QuickLinkPreview } from "./QuickLink";
import { Button } from "../Button";

type ModalProps = {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  dialName?: string;
  dialUrl?: string;
  id?: number;
  onAddLink?: (newId: number) => void;
};

const QuickLinkModal = (props: ModalProps) => {
  const { setShowModal, dialName, dialUrl, id } = props;

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
        const newId = await db.quickLinks.add({ name, url: updatedUrl });

        if (props.onAddLink) {
          props.onAddLink(newId);
        }
      }

      setShowModal(false);
    } catch {
      return;
    }
  }

  return (
    <motion.div
      className="bg-dark-bg flex flex-col items-center justify-center gap-3 rounded-lg p-6"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      transition={{ duration: 0.3 }}>
      <QuickLinkPreview pageName={dialName ?? ""} />
      <LabelInputContainer>
        <Label htmlFor="name">{browser.i18n.getMessage("name")}</Label>
        <Input
          id="name"
          placeholder={browser.i18n.getMessage("name")}
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </LabelInputContainer>
      <LabelInputContainer>
        <Label htmlFor="url">{browser.i18n.getMessage("address")}</Label>
        <Input
          placeholder={browser.i18n.getMessage("address")}
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
            "border-surface transition-colors",
            name === "" || url === ""
              ? "bg-surface-100 text-secondary-text cursor-not-allowed"
              : "hover:bg-surface bg-surface-900 text-primary-text"
          )}>
          {browser.i18n.getMessage("save")}
        </Button>
        <Button
          onClick={() => setShowModal(false)}
          borderRadius="1.75rem"
          borderClassName="bg-[radial-gradient(#ff5555_40%,transparent_60%)]"
          className="text-primary-text hover:bg-surface bg-surface-900 border-surface">
          {browser.i18n.getMessage("close")}
        </Button>
      </div>
    </motion.div>
  );
};

export default QuickLinkModal;
