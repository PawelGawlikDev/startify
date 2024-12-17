import { motion } from "motion/react";
import React from "react";

import BackgroundSection from "./sections/BackogrundSection";
import QuickLinkSection from "./sections/QuickLinksSection";
import RestartSection from "./sections/RestartSection";
import SearchBoxSection from "./sections/SearchBoxSection";

const containerVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } }
};

export default function Settings() {
  return (
    <div className="flex flex-col gap-8 text-white">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0, transition: { duration: 0.4 } }}
        className="relative z-10 mx-[20%] h-full w-full text-4xl">
        <h1>Settings</h1>
      </motion.div>
      <motion.div
        className="relative mx-[20%] mt-5 flex flex-col items-center justify-center gap-16"
        initial="hidden"
        animate="visible"
        variants={containerVariants}>
        <SearchBoxSection />
        <QuickLinkSection />
        <BackgroundSection />
        <RestartSection />
      </motion.div>
    </div>
  );
}
