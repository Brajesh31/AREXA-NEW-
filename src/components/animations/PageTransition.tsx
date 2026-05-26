import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import { ReactNode } from "react";

interface PageTransitionProps {
  children: ReactNode;
}

// Scale & Fade page transition (1-1.5 second duration)
const pageVariants = {
  initial: {
    opacity: 0,
    scale: 0.95,
    filter: "blur(4px)",
  },
  animate: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    filter: "blur(4px)",
  },
};

const pageTransition = {
  type: "tween" as const,
  ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
  duration: 1.2, // Medium speed: 1-1.5 seconds
};

const PageTransition = ({ children }: PageTransitionProps) => {
  const location = useLocation();

  return (
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
            key={location.pathname}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageVariants}
            transition={pageTransition}
            style={{
              width: "100%",
              willChange: "transform, opacity, filter",
            }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
  );
};

export default PageTransition;
