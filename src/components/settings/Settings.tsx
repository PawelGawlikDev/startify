import { motion } from "framer-motion";
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
    <div className="text-white flex flex-col gap-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0, transition: { duration: 0.4 } }}
        className="w-full h-full mx-[20%] relative z-10 text-4xl">
        <h1>Settings</h1>
      </motion.div>
      <motion.div
        className="flex relative mx-[20%] mt-5 flex-col justify-center items-center gap-16"
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
