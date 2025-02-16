import "../style.css";

import { motion } from "motion/react";
import React, { useState } from "react";

import QuickLinkModal from "~components/startPage/quickLink/QuickLinkModal";

export const QuickLInkModalStories = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button onClick={() => setShowModal(true)}>Show Modal</button>
      {showModal && (
        <motion.div
          data-testid="QuickLinkModal"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}>
          <QuickLinkModal
            quickLinkSettings={{
              bigQuickLinks: false,
              type: "gradient"
            }}
            setShowModal={setShowModal}
            id={1}
            favicon={
              "https://developer.mozilla.org/favicon-48x48.bc390275e955dacb2e65.png"
            }
            dialName={"test quick link"}
            dialUrl={""}
          />
        </motion.div>
      )}
    </>
  );
};
