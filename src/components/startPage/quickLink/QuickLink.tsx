import { motion } from "motion/react";
import React, { useEffect, useRef, useState } from "react";

import { db } from "@/indexdb";
import type { QuickLinkSettings } from "@/types";

import "./quickLink.css";

import { cn } from "@/utils/cn";

import QuickLinkBackground from "./QuickLinkBackground";

type QuickLinkProps = {
  pageName: string;
  url: string;
  id: number;
  quickLinkSettings: QuickLinkSettings;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  setEditingLink: React.Dispatch<
    React.SetStateAction<{
      name: string;
      url: string;
      id: number;
    }>
  >;
};

type AddQuickLink = {
  quickLinkSettings: QuickLinkSettings;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  setEditingLink: React.Dispatch<
    React.SetStateAction<{ name: string; url: string }>
  >;
};

export function QuickLink(props: QuickLinkProps) {
  const { pageName, url, id, quickLinkSettings, setShowModal, setEditingLink } =
    props;
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event: { target: EventTarget }) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleEditClick = async () => {
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
  };

  const handleDeleteClick = async () => {
    await db.quickLinks.delete(id);
  };

  return (
    <motion.div
      data-testid="QuickLink"
      layout
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="group relative z-10 flex flex-col items-center justify-center"
      draggable="true">
      <a draggable="false" href={url}>
        <QuickLinkBackground
          type={quickLinkSettings?.type}
          className={cn(
            "flex items-center justify-center",
            quickLinkSettings?.bigQuickLinks
              ? "h-28 w-[166px]"
              : "h-[88px] w-[144px]"
          )}>
          <div className="triangle gradient-background absolute right-[-4px] top-[-4px] h-4 w-4 rotate-[270deg] opacity-0 transition-opacity group-hover:opacity-100" />
          <div className="triangle gradient-background absolute left-[-4px] top-[-4px] h-4 w-4 rotate-180 opacity-0 transition-opacity group-hover:opacity-100" />
          <div
            data-testid="QuickLinkSettingsButton"
            ref={menuRef}
            className={`absolute top-1 h-5 w-5 ${showMenu ? "opacity-100" : "opacity-0"} right-2 rounded-full p-1 transition-all hover:bg-neutral-800/75 group-hover:opacity-100`}
            onClick={(e) => {
              e.preventDefault();
              setShowMenu(!showMenu);
            }}>
            <EditDots />
            {showMenu && (
              <div
                data-testid="QuickLinkMenu"
                className="absolute z-[1] flex flex-col items-center rounded-xl bg-neutral-950 text-white">
                <span
                  data-testid="EditQuickLink"
                  className="flex w-full items-center justify-center rounded-t-xl p-3 hover:bg-neutral-600"
                  onClick={handleEditClick}>
                  Edit
                </span>
                <span
                  data-testid="DeleteQuickLink"
                  className="flex w-full items-center justify-center rounded-b-xl p-3 hover:bg-neutral-600"
                  onClick={handleDeleteClick}>
                  {chrome.i18n.getMessage("delete")}
                </span>
              </div>
            )}
          </div>
          <QuickLinkTitle pageName={pageName} />
          <div className="triangle gradient-background absolute bottom-[-4px] right-[-4px] h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
          <div className="triangle gradient-background absolute bottom-[-4px] left-[-4px] h-4 w-4 rotate-90 opacity-0 transition-opacity group-hover:opacity-100" />
        </QuickLinkBackground>
      </a>
      <motion.p
        initial={{ scale: 0.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        data-testid="QuickLinkName"
        className="max-w-[60%] truncate text-white">
        {pageName}
      </motion.p>
    </motion.div>
  );
}

export function AddQuickLinkButton(props: AddQuickLink) {
  const { setShowModal, setEditingLink, quickLinkSettings } = props;

  return (
    <button
      data-testid="AddQuickLink"
      onClick={() => {
        setShowModal(true);
        setEditingLink({ name: "", url: "" });
      }}
      className="group relative flex items-start justify-center">
      <QuickLinkBackground
        type={quickLinkSettings?.type}
        className={
          quickLinkSettings?.bigQuickLinks
            ? "h-28 w-[166px]"
            : "h-[88px] w-[144px]"
        }
        draggable={false}>
        <div className="z-10 flex h-full items-center justify-center gap-1">
          <AddButton />
          <p className="inline-block max-w-0 overflow-hidden text-nowrap text-white opacity-0 transition-all duration-500 group-hover:max-w-full group-hover:opacity-100">
            {chrome.i18n.getMessage("addQuickLinkText")}
          </p>
        </div>
      </QuickLinkBackground>
    </button>
  );
}

function AddButton() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0"
      width="30"
      height="30"
      viewBox="0 0 24 24"
      fill="none">
      <path
        d="M3.75 12H20.25"
        stroke="#ffffff"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 3.75V20.25"
        stroke="#ffffff"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function EditDots() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 13 13">
      <g fill="white">
        <circle cx="1.5" cy="6.5" r="1.5" />
        <circle cx="6.5" cy="6.5" r="1.5" />
        <circle cx="11.5" cy="6.5" r="1.5" />
      </g>
    </svg>
  );
}

export function QuickLinkPreview({
  quickLinkSettings,
  pageName
}: {
  quickLinkSettings: QuickLinkSettings;
  pageName: string;
}) {
  return (
    <QuickLinkBackground
      type={quickLinkSettings?.type}
      className="flex h-28 w-[166px] items-center justify-center">
      <QuickLinkTitle pageName={pageName} />
    </QuickLinkBackground>
  );
}

const QuickLinkTitle = ({ pageName }: { pageName: string }) => {
  return (
    <div className="flex h-[48px] w-full max-w-full items-center justify-center rounded p-2">
      <span className="truncate text-xl font-bold text-white">
        {pageName.toUpperCase()}
      </span>
    </div>
  );
};
