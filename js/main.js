/**
 * main.js
 * Core interactivity for Golla Ankarao's portfolio
 * - Custom cursor
 * - Typed text effect
 * - Navbar scroll behavior + active link tracking
 * - Scroll counter animation for hero stats
 * - Skill bars animation (IntersectionObserver)
 * - 3D tilt effect on project cards
 * - Certificate modal
 * - Contact form validation
 * - Scroll-reveal animations
 * - Scroll-to-top button
 * - Hamburger menu
 */

document.addEventListener('DOMContentLoaded', () => {

    // ── 1. Custom Cursor ──────────────────────────────────────
    const cursor = document.getElementById('cursor');
    const follower = document.getElementById('cursor-follower');

    if (cursor && follower) {
        let fx = 0, fy = 0;
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });
        function animateCursor() {
            const tx = parseFloat(cursor.style.left) || 0;
            const ty = parseFloat(cursor.style.top) || 0;
            fx += (tx - fx) * 0.12;
            fy += (ty - fy) * 0.12;
            follower.style.left = fx + 'px';
            follower.style.top = fy + 'px';
            requestAnimationFrame(animateCursor);
        }
        animateCursor();
    }

    // ── 2. Typed Text Effect ──────────────────────────────────
    const typedEl = document.getElementById('typed-text');
    if (typedEl) {
        const strings = [
            'Machine Learning Enthusiast',
            'Python Developer',
            'Cybersecurity Learner',
            'Data Science Explorer',
            'AI Problem Solver',
        ];
        let si = 0, ci = 0, deleting = false;
        function type() {
            const current = strings[si];
            if (deleting) {
                typedEl.textContent = current.substring(0, ci - 1);
                ci--;
                if (ci === 0) {
                    deleting = false;
                    si = (si + 1) % strings.length;
                    setTimeout(type, 400);
                    return;
                }
            } else {
                typedEl.textContent = current.substring(0, ci + 1);
                ci++;
                if (ci === current.length) {
                    deleting = true;
                    setTimeout(type, 1800);
                    return;
                }
            }
            setTimeout(type, deleting ? 45 : 90);
        }
        setTimeout(type, 600);
    }

    // ── 3. Navbar Scroll Behavior ─────────────────────────────
    const navbar = document.getElementById('navbar');
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    function updateNav() {
        if (!navbar) return;
        const scrolled = window.scrollY > 60;
        navbar.classList.toggle('scrolled', scrolled);

        // Active link tracking
        let current = '';
        sections.forEach((s) => {
            if (window.scrollY >= s.offsetTop - 120) current = s.id;
        });
        navLinks.forEach((link) => {
            const href = link.getAttribute('href').replace('#', '');
            link.classList.toggle('active', href === current);
        });
    }
    window.addEventListener('scroll', updateNav, { passive: true });
    updateNav();

    // Smooth scroll for nav links
    navLinks.forEach((link) => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(link.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth' });
            // close mobile menu
            document.getElementById('nav-links')?.classList.remove('open');
            document.getElementById('hamburger')?.classList.remove('active');
        });
    });

    // ── 4. Hamburger Menu ─────────────────────────────────────
    const hamburger = document.getElementById('hamburger');
    const navLinksEl = document.getElementById('nav-links');
    if (hamburger && navLinksEl) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinksEl.classList.toggle('open');
        });
    }

    // ── 5. Hero Counter Animation ─────────────────────────────
    const statNums = document.querySelectorAll('.stat-num[data-count]');
    let statsAnimated = false;

    function animateCounters() {
        if (statsAnimated) return;
        statsAnimated = true;
        statNums.forEach((el) => {
            const target = parseInt(el.dataset.count, 10);
            let current = 0;
            const increment = Math.ceil(target / 40);
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) { current = target; clearInterval(timer); }
                el.textContent = current + '+';
            }, 40);
        });
    }

    const heroObs = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) animateCounters();
    }, { threshold: 0.5 });
    const heroSection = document.getElementById('home');
    if (heroSection) heroObs.observe(heroSection);

    // ── 6. Skill Bar Animation ────────────────────────────────
    const skillFills = document.querySelectorAll('.skill-fill');
    const skillObs = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                skillObs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    skillFills.forEach((f) => skillObs.observe(f));

    // ── 7. Scroll Reveal ─────────────────────────────────────
    const revealEls = document.querySelectorAll(
        '.about-card, .about-info, .project-card, .cert-card, ' +
        '.resume-preview, .resume-actions, .portfolio-item, ' +
        '.timeline-item, .contact-link-item, .contact-form'
    );
    revealEls.forEach((el) => el.classList.add('reveal'));

    const revealObs = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach((el) => revealObs.observe(el));

    // ── 8. 3D Tilt Effect on Cards ───────────────────────────
    document.querySelectorAll('.tilt-card').forEach((card) => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const cx = rect.width / 2;
            const cy = rect.height / 2;
            const rotX = ((y - cy) / cy) * -8;
            const rotY = ((x - cx) / cx) * 8;
            card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(4px)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });

    // ── 9. Certificate Modal ──────────────────────────────────
    const certData = {
        cert1: { title: 'Python for Data Science', issuer: 'Coursera / IBM', date: '2024' },
        cert2: { title: 'Machine Learning Fundamentals', issuer: 'Google / Coursera', date: '2024' },
        cert3: { title: 'Cybersecurity Essentials', issuer: 'Cisco NetAcad', date: '2024' },
        cert4: { title: 'Data Analysis with Python', issuer: 'freeCodeCamp', date: '2023' },
        cert5: { title: 'Deep Learning Specialization', issuer: 'DeepLearning.AI', date: '2024' },
        cert6: { title: 'Web Development Bootcamp', issuer: 'Udemy', date: '2023' },
        cert7: { title: 'Ethical Hacking Basics', issuer: 'EC-Council', date: '2025' },
        cert8: { title: 'Advanced Python Programming', issuer: 'Udacity', date: '2025' },
    };

    const modal = document.getElementById('cert-modal');
    const modalClose = document.getElementById('modal-close');
    const mTitle = document.getElementById('modal-title');
    const mIssuer = document.getElementById('modal-issuer');
    const mDate = document.getElementById('modal-date');

    document.querySelectorAll('.cert-card').forEach((card) => {
        card.addEventListener('click', () => {
            const key = card.dataset.cert;
            const data = certData[key];
            if (!data || !modal) return;
            mTitle.textContent = data.title;
            mIssuer.textContent = '🏢 ' + data.issuer;
            mDate.textContent = '📅 ' + data.date;
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    function closeModal() {
        modal?.classList.remove('active');
        document.body.style.overflow = '';
    }
    modalClose?.addEventListener('click', closeModal);
    modal?.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

    // ── 10. Contact Form ─────────────────────────────────────
    const form = document.getElementById('contact-form');
    const submitBtn = document.getElementById('form-submit');
    const successMsg = document.getElementById('form-success');

    function validateField(input) {
        const group = input.closest('.form-group');
        let valid = true;
        if (input.type === 'email') {
            valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim());
        } else {
            valid = input.value.trim().length > 0;
        }
        group?.classList.toggle('invalid', !valid);
        return valid;
    }

    form?.querySelectorAll('.form-input').forEach((input) => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => {
            if (input.closest('.form-group')?.classList.contains('invalid')) {
                validateField(input);
            }
        });
    });

    form?.addEventListener('submit', (e) => {
        e.preventDefault();
        const inputs = form.querySelectorAll('.form-input');
        let allValid = true;
        inputs.forEach((inp) => { if (!validateField(inp)) allValid = false; });
        if (!allValid) return;

        submitBtn?.classList.add('sending');
        setTimeout(() => {
            submitBtn?.classList.remove('sending');
            successMsg?.classList.add('show');
            form.reset();
            inputs.forEach((inp) => inp.closest('.form-group')?.classList.remove('invalid'));
            setTimeout(() => successMsg?.classList.remove('show'), 5000);
        }, 1600);
    });

    // ── 11. Scroll-to-Top Button ──────────────────────────────
    const scrollTopBtn = document.getElementById('scroll-top');
    window.addEventListener('scroll', () => {
        scrollTopBtn?.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });
    scrollTopBtn?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

    // ── 12. Smooth staggered reveal for grids ────────────────
    document.querySelectorAll('.certs-grid .cert-card, .projects-grid .project-card, .portfolio-grid .portfolio-item').forEach((el, i) => {
        el.style.transitionDelay = (i % 4) * 80 + 'ms';
    });

});
