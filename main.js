(function () {
    "use strict";

    var body = document.body;
    var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var revealItems = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
    var navToggle = document.querySelector("[data-nav-toggle]");
    var siteNav = document.querySelector("[data-site-nav]");

    function closeNavigation() {
        body.classList.remove("nav-open");
        if (navToggle) {
            navToggle.setAttribute("aria-expanded", "false");
        }
    }

    if (navToggle && siteNav) {
        navToggle.addEventListener("click", function () {
            var expanded = navToggle.getAttribute("aria-expanded") === "true";
            body.classList.toggle("nav-open", !expanded);
            navToggle.setAttribute("aria-expanded", String(!expanded));
        });

        siteNav.addEventListener("click", function (event) {
            if (event.target && event.target.matches("a")) {
                closeNavigation();
            }
        });

        document.addEventListener("keydown", function (event) {
            if (event.key === "Escape") {
                closeNavigation();
            }
        });
    }

    if (reduceMotion || !("IntersectionObserver" in window)) {
        revealItems.forEach(function (item) {
            item.classList.add("is-visible");
        });
    } else {
        var revealObserver = new IntersectionObserver(function (entries, observer) {
            entries.forEach(function (entry, index) {
                if (entry.isIntersecting) {
                    window.setTimeout(function () {
                        entry.target.classList.add("is-visible");
                    }, Math.min(index * 80, 240));
                    observer.unobserve(entry.target);
                }
            });
        }, { rootMargin: "0px 0px -12% 0px", threshold: 0.12 });

        revealItems.forEach(function (item) {
            revealObserver.observe(item);
        });
    }

    var navLinks = Array.prototype.slice.call(document.querySelectorAll(".site-nav a[href^='#']"));
    var sections = navLinks.map(function (link) {
        return document.querySelector(link.getAttribute("href"));
    }).filter(Boolean);

    function setActive(id) {
        navLinks.forEach(function (link) {
            var active = link.getAttribute("href") === "#" + id;
            link.classList.toggle("is-active", active);
            if (active) {
                link.setAttribute("aria-current", "true");
            } else {
                link.removeAttribute("aria-current");
            }
        });
    }

    if ("IntersectionObserver" in window && sections.length) {
        var navObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    setActive(entry.target.id);
                }
            });
        }, { rootMargin: "-38% 0px -56% 0px", threshold: 0 });

        sections.forEach(function (section) {
            navObserver.observe(section);
        });
    }
}());
