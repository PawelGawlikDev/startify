import { motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";

import { db } from "~indexdb";
import type { QuickLinkSettings } from "~types";

import "./quickLink.css";

import { cn } from "~utils/cn";

import QuickLinkBackground from "./QuickLinkBackground";

interface QuickLinkProps {
  pageName: string;
  url: string;
  favicon?: string;
  id: number;
  quickLinkSettings: QuickLinkSettings;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  setEditingLink: React.Dispatch<
    React.SetStateAction<{
      name: string;
      url: string;
      id: number;
      favicon: string;
    }>
  >;
}

interface AddQuickLink {
  quickLinkSettings: QuickLinkSettings;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  setEditingLink: React.Dispatch<
    React.SetStateAction<{ name: string; url: string }>
  >;
}

export function QuickLink(props: QuickLinkProps) {
  const {
    pageName,
    url,
    favicon,
    id,
    quickLinkSettings,
    setShowModal,
    setEditingLink
  } = props;
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
        favicon: dialInfo?.favicon,
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
      className="relative group z-10 flex flex-col justify-center items-center"
      draggable="true">
      <a draggable="false" href={url}>
        <QuickLinkBackground
          type={quickLinkSettings?.type}
          className={cn(
            "w-[144px] h-[88px] flex items-center justify-center",
            quickLinkSettings?.bigQuickLinks
              ? "w-[166px] h-28"
              : "w-[144px] h-[88px]"
          )}>
          <div className="triangle gradient-background transition-opacity opacity-0 group-hover:opacity-100 w-4 h-4 absolute right-[-4px] top-[-4px] rotate-[270deg]" />
          <div className="triangle gradient-background transition-opacity opacity-0 group-hover:opacity-100 w-4 h-4 absolute left-[-4px] top-[-4px] rotate-180" />
          <div
            data-testid="QuickLinkSettingsButton"
            ref={menuRef}
            className={`absolute w-5 h-5 top-1 ${showMenu ? "opacity-100" : "opacity-0"} group-hover:opacity-100 hover:bg-neutral-800/75 rounded-full p-1 right-2 transition-all`}
            onClick={(e) => {
              e.preventDefault();
              setShowMenu(!showMenu);
            }}>
            <EditDots />
            {showMenu && (
              <div
                data-testid="QuickLinkMenu"
                className="absolute bg-neutral-950 text-white flex flex-col items-center rounded-xl z-[1]">
                <span
                  data-testid="EditQuickLink"
                  className="hover:bg-neutral-600 p-3 w-full flex items-center justify-center rounded-t-xl"
                  onClick={handleEditClick}>
                  Edit
                </span>
                <span
                  data-testid="DeleteQuickLink"
                  className="hover:bg-neutral-600 p-3 w-full flex items-center justify-center rounded-b-xl"
                  onClick={handleDeleteClick}>
                  Delete
                </span>
              </div>
            )}
          </div>
          {favicon ? (
            <img
              draggable="false"
              src={favicon}
              alt={pageName}
              width={48}
              height={48}
            />
          ) : (
            <div className="flex items-center justify-center w-[48px] h-[48px] rounded">
              <span className="text-xl font-bold text-white">
                {pageName.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <div className="triangle gradient-background transition-opacity opacity-0 group-hover:opacity-100 w-4 h-4 absolute right-[-4px] bottom-[-4px]" />
          <div className="triangle gradient-background transition-opacity opacity-0 group-hover:opacity-100 w-4 h-4 absolute left-[-4px] bottom-[-4px] rotate-90" />
        </QuickLinkBackground>
      </a>
      <p data-testid="QuickLinkName" className="text-white">
        {pageName}
      </p>
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
      className="relative flex justify-center items-start">
      <QuickLinkBackground
        type={quickLinkSettings?.type}
        className={
          quickLinkSettings?.bigQuickLinks
            ? "w-[166px] h-28"
            : "w-[144px] h-[88px]"
        }
        draggable={false}>
        <div className="z-10 flex items-center justify-center h-full">
          <AddButton />
        </div>
      </QuickLinkBackground>
    </button>
  );
}

function AddButton() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="36"
      height="36"
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
  favicon,
  quickLinkSettings,
  pageName
}: {
  favicon: string;
  quickLinkSettings: QuickLinkSettings;
  pageName: string;
}) {
  return (
    <QuickLinkBackground
      type={quickLinkSettings?.type}
      className="w-[166px] h-28 flex items-center justify-center">
      {favicon ? (
        <img src={favicon} alt={pageName} width={48} height={48} />
      ) : (
        <div className="flex items-center justify-center w-[48px] h-[48px] rounded">
          <span className="text-xl font-bold text-white">
            {pageName.charAt(0).toUpperCase()}
          </span>
        </div>
      )}
    </QuickLinkBackground>
  );
}
