/* Sajeevan Veeriah, robotics portfolio
   Small vanilla JS: scroll reveal and active nav indicator.
   Honours prefers-reduced-motion and degrades gracefully without JS. */
(function () {
    "use strict";

    var reduceMotion = window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* ----- Scroll reveal ----- */
    var revealables = Array.prototype.slice.call(
        document.querySelectorAll(".reveal")
    );

    if (reduceMotion || !("IntersectionObserver" in window)) {
        revealables.forEach(function (el) {
            el.classList.add("is-visible");
        });
    } else {
        var revealObserver = new IntersectionObserver(function (entries, obs) {
            entries.forEach(function (entry, i) {
                if (entry.isIntersecting) {
                    var el = entry.target;
                    // gentle stagger within a viewport batch
                    window.setTimeout(function () {
                        el.classList.add("is-visible");
                    }, Math.min(i * 70, 280));
                    obs.unobserve(el);
                }
            });
        }, { rootMargin: "0px 0px -10% 0px", threshold: 0.12 });

        revealables.forEach(function (el) {
            revealObserver.observe(el);
        });
    }

    /* ----- Active nav indicator ----- */
    var navLinks = Array.prototype.slice.call(
        document.querySelectorAll(".nav-links a")
    );
    var sections = navLinks
        .map(function (link) {
            var id = link.getAttribute("href").slice(1);
            return document.getElementById(id);
        })
        .filter(Boolean);

    function setActive(id) {
        navLinks.forEach(function (link) {
            var isActive = link.getAttribute("href") === "#" + id;
            link.classList.toggle("is-active", isActive);
            if (isActive) {
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
        }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });

        sections.forEach(function (section) {
            navObserver.observe(section);
        });
    }
}());
