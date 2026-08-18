import React, { Suspense, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { SettingsIcon } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { getMessage } from "@/utils/getMessage";

import SettingsPlaceholder from "./settings/Placeholder";
import { settingsSections, type SettingsSectionId } from "./settings/sections";

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
          showCloseButton={false}
          className="text-primary-text w-[min(92vw,550px)] max-w-[min(92vw,550px)] border-none bg-transparent p-0 shadow-none ring-0 sm:max-w-[min(92vw,550px)] md:h-[500px] md:w-[550px] md:max-w-[550px]">
          <DialogHeader className="sr-only">
            <DialogTitle>Settings</DialogTitle>
            <DialogDescription>
              Manage search, photos, and widget preferences.
            </DialogDescription>
          </DialogHeader>

          <Tabs
            value={activeSection}
            onValueChange={(value) =>
              setActiveSection(value as SettingsSectionId)
            }
            className="w-full gap-0">
            <Card className="bg-default-bg/96 w-full overflow-visible rounded-2xl py-0 shadow-2xl ring-white/10 backdrop-blur-xl md:h-[500px]">
              <CardContent className="grid h-full w-full gap-0 overflow-visible px-0 md:grid-cols-[180px_minmax(0,1fr)]">
                <div
                  className="border-secondary/60 bg-surface/90 border-b p-3 md:border-r md:border-b-0"
                  data-testid="SectionList">
                  <TabsList
                    className="grid h-auto grid-cols-3 gap-2 bg-transparent p-0 md:grid-cols-1"
                    variant="line">
                    {settingsSections.map((section) => (
                      <TabsTrigger
                        key={section.id}
                        value={section.id}
                        data-testid={section.id}
                        className="text-primary-text data-active:bg-default-bg/85 hover:bg-surface-900/90 justify-start rounded-xl border-none px-3 py-2 shadow-none after:hidden">
                        {getMessage(section.labelKey)}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </div>

                <div className="hide-scrollbar w-full min-w-0 [scrollbar-gutter:stable] overflow-y-auto p-4 md:p-5">
                  <h3 className="mb-4 text-lg font-semibold">
                    {activeSectionConfig
                      ? getMessage(activeSectionConfig.labelKey)
                      : null}
                  </h3>

                  <div className="min-h-[320px] w-full max-w-full">
                    {settingsSections.map((section) => {
                      const SectionComponent = section.component;

                      return (
                        <TabsContent
                          key={section.id}
                          value={section.id}
                          className="m-0 w-full min-w-0"
                          data-testid={`${section.id}Settings`}>
                          <AnimatePresence mode="wait">
                            {activeSection === section.id && (
                              <motion.div
                                className="w-full min-w-0"
                                key={section.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}>
                                <Suspense fallback={<SettingsPlaceholder />}>
                                  <SectionComponent />
                                </Suspense>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </TabsContent>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
}
