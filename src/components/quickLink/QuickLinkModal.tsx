import React, { useState } from "react";

import { db } from "@/indexdb/index";
import isValidUrl from "@/utils/validUrl";
import { getMessage } from "@/utils/getMessage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";

import { QuickLinkPreview } from "./QuickLink";

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
    if (!name || !url) return;

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

        props.onAddLink?.(newId);
      }

      setShowModal(false);
    } catch {
      return;
    }
  }

  const isSaveDisabled = name === "" || url === "";
  const modalTitle = id ? "Edit quick link" : getMessage("addQuickLink");
  const modalDescription = id
    ? "Update the name and address for this tile."
    : "Create a new shortcut for your dashboard.";

  return (
    <Card className="bg-dark-bg/96 text-primary-text gap-4 rounded-2xl py-0 shadow-2xl ring-white/10 backdrop-blur-xl">
      <CardHeader className="gap-4 border-b border-white/8 pb-4">
        <div className="space-y-1 text-center sm:text-left">
          <CardTitle className="text-xl font-semibold tracking-[0.01em]">
            {modalTitle}
          </CardTitle>
          <CardDescription className="text-primary-text/65">
            {modalDescription}
          </CardDescription>
        </div>
        <div className="flex justify-center pt-1">
          <QuickLinkPreview pageName={name || "Link"} />
        </div>
      </CardHeader>
      <CardContent>
        <FieldGroup className="gap-4">
          <Field>
            <FieldLabel htmlFor="name">{getMessage("name")}</FieldLabel>
            <Input
              id="name"
              type="text"
              value={name}
              placeholder={getMessage("name")}
              className="bg-surface-900/95 text-primary-text placeholder:text-primary-text/40"
              onChange={(event) => setName(event.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="url">{getMessage("address")}</FieldLabel>
            <Input
              id="url"
              type="text"
              value={url}
              placeholder={getMessage("address")}
              className="bg-surface-900/95 text-primary-text placeholder:text-primary-text/40"
              onChange={(event) => setUrl(event.target.value)}
            />
          </Field>
        </FieldGroup>
      </CardContent>
      <CardFooter className="justify-end gap-3 border-white/8 bg-black/10">
        <Button
          onClick={() => setShowModal(false)}
          data-testid="CloseButton"
          variant="outline"
          className="border-border bg-surface-900 text-primary-text hover:bg-surface">
          {getMessage("close")}
        </Button>
        <Button
          onClick={addQuickLink}
          data-testid="SaveButton"
          disabled={isSaveDisabled}
          className="bg-primary text-primary-foreground hover:bg-primary/90">
          {getMessage("save")}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default QuickLinkModal;
