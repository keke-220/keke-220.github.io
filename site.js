(function () {
    "use strict";

    var routeAliases = {
        research: "publications"
    };
    var viewTitles = {
        about: "Xiaohan Zhang | Robotics & AI Researcher",
        experience: "Experience | Xiaohan Zhang",
        publications: "Publications | Xiaohan Zhang"
    };
    var root = document.documentElement;
    var themeToggle = document.querySelector("[data-theme-toggle]");
    var themeColorMeta = document.querySelector('meta[name="theme-color"]');
    var themeStorageKey = "xz-theme";
    var views = Array.from(document.querySelectorAll(".site-view"));
    var viewLinks = Array.from(document.querySelectorAll("[data-view-link]"));
    var motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    var networkConnection =
        navigator.connection ||
        navigator.mozConnection ||
        navigator.webkitConnection;
    var publicationPreviews = Array.from(
        document.querySelectorAll("video[data-publication-preview]")
    );
    var previewVisibility = new WeakMap();
    var previewObserver = null;
    var activeView = "about";

    function applyTheme(theme, persist) {
        var nextTheme = theme === "dark" ? "dark" : "light";
        var isLight = nextTheme === "light";
        var actionLabel = isLight ? "Switch to dark mode" : "Switch to light mode";

        root.dataset.theme = nextTheme;

        if (themeColorMeta) {
            themeColorMeta.content = isLight ? "#ffffff" : "#000000";
        }

        if (themeToggle) {
            themeToggle.setAttribute("aria-label", actionLabel);
            themeToggle.setAttribute("aria-pressed", String(!isLight));
            themeToggle.title = actionLabel;
        }

        if (persist) {
            try {
                localStorage.setItem(themeStorageKey, nextTheme);
            } catch (error) {
                // The visual theme still works when storage is unavailable.
            }
        }
    }

    function routeFromHash() {
        var hash = window.location.hash.slice(1);

        if (!hash) {
            return "about";
        }

        if (routeAliases[hash]) {
            return routeAliases[hash];
        }

        if (viewTitles[hash]) {
            return hash;
        }

        return null;
    }

    function previewsAreStatic() {
        return motionPreference.matches ||
            Boolean(networkConnection && networkConnection.saveData);
    }

    function restorePreviewPoster(video) {
        video.pause();

        if (video.hasAttribute("src")) {
            video.removeAttribute("src");
            video.load();
        }
    }

    function loadPreview(video) {
        if (!video.hasAttribute("src") && video.dataset.src) {
            video.src = video.dataset.src;
            video.load();
        }
    }

    function syncPreview(video) {
        var isNearViewport = previewObserver ?
            previewVisibility.get(video) === true :
            true;
        var shouldPlay =
            activeView === "publications" &&
            !document.hidden &&
            !previewsAreStatic() &&
            isNearViewport;

        if (!shouldPlay) {
            video.pause();
            return;
        }

        loadPreview(video);
        video.play().catch(function () {
            // Muted autoplay can still be restricted by browser policy.
        });
    }

    function syncPublicationPreviews() {
        publicationPreviews.forEach(syncPreview);
    }

    function handlePreviewPreferenceChange() {
        if (previewsAreStatic()) {
            publicationPreviews.forEach(restorePreviewPoster);
        }

        syncPublicationPreviews();
    }

    function initializePublicationPreviews() {
        if (!publicationPreviews.length) {
            return;
        }

        if (typeof window.IntersectionObserver === "function") {
            previewObserver = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    previewVisibility.set(entry.target, entry.isIntersecting);
                    syncPreview(entry.target);
                });
            }, {
                rootMargin: "320px 0px",
                threshold: 0.01
            });

            publicationPreviews.forEach(function (video) {
                previewVisibility.set(video, false);
                previewObserver.observe(video);
            });
        }

        if (motionPreference.addEventListener) {
            motionPreference.addEventListener("change", handlePreviewPreferenceChange);
        } else {
            motionPreference.addListener(handlePreviewPreferenceChange);
        }

        if (networkConnection && networkConnection.addEventListener) {
            networkConnection.addEventListener("change", handlePreviewPreferenceChange);
        }

        document.addEventListener("visibilitychange", syncPublicationPreviews);
        window.addEventListener("pagehide", function () {
            publicationPreviews.forEach(function (video) {
                video.pause();
            });
        });
    }

    function renderRoute() {
        var route = routeFromHash();

        if (!route) {
            return;
        }

        activeView = route;
        document.body.dataset.view = route;
        document.title = viewTitles[route];

        views.forEach(function (view) {
            var isActive = view.dataset.view === route;
            view.classList.toggle("is-active", isActive);
            view.hidden = !isActive;
        });

        viewLinks.forEach(function (link) {
            if (link.dataset.viewLink === route) {
                link.setAttribute("aria-current", "page");
            } else {
                link.removeAttribute("aria-current");
            }
        });

        if (window.location.hash === "#research") {
            window.history.replaceState(null, "", "#publications");
        }

        window.scrollTo(0, 0);
        syncPublicationPreviews();
    }

    viewLinks.forEach(function (link) {
        link.addEventListener("click", function (event) {
            if (link.dataset.viewLink === activeView) {
                event.preventDefault();
                window.scrollTo({
                    top: 0,
                    left: 0,
                    behavior: motionPreference.matches ? "auto" : "smooth"
                });
            }
        });
    });

    if (themeToggle) {
        themeToggle.addEventListener("click", function () {
            var nextTheme = root.dataset.theme === "light" ? "dark" : "light";

            applyTheme(nextTheme, true);
        });
    }

    window.addEventListener("storage", function (event) {
        if (event.key === themeStorageKey) {
            applyTheme(event.newValue, false);
        }
    });

    window.addEventListener("hashchange", renderRoute);
    initializePublicationPreviews();
    applyTheme(root.dataset.theme, false);
    renderRoute();
}());
