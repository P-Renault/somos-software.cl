// Somos Software · somosoftware.cl
// V1 — comportamiento comercial y UX, sin lógica de aplicaciones.

document.addEventListener("DOMContentLoaded", () => {
  // Scroll suave para enlaces internos.
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener("click", event => {
      const target = document.querySelector(link.getAttribute("href"));
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  // Resaltar sección activa en la navegación.
  const sections = [...document.querySelectorAll("main section[id]")];
  const navLinks = [...document.querySelectorAll(".links a[href^='#']")];

  const updateNav = () => {
    const y = window.scrollY + 120;
    let current = "";

    sections.forEach(section => {
      if (section.offsetTop <= y) current = section.id;
    });

    navLinks.forEach(link => {
      link.classList.toggle(
        "active",
        link.getAttribute("href") === `#${current}`
      );
    });
  };

  window.addEventListener("scroll", updateNav, { passive: true });
  updateNav();

  // Animación de entrada discreta para bloques principales.
  const revealItems = document.querySelectorAll(
    ".card, .solution, .price, .case, .process, .bridge, .final"
  );

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 }
    );

    revealItems.forEach(item => {
      item.classList.add("reveal");
      observer.observe(item);
    });
  }

  // Año automático del footer.
  const footerYear = document.querySelector(".copy span");
  if (footerYear) {
    footerYear.textContent = `© ${new Date().getFullYear()} Somos Software. Todos los derechos reservados.`;
  }

  // Full-width hero carousel: three supplied 1536×576 images.
  const carousel = document.querySelector(".hero-carousel");
  if (carousel) {
    const slides = [...carousel.querySelectorAll(".carousel-slide")];
    const dots = [...carousel.querySelectorAll(".carousel-dot")];
    const prev = carousel.querySelector(".carousel-control.prev");
    const next = carousel.querySelector(".carousel-control.next");
    let current = 0;
    let timer;

    const showSlide = index => {
      current = (index + slides.length) % slides.length;
      slides.forEach((slide, i) => slide.classList.toggle("is-active", i === current));
      dots.forEach((dot, i) => dot.classList.toggle("is-active", i === current));
    };

    const start = () => {
      clearInterval(timer);
      timer = setInterval(() => showSlide(current + 1), 6000);
    };

    prev?.addEventListener("click", () => { showSlide(current - 1); start(); });
    next?.addEventListener("click", () => { showSlide(current + 1); start(); });
    dots.forEach((dot, i) => dot.addEventListener("click", () => { showSlide(i); start(); }));

    carousel.addEventListener("mouseenter", () => clearInterval(timer));
    carousel.addEventListener("mouseleave", start);
    carousel.addEventListener("focusin", () => clearInterval(timer));
    carousel.addEventListener("focusout", start);
    carousel.addEventListener("carousel:pause", () => clearInterval(timer));
    carousel.addEventListener("carousel:resume", start);

    showSlide(0);
    start();
  }
});


// V2 motion + mobile navigation layer.
document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector('.top');
  const menuBtn = document.querySelector('.menu-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');

  const closeMenu = () => {
    if (!menuBtn || !mobileMenu) return;
    menuBtn.classList.remove('is-open');
    menuBtn.setAttribute('aria-expanded','false');
    mobileMenu.classList.remove('is-open');
    mobileMenu.setAttribute('aria-hidden','true');
  };
  menuBtn?.addEventListener('click', () => {
    const open = !mobileMenu.classList.contains('is-open');
    menuBtn.classList.toggle('is-open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    mobileMenu.classList.toggle('is-open', open);
    mobileMenu.setAttribute('aria-hidden', String(!open));
  });
  mobileMenu?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });

  const syncHeader = () => header?.classList.toggle('is-scrolled', window.scrollY > 12);
  window.addEventListener('scroll', syncHeader, {passive:true});
  syncHeader();

  const motionTargets = document.querySelectorAll(
    '.reveal-on-scroll, .reveal-stagger > *, main section > .wrap > .sectionHead, main section > .wrap > .grid4, main section > .wrap > .solutionGrid, main section > .wrap > .priceGrid, main section > .wrap > .processGrid, main section > .wrap > .bridge, main section > .wrap > .final'
  );
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-inview');
          io.unobserve(entry.target);
        }
      });
    }, {threshold:0.10, rootMargin:'0px 0px -8% 0px'});
    motionTargets.forEach(el => io.observe(el));
  } else motionTargets.forEach(el => el.classList.add('is-inview'));

  // Pause the hero carousel while it is off-screen; resume when visible.
  const carousel = document.querySelector('.hero-carousel');
  if (carousel && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        carousel.dispatchEvent(new CustomEvent(entry.isIntersecting ? 'carousel:resume' : 'carousel:pause'));
      });
    }, {threshold:0.05});
    observer.observe(carousel);
  }
});
