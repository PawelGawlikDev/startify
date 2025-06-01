import React, { useState, useRef, useEffect, Suspense } from "react";
import { getMessage } from "@/utils/getMessage";
import SettingsPlaceholder from "./settings/Placeholder";
import { motion, AnimatePresence } from "motion/react";

const MainSettings = React.lazy(() => import("./settings/MainSettings"));
const PhotosSettings = React.lazy(() => import("./settings/PhostosSettings"));
const WidgetSettings = React.lazy(() => import("./settings/WidgetSettings"));

const Gear = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24">
      <g fill="none" stroke="white" strokeWidth="1.5">
        <circle cx="12" cy="12" r="3" />
        <path d="M13.765 2.152C13.398 2 12.932 2 12 2s-1.398 0-1.765.152a2 2 0 0 0-1.083 1.083c-.092.223-.129.484-.143.863a1.62 1.62 0 0 1-.79 1.353a1.62 1.62 0 0 1-1.567.008c-.336-.178-.579-.276-.82-.308a2 2 0 0 0-1.478.396C4.04 5.79 3.806 6.193 3.34 7s-.7 1.21-.751 1.605a2 2 0 0 0 .396 1.479c.148.192.355.353.676.555c.473.297.777.803.777 1.361s-.304 1.064-.777 1.36c-.321.203-.529.364-.676.556a2 2 0 0 0-.396 1.479c.052.394.285.798.75 1.605c.467.807.7 1.21 1.015 1.453a2 2 0 0 0 1.479.396c.24-.032.483-.13.819-.308a1.62 1.62 0 0 1 1.567.008c.483.28.77.795.79 1.353c.014.38.05.64.143.863a2 2 0 0 0 1.083 1.083C10.602 22 11.068 22 12 22s1.398 0 1.765-.152a2 2 0 0 0 1.083-1.083c.092-.223.129-.483.143-.863c.02-.558.307-1.074.79-1.353a1.62 1.62 0 0 1 1.567-.008c.336.178.579.276.819.308a2 2 0 0 0 1.479-.396c.315-.242.548-.646 1.014-1.453s.7-1.21.751-1.605a2 2 0 0 0-.396-1.479c-.148-.192-.355-.353-.676-.555A1.62 1.62 0 0 1 19.562 12c0-.558.304-1.064.777-1.36c.321-.203.529-.364.676-.556a2 2 0 0 0 .396-1.479c-.052-.394-.285-.798-.75-1.605c-.467-.807-.7-1.21-1.015-1.453a2 2 0 0 0-1.479-.396c-.24.032-.483.13-.82.308a1.62 1.62 0 0 1-1.566-.008a1.62 1.62 0 0 1-.79-1.353c-.014-.38-.05-.64-.143-.863a2 2 0 0 0-1.083-1.083Z" />
      </g>
    </svg>
  );
};

export default function Settings() {
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("Main");
  const popupRef = useRef<HTMLDivElement>(null);
  const sections = ["Main", "Photos", "Widgets"];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const sectionComponents: Record<
    string,
    React.LazyExoticComponent<() => React.JSX.Element>
  > = {
    Main: MainSettings,
    Photos: PhotosSettings,
    Widgets: WidgetSettings
  };

  const renderSection = () => {
    const SectionComponent = sectionComponents[activeSection];

    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSection}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}>
          <Suspense fallback={<SettingsPlaceholder />}>
            <SectionComponent />
          </Suspense>
        </motion.div>
      </AnimatePresence>
    );
  };

  return (
    <div className="relative" ref={popupRef}>
      <button
        className="text-primary-text hover:text-secondary cursor-pointer"
        data-testid="SettingsGear"
        onClick={() => setOpen((prev) => !prev)}>
        <Gear />
      </button>

      {open && (
        <div
          className="bg-default-bg shadow-input absolute bottom-10 left-0 z-40 flex h-[500px] w-[550px] rounded-xl"
          data-testid="SettingsPanel">
          <div
            className="border-secondary bg-surface w-1/3 border-r p-3"
            data-testid="SectionList">
            <ul className="space-y-2">
              {sections.map((section) => (
                <li key={section}>
                  <button
                    className={`text-primary-text w-full cursor-pointer rounded px-2 py-1 text-left text-sm ${
                      activeSection === section
                        ? "bg-surface-900"
                        : "hover:bg-surface-900"
                    }`}
                    onClick={() => setActiveSection(section)}
                    data-testid={`${section}`}>
                    {getMessage(`${section.toLowerCase()}Section`)}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div
            className="text-primary-text hide-scrollbar w-2/3 overflow-y-auto p-4"
            data-testid={`${activeSection}Settings`}>
            <h3 className="text-md mb-2 font-semibold">{activeSection}</h3>
            {renderSection()}
          </div>
        </div>
      )}
    </div>
  );
}
