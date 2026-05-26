import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, X, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface ConsentProps {
    show: boolean;
    onUpdate: (choice: 'accepted' | 'declined') => void;
}

const CustomToggle = ({ checked, onChange, disabled = false }: { checked: boolean; onChange?: (val: boolean) => void; disabled?: boolean }) => (
    <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange && onChange(!checked)}
        className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 ${checked ? 'bg-blue-600' : 'bg-slate-300'} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
        <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${checked ? 'translate-x-4' : 'translate-x-0'}`} />
    </button>
);

const CookieConsent = ({ show, onUpdate }: ConsentProps) => {
    const [view, setView] = useState<'main' | 'preferences'>('main');
    const [isProcessing, setIsProcessing] = useState(false);

    const [preferences, setPreferences] = useState({
        analytics: true,
        marketing: false,
    });

    const handleUpdate = (choice: 'accepted' | 'declined') => {
        if (isProcessing) return;
        setIsProcessing(true);
        onUpdate(choice);
    };

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 50, opacity: 0 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="fixed inset-x-0 bottom-4 sm:bottom-6 z-[100] flex justify-center px-4 pointer-events-none"
                >
                    <motion.div
                        layout
                        className="bg-white border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-2xl pointer-events-auto overflow-hidden text-slate-900 w-full max-w-3xl"
                    >
                        {view === 'main' && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="p-6 flex flex-col gap-4"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <Cookie className="text-blue-600" size={24} />
                                        <h3 className="text-lg font-semibold tracking-tight text-slate-900">Your Privacy Matters</h3>
                                    </div>
                                    <button
                                        disabled={isProcessing}
                                        onClick={() => handleUpdate('declined')}
                                        className={`text-slate-400 hover:text-slate-600 transition-colors ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        aria-label="Close"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>

                                <p className="text-sm text-slate-500 leading-relaxed">
                                    We use cookies and similar technologies to enhance your browsing experience, analyze site traffic, and personalize content. By clicking "Accept All", you consent to our use of cookies. You can choose to decline non-essential cookies. For more details on how we protect your data, please review our{" "}
                                    <Link to="/privacy-policy" className="text-blue-600 underline decoration-blue-200 underline-offset-4 hover:decoration-blue-600 transition-colors font-medium">Privacy Policy</Link>,{" "}
                                    <Link to="/terms-of-service" className="text-blue-600 underline decoration-blue-200 underline-offset-4 hover:decoration-blue-600 transition-colors font-medium">Terms of Service</Link>, and{" "}
                                    <Link to="/content-policy" className="text-blue-600 underline decoration-blue-200 underline-offset-4 hover:decoration-blue-600 transition-colors font-medium">Content Policy</Link>.
                                </p>

                                <div className="flex flex-col sm:flex-row justify-end gap-3 mt-2">
                                    <Button
                                        variant="outline"
                                        disabled={isProcessing}
                                        onClick={() => setView('preferences')}
                                        className="w-full sm:w-auto bg-white border-slate-300 text-slate-700 hover:bg-slate-50"
                                    >
                                        Manage Preferences
                                    </Button>
                                    <Button
                                        variant="outline"
                                        disabled={isProcessing}
                                        onClick={() => handleUpdate('declined')}
                                        className="w-full sm:w-auto bg-white border-slate-300 text-slate-700 hover:bg-slate-50"
                                    >
                                        Decline Optional
                                    </Button>
                                    <Button
                                        disabled={isProcessing}
                                        onClick={() => handleUpdate('accepted')}
                                        className="w-full sm:w-auto bg-blue-600 text-white hover:bg-blue-700 font-medium shadow-sm shadow-blue-600/20"
                                    >
                                        Accept All
                                    </Button>
                                </div>
                            </motion.div>
                        )}

                        {view === 'preferences' && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex flex-col max-h-[75vh]"
                            >
                                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
                                    <button
                                        disabled={isProcessing}
                                        onClick={() => setView('main')}
                                        className="flex items-center text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors"
                                    >
                                        <ChevronLeft size={18} className="mr-1" />
                                        Back
                                    </button>
                                    <h3 className="font-semibold text-slate-900">Privacy Preferences</h3>
                                    <button disabled={isProcessing} onClick={() => handleUpdate('declined')} className="text-slate-400 hover:text-slate-600">
                                        <X size={20} />
                                    </button>
                                </div>

                                <div className="p-6 overflow-y-auto space-y-6">
                                    <p className="text-sm text-slate-500">
                                        Customize your cookie preferences below. Some cookies are necessary for the website to function properly.
                                    </p>

                                    <div className="flex items-start justify-between gap-4 p-4 rounded-xl border border-slate-200 bg-slate-50">
                                        <div>
                                            <h4 className="font-semibold text-slate-900 mb-1">Strictly Necessary</h4>
                                            <p className="text-xs text-slate-500 leading-relaxed">
                                                These cookies are required for the website to function securely and cannot be switched off.
                                            </p>
                                        </div>
                                        <div className="pt-1">
                                            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider bg-blue-100 px-2 py-1 rounded-md">Always On</span>
                                        </div>
                                    </div>

                                    <div className="flex items-start justify-between gap-4 p-4 rounded-xl border border-slate-100 bg-white">
                                        <div>
                                            <h4 className="font-semibold text-slate-900 mb-1">Analytics & Performance</h4>
                                            <p className="text-xs text-slate-500 leading-relaxed">
                                                Help us understand how visitors interact with our website by collecting information anonymously.
                                            </p>
                                        </div>
                                        <div className="pt-1">
                                            <CustomToggle
                                                disabled={isProcessing}
                                                checked={preferences.analytics}
                                                onChange={(val) => setPreferences(prev => ({ ...prev, analytics: val }))}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-start justify-between gap-4 p-4 rounded-xl border border-slate-100 bg-white">
                                        <div>
                                            <h4 className="font-semibold text-slate-900 mb-1">Marketing & Advertising</h4>
                                            <p className="text-xs text-slate-500 leading-relaxed">
                                                Used to display ads that are relevant and engaging for the user across websites.
                                            </p>
                                        </div>
                                        <div className="pt-1">
                                            <CustomToggle
                                                disabled={isProcessing}
                                                checked={preferences.marketing}
                                                onChange={(val) => setPreferences(prev => ({ ...prev, marketing: val }))}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex flex-col sm:flex-row gap-3 justify-end sticky bottom-0">
                                    <Button
                                        variant="ghost"
                                        disabled={isProcessing}
                                        onClick={() => setView('main')}
                                        className="w-full sm:w-auto text-slate-600 hover:bg-slate-200 hover:text-slate-900 font-medium"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        variant="outline"
                                        disabled={isProcessing}
                                        onClick={() => setView('main')}
                                        className="w-full sm:w-auto bg-white border-slate-300 text-slate-700 hover:bg-slate-50"
                                    >
                                        Save Choices
                                    </Button>
                                    <Button
                                        disabled={isProcessing}
                                        onClick={() => handleUpdate('accepted')}
                                        className="w-full sm:w-auto bg-blue-600 text-white hover:bg-blue-700 font-medium shadow-sm shadow-blue-600/20"
                                    >
                                        Accept All
                                    </Button>
                                </div>
                            </motion.div>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default CookieConsent;