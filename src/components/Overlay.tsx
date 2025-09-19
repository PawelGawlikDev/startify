import { motion } from "motion/react";

export const Overlay = ({
  dataTestId,
  children
}: {
  dataTestId?: string;
  children: React.ReactNode;
}) => {
  return (
    <motion.div
      data-testid={dataTestId}
      className="bg-opacity-50 fixed inset-0 z-[999] flex cursor-default items-center justify-center backdrop-blur-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}>
      {children}
    </motion.div>
  );
};
