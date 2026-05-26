// src/hooks/useAnalytics.ts
import axios from 'axios';

const API_BASE = "https://arexa.co/api";

export const useAnalytics = () => {

    // ------------------------------------------------------------------
    // MANUAL CLICK TRACKING (Goal 3 & 3.5)
    // ------------------------------------------------------------------

    // 1. Track BLOG Clicks
    const trackBlogView = async (blogId: string) => {
        try {
            await axios.post(`${API_BASE}/track_v2.php?action=click`, {
                type: 'blog',
                id: blogId
            });
        } catch (error) {
            console.error("Failed to count blog view");
        }
    };

    // 2. Track INSIGHT Clicks
    const trackInsightView = async (insightId: string) => {
        try {
            await axios.post(`${API_BASE}/track_v2.php?action=click`, {
                type: 'insight',
                id: insightId
            });
        } catch (error) {
            console.error("Failed to count insight view");
        }
    };

    return { trackBlogView, trackInsightView };
};