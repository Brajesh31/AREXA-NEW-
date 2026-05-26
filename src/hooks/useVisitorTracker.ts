// src/hooks/useVisitorTracker.ts
import { useState, useEffect } from "react";
import axios from "axios";

const API_BASE = "https://arexa.co/api";

export const useVisitorTracker = () => {
    const [showConsent, setShowConsent] = useState(false);

    useEffect(() => {
        const initSession = async () => {
            try {
                // 1. Get existing token
                const storedToken = localStorage.getItem("arexa_cookie_token");

                // 2. Call API
                const { data } = await axios.post(`${API_BASE}/track_v2.php?action=init`, {
                    token: storedToken
                });

                // 3. Save new token if provided
                if (data.token) {
                    localStorage.setItem("arexa_cookie_token", data.token);
                }

                // 4. Show popup if status is 'pending'
                if (data.consent === "pending") {
                    setShowConsent(true);
                }
            } catch (error) {
                console.error("Tracker Error:", error);
            }
        };

        initSession();
    }, []);

    // ✅ UPDATED: Handle Decline by clearing local storage with Optimistic UI update
    const updateConsent = async (choice: 'accepted' | 'declined') => {
        // Hide Popup IMMEDIATELY so it feels instantaneous to the user
        setShowConsent(false);

        try {
            const token = localStorage.getItem("arexa_cookie_token");

            // Tell Backend to either Save (Accept) or Delete (Decline)
            await axios.post(`${API_BASE}/track_v2.php?action=consent`, {
                token,
                choice
            });

            if (choice === 'declined') {
                // 🗑️ User Declined: Clear token from browser memory
                localStorage.removeItem("arexa_cookie_token");
            }

        } catch (error) {
            console.error("Consent Error:", error);
        }
    };

    return { showConsent, updateConsent };
};