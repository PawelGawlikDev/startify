import { motion } from "motion/react";
import React, { useEffect, useRef, useState, useCallback } from "react";

import { db } from "@/indexdb";
import type { QuickLinkSettings } from "@/types";

import QuickLinkBackground from "./QuickLinkBackground";

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
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
      const updatedOrder = prevOrder.filter((linkId) => linkId !== id);

      localStorage.setItem("speedLinkOrder", JSON.stringify(updatedOrder));

      return updatedOrder;
    });
  }, [id, setQuickLinkOrder]);

  const toggleMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setShowMenu((prev) => !prev);
  }, []);

  return (
    <motion.div
      data-testid="QuickLink"
      layout
      className="group relative z-10 flex flex-col items-center justify-center">
      <a draggable="false" href={url} tabIndex={0} aria-label={pageName}>
        <QuickLinkBackground className="flex h-[88px] w-[144px] items-center justify-center">
          <div
            data-testid="QuickLinkSettingsButton"
            ref={menuRef}
            className={`absolute top-1 h-5 w-5 ${
              showMenu ? "opacity-100" : "opacity-0"
            } right-2 rounded-full p-1 transition-all group-hover:opacity-100 hover:bg-neutral-800/75`}
            onClick={toggleMenu}>
            <EditDots />
            {showMenu && (
              <div
                data-testid="QuickLinkMenu"
                className="absolute z-1 flex flex-col items-center rounded-xl bg-neutral-950 text-white">
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
                  {browser.i18n.getMessage("delete")}
                </span>
              </div>
            )}
          </div>
          <QuickLinkTitle pageName={pageName} />
        </QuickLinkBackground>
      </a>
      <motion.p
        initial={{ scale: 0.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        data-testid="QuickLinkName"
        className="text-primary-text max-w-[60%] truncate">
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
        setEditingLink({ name: "", url: "", id: 0 });
      }}
      className="group relative flex cursor-pointer items-start justify-center">
      <QuickLinkBackground
        className={
          quickLinkSettings?.bigQuickLinks
            ? "h-28 w-[166px]"
            : "h-[88px] w-[144px]"
        }
        draggable={false}>
        <div className="z-10 flex h-full items-center justify-center gap-1">
          <AddButton />
          <p className="inline-block max-w-0 overflow-hidden text-nowrap text-white opacity-0 transition-all duration-500 group-hover:max-w-full group-hover:opacity-100">
            {browser.i18n.getMessage("addQuickLink")}
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

export function QuickLinkPreview({ pageName }: { pageName: string }) {
  return (
    <QuickLinkBackground className="flex h-28 w-[166px] items-center justify-center">
      <QuickLinkTitle pageName={pageName} />
    </QuickLinkBackground>
  );
}

const QuickLinkTitle = ({ pageName }: { pageName: string }) => {
  return (
    <div className="flex h-[48px] w-full max-w-full items-center justify-center rounded p-2">
      <span
        className="truncate text-xl font-bold"
        style={{ color: "var(--color-primary-text)" }}>
        {pageName.toUpperCase()}
      </span>
    </div>
  );
};
