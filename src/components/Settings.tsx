import { Suspense, useState } from "react";
import {
  ImageIcon,
  PaletteIcon,
  SettingsIcon,
  SlidersHorizontalIcon
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getMessage } from "@/utils/getMessage";

import SettingsPlaceholder from "./settings/Placeholder";
import { settingsSections, type SettingsSectionId } from "./settings/sections";

const sectionIcons = {
  Main: SlidersHorizontalIcon,
  Photos: ImageIcon,
  Widgets: PaletteIcon
};

export default function Settings() {
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<SettingsSectionId>("Main");

  const activeSectionConfig = settingsSections.find(
    (section) => section.id === activeSection
  );

  return (
    <>
      <button
        type="button"
        aria-label="Open settings"
        className="text-primary-text/90 hover:text-primary-text focus-visible:ring-primary/70 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full transition-colors focus-visible:ring-2 focus-visible:outline-none"
        data-testid="SettingsGear"
        onClick={() => setOpen(true)}>
        <SettingsIcon className="size-5" />
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          data-testid="SettingsPanel"
          variant="panel"
          className="sm:max-w-145">
          <DialogHeader className="gap-2 px-6 pt-7 pr-16 pb-5">
            <DialogTitle>{getMessage("settingsTitle")}</DialogTitle>
            <DialogDescription>
              {getMessage("settingsDescription")}
            </DialogDescription>
          </DialogHeader>

          <Tabs
            value={activeSection}
            onValueChange={(value) =>
              setActiveSection(value as SettingsSectionId)
            }
            className="w-full flex-col gap-0">
            <div className="px-6 pb-5" data-testid="SectionList">
              <TabsList className="grid h-11 w-full grid-cols-3">
                {settingsSections.map((section) => {
                  const Icon = sectionIcons[section.id];
                  return (
                    <TabsTrigger
                      key={section.id}
                      value={section.id}
                      data-testid={section.id}
                      className="h-full gap-2">
                      <Icon aria-hidden="true" />
                      {getMessage(section.labelKey)}
                    </TabsTrigger>
                  );
                })}
              </TabsList>
            </div>

            <div className="border-border/50 h-[min(380px,55dvh)] min-w-0 [scrollbar-gutter:stable] overflow-y-auto overscroll-contain border-t px-6 py-5">
              <h3 className="sr-only">
                {activeSectionConfig
                  ? getMessage(activeSectionConfig.labelKey)
                  : null}
              </h3>

              {settingsSections.map((section) => {
                const SectionComponent = section.component;

                return (
                  <TabsContent
                    key={section.id}
                    value={section.id}
                    className="m-0 w-full min-w-0"
                    data-testid={`${section.id}Settings`}>
                    {activeSection === section.id && (
                      <Suspense fallback={<SettingsPlaceholder />}>
                        <SectionComponent />
                      </Suspense>
                    )}
                  </TabsContent>
                );
              })}
            </div>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
}
