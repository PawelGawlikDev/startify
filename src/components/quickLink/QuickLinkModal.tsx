import React, { useState } from "react";
import { LoaderCircleIcon } from "lucide-react";

import { db } from "@/indexdb/index";
import isValidUrl from "@/utils/validUrl";
import { getMessage } from "@/utils/getMessage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel
} from "@/components/ui/field";

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
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(false);

  async function addQuickLink() {
    if (!name.trim() || !url.trim() || isSaving) return;

    setIsSaving(true);
    setSaveError(false);

    try {
      let updatedUrl = url.trim();

      if (!isValidUrl(updatedUrl)) {
        updatedUrl = `https://${updatedUrl}`;
        setUrl(updatedUrl);
      }

      if (id && (await db.quickLinks.get(id))) {
        await db.quickLinks.update(id, { name: name.trim(), url: updatedUrl });
      } else {
        const newId = await db.quickLinks.add({
          name: name.trim(),
          url: updatedUrl
        });

        props.onAddLink?.(newId);
      }

      setShowModal(false);
    } catch {
      setSaveError(true);
    } finally {
      setIsSaving(false);
    }
  }

  const isSaveDisabled = !name.trim() || !url.trim() || isSaving;
  const modalTitle = getMessage(id ? "editQuickLink" : "addQuickLink");
  const modalDescription = id
    ? getMessage("editQuickLinkDescription")
    : getMessage("addQuickLinkDescription");

  return (
    <form
      className="min-w-0"
      onSubmit={(event) => {
        event.preventDefault();
        void addQuickLink();
      }}>
      <DialogHeader className="gap-2 px-6 pt-7 pr-16 pb-5">
        <DialogTitle>{modalTitle}</DialogTitle>
        <DialogDescription>{modalDescription}</DialogDescription>
      </DialogHeader>

      <div aria-hidden="true" className="flex justify-center px-6 pt-1 pb-6">
        <QuickLinkPreview pageName={name.trim() || "Link"} />
      </div>

      <div className="border-border/50 border-t px-6 py-6">
        <FieldGroup className="gap-5">
          <Field>
            <FieldLabel htmlFor="name">{getMessage("name")}</FieldLabel>
            <Input
              id="name"
              type="text"
              value={name}
              placeholder={getMessage("name")}
              autoComplete="off"
              variant="dialog"
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
              autoComplete="url"
              autoCapitalize="none"
              spellCheck={false}
              variant="dialog"
              onChange={(event) => setUrl(event.target.value)}
            />
          </Field>
        </FieldGroup>
        {saveError && (
          <FieldError className="mt-4">
            {getMessage("saveQuickLinkError")}
          </FieldError>
        )}
      </div>
      <div className="border-border/50 flex justify-end gap-2 border-t px-6 py-4">
        <Button
          type="button"
          onClick={() => setShowModal(false)}
          data-testid="CloseButton"
          variant="ghost"
          size="lg"
          className="min-w-20">
          {getMessage("close")}
        </Button>
        <Button
          type="submit"
          data-testid="SaveButton"
          disabled={isSaveDisabled}
          size="lg"
          className="min-w-24">
          {isSaving && (
            <LoaderCircleIcon
              data-icon="inline-start"
              className="animate-spin"
            />
          )}
          {getMessage("save")}
        </Button>
      </div>
    </form>
  );
};

export default QuickLinkModal;
