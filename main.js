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

  // Entrada cinematográfica de la imagen principal: parte desde fuera de la pantalla y se estabiliza.
  const heroMedia = document.querySelector(".hero-photo-device");
  if (heroMedia) {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      heroMedia.classList.add("hero-media-visible");
    } else {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => heroMedia.classList.add("hero-media-visible"));
      });
    }
  }

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

  // V1.8 cinematic typography: two deliberate motion languages.
  // 1) Word-by-word reveal for the commercial/impact phrases.
  // 2) Full phrase entering from the right for transition/process phrases.
  const wordTargets = document.querySelectorAll('.motion-words');
  const slideTargets = document.querySelectorAll('.motion-slide-right');

  const wrapWords = (el) => {
    if (el.dataset.motionPrepared) return;
    el.dataset.motionPrepared = '1';

    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    const textNodes = [];
    while (walker.nextNode()) textNodes.push(walker.currentNode);

    let index = 0;
    textNodes.forEach(node => {
      if (!node.nodeValue.trim()) return;
      const frag = document.createDocumentFragment();
      node.nodeValue.split(/(\s+)/).forEach(part => {
        if (/^\s+$/.test(part) || !part) {
          frag.appendChild(document.createTextNode(part));
          return;
        }
        const word = document.createElement('span');
        word.className = 'motion-word';
        word.textContent = part;
        word.style.setProperty('--word-index', index++);
        frag.appendChild(word);
      });
      node.parentNode.replaceChild(frag, node);
    });
    el.classList.add('motion-ready');
  };

  wordTargets.forEach(wrapWords);
  slideTargets.forEach(el => el.classList.add('motion-ready'));

  if (reduceMotion) {
    [...wordTargets, ...slideTargets].forEach(el => el.classList.add('is-visible'));
  } else if ('IntersectionObserver' in window) {
    const motionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        // La frase se activa al llegar a su zona de lectura, no al cargar el sitio.
        entry.target.classList.add('is-visible');
        motionObserver.unobserve(entry.target);
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -10% 0px' });

    [...wordTargets, ...slideTargets].forEach(el => motionObserver.observe(el));
  } else {
    [...wordTargets, ...slideTargets].forEach(el => el.classList.add('is-visible'));
  }

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
