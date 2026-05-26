// src/lib/analytics.ts
// 🛰️ PHASE 3: THE INTELLIGENT PROBE (SDK)
// ✅ HYBRID MODE: Uses Axios for control + Beacon for reliability.

import axios from 'axios';

const ENDPOINT = "https://arexa.co/api/collect_event.php";

class AnalyticsEngine {
    private visitorId: string;
    private sessionId: string;
    private lastActivity: number;
    private scrollDepthsTracked: number[] = [];
    private heartbeatTimer: any;

    constructor() {
        this.visitorId = this.getOrSetVisitorId();
        this.sessionId = this.getOrSetSessionId();
        this.lastActivity = Date.now();

        // Auto-bind context
        this.handleScroll = this.handleScroll.bind(this);
        this.handleActivity = this.handleActivity.bind(this);
        this.flushBuffer = this.flushBuffer.bind(this);

        // Listen for page exit to force-send final data
        window.addEventListener('visibilitychange', this.flushBuffer);
        window.addEventListener('beforeunload', this.flushBuffer);
    }

    // --- 1. IDENTITY MANAGEMENT ---

    private getOrSetVisitorId(): string {
        let vid = localStorage.getItem('arexa_vid');
        if (!vid) {
            vid = 'v_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
            localStorage.setItem('arexa_vid', vid);
        }
        return vid;
    }

    private getOrSetSessionId(): string {
        let sid = sessionStorage.getItem('arexa_sid');
        const lastActive = localStorage.getItem('arexa_last_active');
        const now = Date.now();

        // New Session if none exists OR expired (> 30 mins inactive)
        if (!sid || !lastActive || (now - parseInt(lastActive)) > 30 * 60 * 1000) {
            sid = 's_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
            sessionStorage.setItem('arexa_sid', sid);
            this.scrollDepthsTracked = [];
        }

        localStorage.setItem('arexa_last_active', now.toString());
        return sid;
    }

    // --- 2. HYBRID TRACKING SYSTEM ---

    public async track(eventName: string, properties: Record<string, any> = {}) {
        this.lastActivity = Date.now();
        localStorage.setItem('arexa_last_active', this.lastActivity.toString());

        const payload = {
            visitor_id: this.visitorId,
            session_id: this.sessionId,
            event_name: eventName,
            page_url: window.location.href,
            referrer: document.referrer,
            timestamp: new Date().toISOString(),
            properties: {
                ...properties,
                screen_width: window.screen.width,
                language: navigator.language,
                connection_type: (navigator as any).connection?.effectiveType || 'unknown'
            }
        };

        // 🟢 LOGIC 1: CRITICAL EXIT EVENTS (Use Beacon Priority)
        // If the user is leaving, Axios is too slow/risky. Force Beacon.
        const isExitEvent = eventName === 'page_exit' || eventName === 'session_end' || document.visibilityState === 'hidden';

        if (isExitEvent && navigator.sendBeacon) {
            const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
            const success = navigator.sendBeacon(ENDPOINT, blob);
            if (success) return; // If Beacon accepted it, we are done.
        }

        // 🔵 LOGIC 2: STANDARD EVENTS (Use Axios Priority)
        // Axios gives us better control (Headers, Promises, Response handling).
        try {
            await axios.post(ENDPOINT, payload);
        } catch (error) {
            console.warn("⚠️ Analytics: Axios failed, attempting Beacon fallback", error);

            // 🔴 LOGIC 3: FAILOVER (Axios Died -> Try Beacon)
            // If Axios fails (network blip?), try to save the data with Beacon.
            if (navigator.sendBeacon) {
                const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
                navigator.sendBeacon(ENDPOINT, blob);
            }
        }
    }

    // --- 3. AUTOMATIC LISTENERS ---

    public startPageTracking() {
        // Track Page View immediately
        this.track('page_view', { title: document.title });

        // Track Clicks
        document.addEventListener('click', (e: any) => {
            const btn = e.target.closest('button, a, input[type="submit"]');
            if (btn) {
                this.track('click', {
                    tag: btn.tagName,
                    text: btn.innerText || btn.title || btn.value || 'unknown',
                    href: btn.href || null,
                    id: btn.id || null,
                    classes: btn.className || null
                });
            }
        });

        // Track Scroll
        window.addEventListener('scroll', this.throttle(this.handleScroll, 1000));

        // Heartbeat (Every 15s for better accuracy)
        this.heartbeatTimer = setInterval(() => {
            if (document.visibilityState === 'visible') {
                this.track('heartbeat', { time_on_page: 15 });
            }
        }, 15000);

        // Activity Monitor
        ['mousemove', 'keydown', 'scroll'].forEach(evt =>
            window.addEventListener(evt, this.handleActivity)
        );
    }

    private handleScroll() {
        const scrollTop = window.scrollY;
        const docHeight = document.body.scrollHeight - window.innerHeight;
        const scrollPercent = Math.round((scrollTop / docHeight) * 100);

        [25, 50, 75, 90, 100].forEach(milestone => {
            if (scrollPercent >= milestone && !this.scrollDepthsTracked.includes(milestone)) {
                this.scrollDepthsTracked.push(milestone);
                this.track('scroll_depth', { depth: milestone + '%' });
            }
        });
    }

    private handleActivity() {
        this.getOrSetSessionId(); // Refreshes session timer
    }

    private flushBuffer() {
        if (document.visibilityState === 'hidden') {
            this.track('page_exit', { reason: 'tab_hidden_or_closed' });
        }
    }

    private throttle(func: Function, limit: number) {
        let inThrottle: boolean;
        return function(this: any) {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }
}

export const analytics = new AnalyticsEngine();