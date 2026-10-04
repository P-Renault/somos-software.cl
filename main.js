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
});
