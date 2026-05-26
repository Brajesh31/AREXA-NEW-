import { motion } from "framer-motion";
import arexaLogo from "@/assets/arexa-logo.png";
import {
    Box, Glasses, Smartphone, Sparkles, Ghost, Globe, Layers,
    Scan, Camera, Cpu, Zap, Wand2, Aperture, Smile,
    MousePointer2, Share2, Cuboid, Fingerprint, Hexagon
} from "lucide-react";

// --- Highly Optimized Floating Element ---
// Uses only 2D 'y' translation and opacity.
// No 3D rotations or scaling, which saves massive GPU memory.
const OptimizedIcon = ({ Icon, top, left, right, bottom, size, color, delay }: any) => (
    <motion.div
        initial={{ opacity: 0, y: 0 }}
        animate={{
            opacity: 0.25,           // Keep them subtle in the background
            y: [0, -15, 0]           // Gentle vertical float
        }}
        transition={{
            opacity: { duration: 1, delay }, // Fade in once
            y: {
                duration: 4,         // Slow, relaxed float
                repeat: Infinity,
                ease: "easeInOut",
                delay
            }
        }}
        className={`absolute ${color} z-0 pointer-events-none drop-shadow-sm`}
        style={{ top, left, right, bottom }}
    >
        <Icon size={size} strokeWidth={1.5} />
    </motion.div>
);

const LoadingScreen = () => {
    return (
        <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gradient-to-br from-[#ffffff] via-[#f1f5f9] to-[#e2e8f0] overflow-hidden"
        >
            {/* --- TOP SECTION --- */}
            <OptimizedIcon Icon={Box} size={50} color="text-blue-600" top="8%" left="8%" delay={0} />
            <OptimizedIcon Icon={Glasses} size={55} color="text-purple-600" top="12%" right="10%" delay={0.2} />
            <OptimizedIcon Icon={Ghost} size={42} color="text-yellow-500" top="5%" left="35%" delay={0.1} />
            <OptimizedIcon Icon={Wand2} size={38} color="text-pink-500" top="18%" right="35%" delay={0.3} />
            <OptimizedIcon Icon={Hexagon} size={45} color="text-indigo-500" top="25%" left="20%" delay={0.4} />

            {/* --- MIDDLE SECTION --- */}
            <OptimizedIcon Icon={Camera} size={48} color="text-indigo-600" top="42%" left="4%" delay={0.1} />
            <OptimizedIcon Icon={Layers} size={50} color="text-cyan-600" top="45%" right="4%" delay={0.5} />
            <OptimizedIcon Icon={Sparkles} size={36} color="text-amber-500" top="38%" left="28%" delay={0.2} />
            <OptimizedIcon Icon={Scan} size={40} color="text-emerald-600" top="50%" right="22%" delay={0.6} />
            <OptimizedIcon Icon={Cpu} size={34} color="text-slate-500" top="32%" right="42%" delay={0.3} />
            <OptimizedIcon Icon={Zap} size={38} color="text-orange-500" top="60%" left="15%" delay={0.4} />

            {/* --- BOTTOM SECTION --- */}
            <OptimizedIcon Icon={Smartphone} size={54} color="text-rose-500" bottom="12%" left="12%" delay={0} />
            <OptimizedIcon Icon={Globe} size={48} color="text-sky-600" bottom="18%" right="12%" delay={0.2} />
            <OptimizedIcon Icon={Cuboid} size={44} color="text-orange-600" bottom="8%" left="40%" delay={0.5} />

            <OptimizedIcon Icon={Aperture} size={38} color="text-teal-500" bottom="30%" left="6%" delay={0.3} />
            <OptimizedIcon Icon={Smile} size={40} color="text-lime-600" bottom="35%" right="6%" delay={0.1} />
            <OptimizedIcon Icon={Share2} size={30} color="text-violet-500" bottom="5%" left="25%" delay={0.4} />
            <OptimizedIcon Icon={Fingerprint} size={36} color="text-fuchsia-500" bottom="8%" right="30%" delay={0.2} />
            <OptimizedIcon Icon={MousePointer2} size={32} color="text-red-500" bottom="25%" right="40%" delay={0.6} />

            {/* --- CENTER CONTENT --- */}
            <div className="relative z-10 flex flex-col items-center">

                {/* 1. Main Logo */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="relative mb-12"
                >
                    <img
                        src={arexaLogo}
                        alt="Arexa"
                        className="w-48 md:w-64 lg:w-80 h-auto object-contain drop-shadow-xl"
                    />
                    <div className="absolute inset-0 bg-white/80 blur-3xl -z-10 rounded-full scale-150" />
                </motion.div>

                {/* 2. Custom 3D Tesseract Loader */}
                <div className="relative w-16 h-16 [perspective:1000px]">
                    {/* Outer Ring */}
                    <motion.div
                        className="absolute inset-0 border-[5px] border-transparent border-t-primary border-b-primary rounded-full"
                        animate={{ rotateX: 360, rotateY: 180 }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    />
                    {/* Middle Ring */}
                    <motion.div
                        className="absolute inset-2 border-[4px] border-transparent border-l-secondary border-r-secondary rounded-full"
                        animate={{ rotateX: 180, rotateY: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    />
                    {/* Inner Core */}
                    <motion.div
                        className="absolute inset-5 bg-gradient-to-tr from-primary to-secondary rounded-full shadow-[0_0_20px_rgba(var(--primary),0.8)]"
                        animate={{ scale: [0.8, 1.2, 0.8] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    />
                </div>
            </div>
        </motion.div>
    );
};

export default LoadingScreen;