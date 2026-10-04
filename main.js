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

    showSlide(0);
    start();
  }
});


// V1.7 premium interaction layer
(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Sequential Word Reveal + Blur/Slide + Overshoot.
  const targets = document.querySelectorAll('.hero h1, .video-head h2, #productos h2, #soluciones h2, #servicios h2, #precios h2');
  targets.forEach((el, blockIndex) => {
    if (el.dataset.kineticReady) return;
    el.dataset.kineticReady = '1';
    const nodes = [...el.childNodes];
    let wordIndex = 0;
    nodes.forEach(node => {
      if (node.nodeType === Node.TEXT_NODE) {
        const frag = document.createDocumentFragment();
        node.textContent.split(/(\s+)/).forEach(part => {
          if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
          if (!part) return;
          const s = document.createElement('span'); s.className='kinetic-word'; s.textContent=part;
          s.style.animationDelay = `${Math.min(3.15, wordIndex * .11 + blockIndex*.08)}s`;
          if (/soluciones|digitales/i.test(part)) s.classList.add('impact');
          frag.appendChild(s); wordIndex++;
        });
        node.replaceWith(frag);
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const text = node.textContent;
        node.textContent='';
        text.split(/(\s+)/).forEach(part => {
          if (/^\s+$/.test(part)) { node.appendChild(document.createTextNode(part)); return; }
          if (!part) return;
          const s=document.createElement('span'); s.className='kinetic-word impact'; s.textContent=part;
          s.style.animationDelay=`${Math.min(3.35, wordIndex*.11 + blockIndex*.08 + .16)}s`;
          node.appendChild(s); wordIndex++;
        });
      }
    });
    if (reduceMotion) el.querySelectorAll('.kinetic-word').forEach(w => {w.style.animation='none';w.style.opacity='1';w.style.filter='none';w.style.transform='none';});
  });

  // Contextual lighting follows the pointer on desktop.
  if (!reduceMotion) {
    document.querySelectorAll('.card,.solution,.price').forEach(card => {
      card.addEventListener('pointermove', e => {
        const r=card.getBoundingClientRect();
        card.style.setProperty('--mx', `${((e.clientX-r.left)/r.width)*100}%`);
        card.style.setProperty('--my', `${((e.clientY-r.top)/r.height)*100}%`);
      });
      card.addEventListener('pointerleave', () => {card.style.setProperty('--mx','50%');card.style.setProperty('--my','50%');});
    });
  }

  // Scroll narrative: discover → activate → process → advance.
  const stages=[...document.querySelectorAll('.scroll-stage')];
  const stageObserver=new IntersectionObserver(entries=>{
    entries.forEach(entry=>entry.target.classList.toggle('stage-active',entry.isIntersecting));
  },{threshold:.18});
  stages.forEach(s=>stageObserver.observe(s));
  const updateProgress=()=>{
    stages.forEach(s=>{
      const r=s.getBoundingClientRect(), h=window.innerHeight;
      const p=Math.max(0,Math.min(1,(h-r.top)/(h+r.height)));
      s.style.setProperty('--stage-progress',p.toFixed(3));
    });
  };
  window.addEventListener('scroll',updateProgress,{passive:true}); updateProgress();
})();
