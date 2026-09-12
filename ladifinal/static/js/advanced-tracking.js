/**
 * Advanced Analytics & Tracking Library
 * Supports: Google Analytics 4, Facebook Pixel, TikTok Pixel, Custom Events
 * Version: 3.1
 */

class AdvancedTracking {
    constructor(config = {}) {
        this.config = {
            gaId: config.gaId || null,
            fbPixelId: config.fbPixelId || null,
            tiktokPixelId: config.tiktokPixelId || null,
            googleAdsConversionId: config.googleAdsConversionId || null,
            googleAdsPhoneLabel: config.googleAdsPhoneLabel || null,
            googleAdsZaloLabel: config.googleAdsZaloLabel || null,
            debug: config.debug || false,
            autoTrack: config.autoTrack !== false, // Default true
            consentModeEnabled: config.consentModeEnabled !== false,
            defaultConsent: config.defaultConsent || {
                ad_storage: 'granted',
                analytics_storage: 'granted',
                ad_user_data: 'granted',
                ad_personalization: 'granted'
            },
            waitForConsentUpdateMs: Number.isFinite(config.waitForConsentUpdateMs)
                ? config.waitForConsentUpdateMs
                : 500
        };
        this.config.googleAdsConversionId = this.normalizeGoogleAdsConversionId(this.config.googleAdsConversionId);
        
        this.initialized = false;
        this.eventQueue = [];
        this.initialGaPageViewTracked = false;
        
        if (this.config.autoTrack) {
            this.init();
        }
    }

    /**
     * Initialize tracking
     */
    init() {
        if (this.initialized) return;
        
        this.log('Initializing Advanced Tracking...');
        
        // Initialize Google Analytics 4
        if (this.config.gaId) {
            this.initGA4();
        }

        // Initialize Google Ads conversion tag (AW) for auto phone/zalo conversion tracking
        if (this.config.googleAdsConversionId) {
            this.initGoogleAdsConversion();
        }
        
        // Initialize Facebook Pixel
        if (this.config.fbPixelId) {
            this.initFacebookPixel();
        }

        // Initialize TikTok Pixel
        if (this.config.tiktokPixelId) {
            this.initTikTokPixel();
        }

        // Auto-track page view for platforms already ready.
        // GA page_view is dispatched after Google tag is available.
        if (this.config.gaId) {
            this.trackPageView(null, { includeGA: false });
        } else {
            this.trackPageView();
        }
        
        // Setup auto event listeners
        this.setupAutoTracking();
        
        this.initialized = true;

        // Process queued events
        this.processQueue();
        
        this.log('Advanced Tracking initialized successfully');
    }

    normalizeGoogleAdsConversionId(value) {
        if (!value) {
            return null;
        }
        const raw = String(value).trim();
        if (!raw) {
            return null;
        }
        return raw.toUpperCase().startsWith('AW-') ? raw.toUpperCase() : `AW-${raw}`;
    }

    ensureGoogleTagReady(tagId, onScriptLoad = null) {
        if (!tagId) {
            return;
        }

        window.dataLayer = window.dataLayer || [];
        if (typeof window.gtag === 'undefined') {
            window.gtag = function() { window.dataLayer.push(arguments); };
        }

        if (this.config.consentModeEnabled && !window.__advancedTrackingConsentDefaultSet) {
            gtag('consent', 'default', {
                ...this.buildConsentPayload(this.config.defaultConsent),
                wait_for_update: this.config.waitForConsentUpdateMs
            });
            window.__advancedTrackingConsentDefaultSet = true;
        }

        if (!window.__advancedTrackingGtagJsInitialized) {
            gtag('js', new Date());
            window.__advancedTrackingGtagJsInitialized = true;
        }

        const encodedTagId = encodeURIComponent(tagId);
        const existingScript = document.querySelector(`script[src*="googletagmanager.com/gtag/js?id=${encodedTagId}"]`);
        if (existingScript) {
            return;
        }

        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${tagId}`;
        if (typeof onScriptLoad === 'function') {
            script.onload = onScriptLoad;
        }
        document.head.appendChild(script);
    }

    initGoogleAdsConversion() {
        const conversionId = this.config.googleAdsConversionId;
        if (!conversionId) {
            return;
        }

        this.ensureGoogleTagReady(conversionId);
        if (typeof gtag !== 'undefined') {
            gtag('config', conversionId);
            this.log('Google Ads conversion initialized:', conversionId);
        }
    }

    /**
     * Initialize Google Analytics 4
     */
    initGA4() {
        this.ensureGoogleTagReady(this.config.gaId, () => {
            this.log('Google tag script loaded');
            this.sendInitialGaPageView();
        });

        if (typeof gtag === 'undefined') {
            return;
        }

        gtag('config', this.config.gaId, {
            send_page_view: false // We'll send manually
        });

        this.log('GA4 initialized:', this.config.gaId);

        // If Google tag is already loaded by another snippet, fire initial GA page_view now.
        if (typeof window.google_tag_manager !== 'undefined') {
            this.sendInitialGaPageView();
        }
    }

    /**
     * Normalize and filter consent states for Consent Mode v2.
     */
    buildConsentPayload(consentState = {}) {
        const normalizeValue = (value) => (value === 'denied' ? 'denied' : 'granted');
        return {
            ad_storage: normalizeValue(consentState.ad_storage),
            analytics_storage: normalizeValue(consentState.analytics_storage),
            ad_user_data: normalizeValue(consentState.ad_user_data),
            ad_personalization: normalizeValue(consentState.ad_personalization)
        };
    }

    /**
     * Update consent state at runtime.
     */
    updateConsent(consentState = {}) {
        if (!this.config.gaId || typeof gtag === 'undefined') {
            return;
        }

        const updates = {};
        ['ad_storage', 'analytics_storage', 'ad_user_data', 'ad_personalization'].forEach((key) => {
            if (consentState[key] !== undefined) {
                updates[key] = consentState[key] === 'denied' ? 'denied' : 'granted';
            }
        });

        if (Object.keys(updates).length === 0) {
            return;
        }

        gtag('consent', 'update', updates);
        this.log('Consent updated:', updates);
    }

    grantAllConsent() {
        this.updateConsent({
            ad_storage: 'granted',
            analytics_storage: 'granted',
            ad_user_data: 'granted',
            ad_personalization: 'granted'
        });
    }

    denyAllConsent() {
        this.updateConsent({
            ad_storage: 'denied',
            analytics_storage: 'denied',
            ad_user_data: 'denied',
            ad_personalization: 'denied'
        });
    }

    sendInitialGaPageView() {
        if (this.initialGaPageViewTracked) {
            return;
        }
        this.initialGaPageViewTracked = true;
        this.trackPageView(null, {
            includeFacebook: false,
            includeTikTok: false
        });
    }

    /**
     * Initialize Facebook Pixel
     */
    initFacebookPixel() {
        if (typeof fbq === 'undefined') {
            // Load Facebook Pixel
            !function(f,b,e,v,n,t,s) {
                if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)
            }(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            
            fbq('init', this.config.fbPixelId);
            this.log('Facebook Pixel initialized:', this.config.fbPixelId);
        }
    }

    /**
     * Initialize TikTok Pixel
     */
    initTikTokPixel() {
        if (typeof ttq === 'undefined') {
            !function (w, d, t) {
                w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e};ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var a=document.createElement("script");a.type="text/javascript",a.async=!0,a.src=r+"?sdkid="+e+"&lib="+t;var s=document.getElementsByTagName("script")[0];s.parentNode.insertBefore(a,s)};
            }(window, document, 'ttq');

            ttq.load(this.config.tiktokPixelId);
            this.log('TikTok Pixel initialized:', this.config.tiktokPixelId);
        }
    }

    /**
     * Track page view
     */
    trackPageView(pagePath = null, options = {}) {
        const path = pagePath || window.location.pathname;
        const includeGA = options.includeGA !== false;
        const includeFacebook = options.includeFacebook !== false;
        const includeTikTok = options.includeTikTok !== false;
        
        // GA4
        if (includeGA && this.config.gaId && typeof gtag !== 'undefined') {
            gtag('event', 'page_view', {
                page_path: path,
                page_title: document.title,
                page_location: window.location.href
            });
        }
        
        // Facebook Pixel
        if (includeFacebook && this.config.fbPixelId && typeof fbq !== 'undefined') {
            fbq('track', 'PageView');
        }

        // TikTok Pixel
        if (includeTikTok && this.config.tiktokPixelId && typeof ttq !== 'undefined') {
            ttq.page();
        }

        this.log('Page view tracked:', path);
    }

    /**
     * Track custom event
     */
    trackEvent(eventName, params = {}) {
        if (!this.initialized) {
            this.eventQueue.push({ eventName, params });
            return;
        }
        
        // GA4
        if (this.config.gaId && typeof gtag !== 'undefined') {
            gtag('event', eventName, params);
        }
        
        // Facebook Pixel
        if (this.config.fbPixelId && typeof fbq !== 'undefined') {
            fbq('trackCustom', eventName, params);
        }

        // TikTok Pixel
        if (this.config.tiktokPixelId && typeof ttq !== 'undefined') {
            ttq.track(eventName, params);
        }

        this.log('Event tracked:', eventName, params);
    }

    /**
     * Track button click
     */
    trackClick(element, action, category = 'engagement') {
        this.trackEvent('click', {
            event_category: category,
            event_label: action,
            element_type: element.tagName,
            element_text: element.textContent?.trim().substring(0, 50)
        });
    }

    trackGoogleAdsConversion(label, extraParams = {}) {
        const conversionId = this.config.googleAdsConversionId;
        if (!conversionId || !label || typeof gtag === 'undefined') {
            return;
        }

        gtag('event', 'conversion', {
            send_to: `${conversionId}/${label}`,
            ...extraParams
        });
        this.log('Google Ads conversion tracked:', `${conversionId}/${label}`);
    }

    /**
     * Track phone call
     */
    trackPhoneClick(phoneNumber) {
        this.trackGoogleAdsConversion(this.config.googleAdsPhoneLabel, {
            event_category: 'contact',
            event_label: 'phone'
        });

        // GA4
        this.trackEvent('call_clicked', {
            event_category: 'contact',
            event_label: 'phone',
            phone_number: phoneNumber
        });
        
        // Facebook Pixel - Contact event
        if (this.config.fbPixelId && typeof fbq !== 'undefined') {
            fbq('track', 'Contact', {
                content_name: 'Phone Call',
                content_category: 'Contact'
            });
        }

        // TikTok Pixel - Contact event
        if (this.config.tiktokPixelId && typeof ttq !== 'undefined') {
            ttq.track('Contact', { content_name: 'Phone Call' });
        }
    }

    /**
     * Track Zalo click
     */
    trackZaloClick(zaloNumber) {
        this.trackGoogleAdsConversion(this.config.googleAdsZaloLabel, {
            event_category: 'contact',
            event_label: 'zalo'
        });

        this.trackEvent('zalo_clicked', {
            event_category: 'contact',
            event_label: 'zalo',
            zalo_number: zaloNumber
        });
        
        // Facebook Pixel
        if (this.config.fbPixelId && typeof fbq !== 'undefined') {
            fbq('track', 'Contact', {
                content_name: 'Zalo Message',
                content_category: 'Contact'
            });
        }

        // TikTok Pixel
        if (this.config.tiktokPixelId && typeof ttq !== 'undefined') {
            ttq.track('Contact', { content_name: 'Zalo Message' });
        }
    }

    /**
     * Track form submission
     */
    trackFormSubmit(formName, formData = {}) {
        // GA4
        this.trackEvent('form_submit', {
            event_category: 'conversion',
            event_label: formName,
            ...formData
        });
        
        // Facebook Pixel - Lead event
        if (this.config.fbPixelId && typeof fbq !== 'undefined') {
            fbq('track', 'Lead', {
                content_name: formName,
                content_category: 'Form Submission'
            });
        }

        // TikTok Pixel - Form submission
        if (this.config.tiktokPixelId && typeof ttq !== 'undefined') {
            ttq.track('SubmitForm', { content_name: formName });
        }
    }

    /**
     * Track product view
     */
    trackProductView(productName, productPrice = null) {
        const params = {
            event_category: 'ecommerce',
            event_label: productName
        };
        
        if (productPrice) {
            params.value = productPrice;
            params.currency = 'VND';
        }
        
        this.trackEvent('view_item', params);
        
        // Facebook Pixel
        if (this.config.fbPixelId && typeof fbq !== 'undefined') {
            fbq('track', 'ViewContent', {
                content_name: productName,
                content_type: 'product',
                value: productPrice,
                currency: 'VND'
            });
        }

        // TikTok Pixel
        if (this.config.tiktokPixelId && typeof ttq !== 'undefined') {
            ttq.track('ViewContent', {
                content_name: productName,
                content_type: 'product',
                value: productPrice,
                currency: 'VND'
            });
        }
    }

    /**
     * Track add to cart
     */
    trackAddToCart(productName, productPrice = null) {
        const params = {
            event_category: 'ecommerce',
            event_label: productName
        };
        
        if (productPrice) {
            params.value = productPrice;
            params.currency = 'VND';
        }
        
        this.trackEvent('add_to_cart', params);
        
        // Facebook Pixel
        if (this.config.fbPixelId && typeof fbq !== 'undefined') {
            fbq('track', 'AddToCart', {
                content_name: productName,
                content_type: 'product',
                value: productPrice,
                currency: 'VND'
            });
        }

        // TikTok Pixel
        if (this.config.tiktokPixelId && typeof ttq !== 'undefined') {
            ttq.track('AddToCart', {
                content_name: productName,
                content_type: 'product',
                value: productPrice,
                currency: 'VND'
            });
        }
    }

    /**
     * Track scroll depth
     */
    trackScrollDepth(depth) {
        this.trackEvent('scroll', {
            event_category: 'engagement',
            event_label: `${depth}%`,
            value: depth
        });
    }

    /**
     * Setup automatic event tracking
     */
    setupAutoTracking() {
        // Track all phone links
        document.querySelectorAll('a[href^="tel:"]').forEach(link => {
            link.addEventListener('click', () => {
                const phone = link.href.replace('tel:', '');
                this.trackPhoneClick(phone);
            });
        });
        
        // Track all Zalo links
        document.querySelectorAll('a[href*="zalo.me"], a[href*="chat.zalo.me"]').forEach(link => {
            link.addEventListener('click', () => {
                const zalo = link.href.match(/\d+/)?.[0] || 'unknown';
                this.trackZaloClick(zalo);
            });
        });
        
        // Track all forms
        document.querySelectorAll('form').forEach(form => {
            form.addEventListener('submit', (e) => {
                const formName = form.id || form.className || 'unnamed_form';
                this.trackFormSubmit(formName);
            });
        });
        
        // Track CTA buttons
        document.querySelectorAll('.btn-buy, .btn-order, .cta-button, [class*="cta"]').forEach(btn => {
            btn.addEventListener('click', () => {
                const text = btn.textContent?.trim() || 'CTA Button';
                this.trackClick(btn, text, 'cta');
            });
        });
        
        // Track scroll depth
        this.setupScrollTracking();
        
        this.log('Auto-tracking setup complete');
    }

    /**
     * Setup scroll depth tracking
     */
    setupScrollTracking() {
        const scrollDepths = [25, 50, 75, 90, 100];
        const tracked = new Set();
        
        const trackScroll = () => {
            const scrollPercent = Math.round(
                (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
            );
            
            scrollDepths.forEach(depth => {
                if (scrollPercent >= depth && !tracked.has(depth)) {
                    tracked.add(depth);
                    this.trackScrollDepth(depth);
                }
            });
        };
        
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(trackScroll, 300);
        });
    }

    /**
     * Process queued events
     */
    processQueue() {
        while (this.eventQueue.length > 0) {
            const { eventName, params } = this.eventQueue.shift();
            this.trackEvent(eventName, params);
        }
    }

    /**
     * Debug logging
     */
    log(...args) {
        if (this.config.debug) {
            console.log('[AdvancedTracking]', ...args);
        }
    }
}

// Initialize from window config if available
if (typeof window !== 'undefined') {
    window.AdvancedTracking = AdvancedTracking;
    window.updateTrackingConsent = function(consentState) {
        if (window.tracker) {
            window.tracker.updateConsent(consentState);
        }
    };
    
    // Auto-initialize if config is present
    if (window.TRACKING_CONFIG) {
        window.tracker = new AdvancedTracking(window.TRACKING_CONFIG);
    }
}
