import { motion } from "motion/react";
import React, { useState, useCallback } from "react";

import { db } from "@/indexdb";
import type { QuickLinkSettings } from "@/types";
import { getMessage } from "@/utils/getMessage";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { EllipsisIcon, PlusIcon } from "lucide-react";

import { QuickLinkTile } from "./QuickLinkTile";

type QuickLinkProps = {
  pageName: string;
  url: string;
  id: number;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  setEditingLink: React.Dispatch<
    React.SetStateAction<{
      name: string;
      url: string;
      id: number;
    } | null>
  >;
  setQuickLinkOrder: React.Dispatch<React.SetStateAction<number[]>>;
};

type AddQuickLink = {
  quickLinkSettings: QuickLinkSettings;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  setEditingLink: React.Dispatch<
    React.SetStateAction<{ name: string; url: string; id: number } | null>
  >;
};

export function QuickLink(props: QuickLinkProps) {
  const { pageName, url, id, setShowModal, setEditingLink, setQuickLinkOrder } =
    props;
  const [showMenu, setShowMenu] = useState(false);

  const handleEditClick = useCallback(async () => {
    const dialInfo = await db.quickLinks.get(id);

    if (dialInfo) {
      setEditingLink({
        name: dialInfo.name,
        url: dialInfo.url,
        id: dialInfo.id
      });
      setShowMenu(false);
      setShowModal(true);
    }
  }, [id, setEditingLink, setShowModal]);

  const handleDeleteClick = useCallback(async () => {
    await db.quickLinks.delete(id);

    setQuickLinkOrder((prevOrder) => {
      const newOrder = prevOrder.filter((linkId) => linkId !== id);
      localStorage.setItem("quickLinkOrder", JSON.stringify(newOrder));
      return newOrder;
    });
  }, [id, setQuickLinkOrder]);

  return (
    <motion.div
      data-testid="QuickLink"
      layout
      className="group relative z-10 flex flex-col items-center justify-center">
      <a draggable="false" href={url} tabIndex={0} aria-label={pageName}>
        <QuickLinkTile pageName={pageName}>
          <DropdownMenu open={showMenu} onOpenChange={setShowMenu}>
            <DropdownMenuTrigger
              data-testid="QuickLinkSettingsButton"
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
              }}
              className={`bg-dark-bg/70 focus-visible:ring-primary/70 text-primary-text absolute top-2 right-2 z-20 flex h-7 w-7 items-center justify-center rounded-full shadow-sm backdrop-blur-md transition-all duration-200 focus-visible:ring-2 focus-visible:outline-none ${
                showMenu
                  ? "pointer-events-auto scale-100 opacity-100"
                  : "pointer-events-none scale-95 opacity-0 group-hover:pointer-events-auto group-hover:scale-100 group-hover:opacity-100"
              }`}>
              <EllipsisIcon className="size-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              data-testid="QuickLinkMenu"
              align="end"
              sideOffset={8}
              className="bg-dark-bg/95 text-primary-text min-w-40 backdrop-blur-xl">
              <DropdownMenuGroup>
                <DropdownMenuItem
                  data-testid="EditQuickLink"
                  className="text-primary-text focus:bg-surface-900"
                  onClick={() => {
                    void handleEditClick();
                  }}>
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  data-testid="DeleteQuickLink"
                  variant="destructive"
                  onClick={() => {
                    void handleDeleteClick();
                  }}>
                  {getMessage("delete")}
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </QuickLinkTile>
      </a>
      <motion.p
        initial={{ scale: 0.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        data-testid="QuickLinkName"
        className="text-primary-text/95 mt-2 max-w-[75%] truncate text-sm">
        {pageName}
      </motion.p>
    </motion.div>
  );
}

export function AddQuickLinkButton(props: AddQuickLink) {
  const { setShowModal, setEditingLink, quickLinkSettings } = props;

  return (
    <motion.button
      type="button"
      layout
      data-testid="AddQuickLink"
      onClick={() => {
        setShowModal(true);
        setEditingLink({ name: "", url: "", id: 0 });
      }}
      className="group relative flex items-start justify-center">
      <QuickLinkTile big={quickLinkSettings?.bigQuickLinks}>
        <div className="z-10 flex h-full items-center justify-center gap-1">
          <AddButton />
          <p className="inline-block max-w-0 overflow-hidden text-nowrap text-white opacity-0 transition-all duration-500 group-hover:max-w-full group-hover:opacity-100">
            {getMessage("addQuickLink")}
          </p>
        </div>
      </QuickLinkTile>
    </motion.button>
  );
}

function AddButton() {
  return <PlusIcon className="shrink-0 text-white" />;
}

export function QuickLinkPreview({ pageName }: { pageName: string }) {
  return <QuickLinkTile pageName={pageName} big />;
}

export function QuickLinkDragOverlay({ pageName }: { pageName: string }) {
  return (
    <div className="flex flex-col items-center justify-center opacity-95 drop-shadow-2xl">
      <QuickLinkTile pageName={pageName} />
      <p className="text-primary-text/95 mt-2 max-w-[75%] truncate text-sm">
        {pageName}
      </p>
    </div>
  );
}
