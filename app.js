document.addEventListener("DOMContentLoaded", () => {
  // Scroll suave al hacer clic en el menú
  document.querySelectorAll(".menu-link").forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(
        this.getAttribute("href")
      );
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  // Sistema de animaciones mejorado
  const animateOnScroll = () => {
    // Animaciones para elementos individuales
    const elements = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(
              "opacity-100",
              "translate-y-0"
            );
            entry.target.classList.remove(
              "opacity-0",
              "translate-y-8"
            );
            // Añadir efecto de rotación para cards
            if (entry.target.closest(".grid")) {
              entry.target.style.transitionDelay =
                Math.random() * 0.3 + "s";
            }
          }
        });
      },
      { threshold: 0.2 }
    );

    elements.forEach((el) => {
      el.classList.add(
        "opacity-0",
        "translate-y-8",
        "transition-all",
        "duration-700"
      );
      observer.observe(el);
    });

    // Animaciones para secciones completas
    const sections = document.querySelectorAll(".reveal-section");
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.transform = "scale(1)";
            entry.target.style.opacity = "1";
          }
        });
      },
      { threshold: 0.1 }
    );

    sections.forEach((section) => {
      section.style.transform = "scale(0.95)";
      section.style.opacity = "0";
      section.style.transition = "all 1s ease-out";
      sectionObserver.observe(section);
    });
  };

  // Inicializar animaciones
  animateOnScroll();

  // Efecto Parallax Mejorado
  const parallaxElements = document.querySelectorAll(".parallax");

  const applyParallax = () => {
    parallaxElements.forEach((element) => {
      // Obtener la sección padre
      const section = element.closest("section");
      if (!section) return;

      // Calcular la posición relativa de la sección en la ventana
      const sectionRect = section.getBoundingClientRect();
      const sectionTop = sectionRect.top;
      const sectionHeight = sectionRect.height;
      const windowHeight = window.innerHeight;

      // Solo aplicar parallax si la sección está visible
      if (sectionTop < windowHeight && sectionTop > -sectionHeight) {
        // Calcular el progreso del scroll dentro de la sección
        const progress =
          (windowHeight - sectionTop) /
          (windowHeight + sectionHeight);
        const speed = parseFloat(element.dataset.speed) || 1;

        // Limitar el rango del movimiento
        const maxMove = 50; // píxeles máximos de movimiento
        const movement = Math.max(
          Math.min(progress * maxMove * (speed - 1), maxMove),
          -maxMove
        );

        // Aplicar la transformación con límites
        element.style.transform = `translate3d(0, ${movement}px, 0)`;
      }
    });
  };

  // Manejar el scroll con throttling para mejor rendimiento
  let scrollTimeout;
  window.addEventListener("scroll", () => {
    if (!scrollTimeout) {
      scrollTimeout = setTimeout(() => {
        requestAnimationFrame(applyParallax);
        scrollTimeout = null;
      }, 16); // aproximadamente 60fps
    }
  });

  // Aplicar parallax inicial
  applyParallax();

  // Resetear posiciones al recargar o volver a la página
  window.addEventListener("beforeunload", () => {
    parallaxElements.forEach((element) => {
      element.style.transform = "translate3d(0, 0, 0)";
    });
  });
});

// Animación del header
document.addEventListener("DOMContentLoaded", () => {
  // --- Toggle menú móvil ---
  const toggle = document.getElementById("nav-toggle");
  const mobileNav = document.getElementById("mobile-nav");
  const icoOpen = document.getElementById("icon-open");
  const icoClose = document.getElementById("icon-close");

  if (toggle && mobileNav) {
    toggle.addEventListener("click", () => {
      const isOpen = mobileNav.classList.toggle("hidden") === false;
      toggle.setAttribute("aria-expanded", String(isOpen));
      icoOpen.classList.toggle("hidden", isOpen);
      icoClose.classList.toggle("hidden", !isOpen);
    });

    // Cerrar al hacer clic en un link
    mobileNav.querySelectorAll("a.menu-link").forEach((a) => {
      a.addEventListener("click", () => {
        mobileNav.classList.add("hidden");
        toggle.setAttribute("aria-expanded", "false");
        icoOpen.classList.remove("hidden");
        icoClose.classList.add("hidden");
      });
    });
  }
});
