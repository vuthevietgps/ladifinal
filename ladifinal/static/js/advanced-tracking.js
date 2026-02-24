/**
 * Advanced Analytics & Tracking Library
 * Supports: Google Analytics 4, Facebook Pixel, TikTok Pixel, Custom Events
 * Version: 3.0
 */

class AdvancedTracking {
    constructor(config = {}) {
        this.config = {
            gaId: config.gaId || null,
            fbPixelId: config.fbPixelId || null,
            tiktokPixelId: config.tiktokPixelId || null,
            debug: config.debug || false,
            autoTrack: config.autoTrack !== false // Default true
        };
        
        this.initialized = false;
        this.eventQueue = [];
        
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
        
        // Initialize Facebook Pixel
        if (this.config.fbPixelId) {
            this.initFacebookPixel();
        }

        // Initialize TikTok Pixel
        if (this.config.tiktokPixelId) {
            this.initTikTokPixel();
        }

        // Auto-track page view
        this.trackPageView();
        
        // Setup auto event listeners
        this.setupAutoTracking();
        
        // Process queued events
        this.processQueue();
        
        this.initialized = true;
        this.log('Advanced Tracking initialized successfully');
    }

    /**
     * Initialize Google Analytics 4
     */
    initGA4() {
        if (typeof gtag === 'undefined') {
            // Load GA4 script
            const script = document.createElement('script');
            script.async = true;
            script.src = `https://www.googletagmanager.com/gtag/js?id=${this.config.gaId}`;
            document.head.appendChild(script);
            
            // Initialize dataLayer
            window.dataLayer = window.dataLayer || [];
            window.gtag = function() { dataLayer.push(arguments); };
            gtag('js', new Date());
            gtag('config', this.config.gaId, {
                'send_page_view': false // We'll send manually
            });
            
            this.log('GA4 initialized:', this.config.gaId);
        }
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
    trackPageView(pagePath = null) {
        const path = pagePath || window.location.pathname;
        
        // GA4
        if (this.config.gaId && typeof gtag !== 'undefined') {
            gtag('event', 'page_view', {
                page_path: path,
                page_title: document.title,
                page_location: window.location.href
            });
        }
        
        // Facebook Pixel
        if (this.config.fbPixelId && typeof fbq !== 'undefined') {
            fbq('track', 'PageView');
        }

        // TikTok Pixel
        if (this.config.tiktokPixelId && typeof ttq !== 'undefined') {
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

    /**
     * Track phone call
     */
    trackPhoneClick(phoneNumber) {
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
    
    // Auto-initialize if config is present
    if (window.TRACKING_CONFIG) {
        window.tracker = new AdvancedTracking(window.TRACKING_CONFIG);
    }
}
