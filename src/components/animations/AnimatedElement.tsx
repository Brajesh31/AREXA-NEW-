import { motion, useInView, Variant } from "framer-motion";
import { ReactNode, useRef } from "react";

type AnimationType = 
  | "slideFromLeft" 
  | "slideFromRight" 
  | "scaleUp" 
  | "fadeUp" 
  | "fadeDown"
  | "staggerItem";

interface AnimatedElementProps {
  children: ReactNode;
  type: AnimationType;
  delay?: number;
  duration?: number;
  className?: string;
  triggerOnScroll?: boolean; // true = animate on scroll, false = animate on load
  staggerIndex?: number; // For staggered reveals
}

const getVariants = (type: AnimationType): { initial: Variant; animate: Variant } => {
  switch (type) {
    case "slideFromLeft":
      return {
        initial: { opacity: 0, x: -60 },
        animate: { opacity: 1, x: 0 },
      };
    case "slideFromRight":
      return {
        initial: { opacity: 0, x: 60 },
        animate: { opacity: 1, x: 0 },
      };
    case "scaleUp":
      return {
        initial: { opacity: 0, scale: 0.8 },
        animate: { opacity: 1, scale: 1 },
      };
    case "fadeUp":
      return {
        initial: { opacity: 0, y: 40 },
        animate: { opacity: 1, y: 0 },
      };
    case "fadeDown":
      return {
        initial: { opacity: 0, y: -40 },
        animate: { opacity: 1, y: 0 },
      };
    case "staggerItem":
      return {
        initial: { opacity: 0, y: 30, scale: 0.95 },
        animate: { opacity: 1, y: 0, scale: 1 },
      };
    default:
      return {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
      };
  }
};

const AnimatedElement = ({
  children,
  type,
  delay = 0,
  duration = 0.7,
  className = "",
  triggerOnScroll = true,
  staggerIndex = 0,
}: AnimatedElementProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  
  const variants = getVariants(type);
  const totalDelay = delay + (staggerIndex * 0.1);

  return (
    <motion.div
      ref={ref}
      initial="initial"
      animate={triggerOnScroll ? (isInView ? "animate" : "initial") : "animate"}
      variants={variants}
      transition={{
        duration,
        delay: totalDelay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className={className}
      style={{ willChange: "transform, opacity" }}
    >
      {children}
    </motion.div>
  );
};

// Staggered container for multiple items
interface StaggerContainerProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
}

export const StaggerContainer = ({
  children,
  className = "",
  staggerDelay = 0.1,
}: StaggerContainerProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-30px" });

  return (
    <motion.div
      ref={ref}
      initial="initial"
      animate={isInView ? "animate" : "initial"}
      variants={{
        initial: {},
        animate: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// For use inside StaggerContainer
export const StaggerItem = ({
  children,
  className = "",
  type = "fadeUp",
}: {
  children: ReactNode;
  className?: string;
  type?: AnimationType;
}) => {
  const variants = getVariants(type);

  return (
    <motion.div
      variants={variants}
      transition={{
        duration: 0.6,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className={className}
      style={{ willChange: "transform, opacity" }}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedElement;
