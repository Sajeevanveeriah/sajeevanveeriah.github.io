(function () {
    "use strict";

    var body = document.body;
    var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* ── Scroll progress bar ── */
    var progressBar = document.createElement("div");
    progressBar.className = "scroll-progress";
    progressBar.setAttribute("aria-hidden", "true");
    document.body.prepend(progressBar);

    function updateProgress() {
        var scrollTop = window.scrollY || document.documentElement.scrollTop;
        var docHeight = document.documentElement.scrollHeight - window.innerHeight;
        var pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        progressBar.style.width = pct.toFixed(1) + "%";
    }

    if (!reduceMotion) {
        window.addEventListener("scroll", updateProgress, { passive: true });
    }

    /* ── Mobile nav ── */
    var navToggle = document.querySelector("[data-nav-toggle]");
    var siteNav = document.querySelector("[data-site-nav]");

    function closeNavigation() {
        body.classList.remove("nav-open");
        if (navToggle) navToggle.setAttribute("aria-expanded", "false");
    }

    if (navToggle && siteNav) {
        navToggle.addEventListener("click", function () {
            var expanded = navToggle.getAttribute("aria-expanded") === "true";
            body.classList.toggle("nav-open", !expanded);
            navToggle.setAttribute("aria-expanded", String(!expanded));
        });

        siteNav.addEventListener("click", function (event) {
            if (event.target && event.target.matches("a")) closeNavigation();
        });

        document.addEventListener("keydown", function (event) {
            if (event.key === "Escape") closeNavigation();
        });
    }

    /* ── Intersection reveal (staggered) ── */
    var revealItems = Array.prototype.slice.call(document.querySelectorAll(".reveal"));

    if (reduceMotion || !("IntersectionObserver" in window)) {
        revealItems.forEach(function (item) { item.classList.add("is-visible"); });
    } else {
        var revealObserver = new IntersectionObserver(function (entries, observer) {
            entries.forEach(function (entry, index) {
                if (entry.isIntersecting) {
                    window.setTimeout(function () {
                        entry.target.classList.add("is-visible");
                    }, Math.min(index * 80, 280));
                    observer.unobserve(entry.target);
                }
            });
        }, { rootMargin: "0px 0px -10% 0px", threshold: 0.1 });

        revealItems.forEach(function (item) { revealObserver.observe(item); });
    }

    /* ── Active nav highlighting ── */
    var navLinks = Array.prototype.slice.call(document.querySelectorAll(".site-nav a[href^='#']"));
    var sections = navLinks.map(function (link) {
        return document.querySelector(link.getAttribute("href"));
    }).filter(Boolean);

    function setActive(id) {
        navLinks.forEach(function (link) {
            var active = link.getAttribute("href") === "#" + id;
            link.classList.toggle("is-active", active);
            if (active) link.setAttribute("aria-current", "true");
            else link.removeAttribute("aria-current");
        });
    }

    if ("IntersectionObserver" in window && sections.length) {
        var navObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) setActive(entry.target.id);
            });
        }, { rootMargin: "-38% 0px -56% 0px", threshold: 0 });

        sections.forEach(function (section) { navObserver.observe(section); });
    }

    /* ── Skills tab filter ── */
    var skillTabs = Array.prototype.slice.call(document.querySelectorAll(".skill-tab"));
    var skillCards = Array.prototype.slice.call(document.querySelectorAll(".stack-card[data-domain]"));

    skillTabs.forEach(function (tab) {
        tab.addEventListener("click", function () {
            var domain = tab.getAttribute("data-tab");
            skillTabs.forEach(function (t) {
                t.classList.remove("is-active");
                t.setAttribute("aria-selected", "false");
            });
            tab.classList.add("is-active");
            tab.setAttribute("aria-selected", "true");
            skillCards.forEach(function (card) {
                if (domain === "all" || card.getAttribute("data-domain") === domain) {
                    card.removeAttribute("data-hidden");
                } else {
                    card.setAttribute("data-hidden", "");
                }
            });
        });
    });

    /* ── Animated counters for hero stats ── */
    function animateCounter(el) {
        var target = parseInt(el.getAttribute("data-target"), 10);
        var duration = 1400;
        var start = null;
        function step(timestamp) {
            if (!start) start = timestamp;
            var progress = Math.min((timestamp - start) / duration, 1);
            var eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.floor(eased * target) + (progress < 1 ? "" : "+");
            if (progress < 1) requestAnimationFrame(step);
            else el.textContent = target + "+";
        }
        requestAnimationFrame(step);
    }

    if (!reduceMotion && "IntersectionObserver" in window) {
        var statNums = Array.prototype.slice.call(document.querySelectorAll(".stat-num[data-target]"));
        if (statNums.length) {
            var counterObserver = new IntersectionObserver(function (entries, observer) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        animateCounter(entry.target);
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });
            statNums.forEach(function (el) { counterObserver.observe(el); });
        }
    } else {
        Array.prototype.slice.call(document.querySelectorAll(".stat-num[data-target]")).forEach(function (el) {
            el.textContent = el.getAttribute("data-target") + "+";
        });
    }

    /* ── Capability badge stagger reveal ── */
    if (!reduceMotion && "IntersectionObserver" in window) {
        var capStrip = document.querySelector(".capability-strip");
        if (capStrip) {
            var badgeObserver = new IntersectionObserver(function (entries, observer) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("badges-visible");
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.15 });
            badgeObserver.observe(capStrip);
        }
    } else {
        var strip = document.querySelector(".capability-strip");
        if (strip) strip.classList.add("badges-visible");
    }

    /* ── Card tilt effect (desktop only, respects reduced-motion) ── */
    function initTilt() {
        if (reduceMotion) return;
        var isTouchDevice = window.matchMedia("(pointer: coarse)").matches;
        if (isTouchDevice) return;
        var tiltCards = Array.prototype.slice.call(document.querySelectorAll(".project-card, .stack-card, .domain-item"));
        tiltCards.forEach(function (card) {
            card.classList.add("tilt-card");
            card.addEventListener("mousemove", function (e) {
                var rect = card.getBoundingClientRect();
                var x = (e.clientX - rect.left) / rect.width - 0.5;
                var y = (e.clientY - rect.top) / rect.height - 0.5;
                card.style.transform = "perspective(800px) rotateY(" + (x * 5) + "deg) rotateX(" + (-y * 5) + "deg) translateY(-2px)";
            });
            card.addEventListener("mouseleave", function () {
                card.style.transform = "";
            });
        });
    }
    initTilt();

    /* ── Hero particle canvas ── */
    (function initParticles() {
        if (reduceMotion) return;
        var canvas = document.querySelector("[data-particles]");
        if (!canvas || !canvas.getContext) return;
        var ctx = canvas.getContext("2d");
        var particles = [];
        var PARTICLE_COUNT = 55;
        var RAF;

        function resize() {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        }

        function randomBetween(min, max) {
            return min + Math.random() * (max - min);
        }

        function createParticle() {
            return {
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                r: randomBetween(1.2, 3.2),
                vx: randomBetween(-0.22, 0.22),
                vy: randomBetween(-0.22, 0.22),
                alpha: randomBetween(0.15, 0.55)
            };
        }

        function init() {
            resize();
            particles = [];
            for (var i = 0; i < PARTICLE_COUNT; i++) particles.push(createParticle());
        }

        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(function (p) {
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = "rgba(232, 84, 43, " + p.alpha + ")";
                ctx.fill();
                p.x += p.vx;
                p.y += p.vy;
                if (p.x < -4) p.x = canvas.width + 4;
                if (p.x > canvas.width + 4) p.x = -4;
                if (p.y < -4) p.y = canvas.height + 4;
                if (p.y > canvas.height + 4) p.y = -4;
            });
            /* Draw faint connecting lines between nearby particles */
            for (var i = 0; i < particles.length; i++) {
                for (var j = i + 1; j < particles.length; j++) {
                    var dx = particles[i].x - particles[j].x;
                    var dy = particles[i].y - particles[j].y;
                    var dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 90) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = "rgba(232, 84, 43, " + ((1 - dist / 90) * 0.12) + ")";
                        ctx.lineWidth = 0.7;
                        ctx.stroke();
                    }
                }
            }
            RAF = requestAnimationFrame(draw);
        }

        /* Pause when hero is not visible */
        if ("IntersectionObserver" in window) {
            var heroEl = document.querySelector("#top");
            if (heroEl) {
                var heroObserver = new IntersectionObserver(function (entries) {
                    entries.forEach(function (entry) {
                        if (entry.isIntersecting) {
                            if (!RAF) RAF = requestAnimationFrame(draw);
                        } else {
                            cancelAnimationFrame(RAF);
                            RAF = null;
                        }
                    });
                }, { threshold: 0.01 });
                heroObserver.observe(heroEl);
            }
        }

        init();
        RAF = requestAnimationFrame(draw);

        var resizeTimer;
        window.addEventListener("resize", function () {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function () {
                cancelAnimationFrame(RAF);
                RAF = null;
                init();
                RAF = requestAnimationFrame(draw);
            }, 200);
        });
    }());

    /* ── Copy email to clipboard ── */
    (function initCopyEmail() {
        var emailLink = document.querySelector(".contact-panel a[href^='mailto:']");
        if (!emailLink) return;
        emailLink.setAttribute("title", "Click to copy email address");
        emailLink.addEventListener("click", function (e) {
            e.preventDefault();
            var email = emailLink.href.replace("mailto:", "");
            if (navigator.clipboard) {
                navigator.clipboard.writeText(email).then(function () {
                    var original = emailLink.textContent;
                    emailLink.textContent = "Copied!";
                    setTimeout(function () { emailLink.textContent = original; }, 2000);
                });
            } else {
                window.location.href = emailLink.href;
            }
        });
    }());
}());
