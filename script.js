
document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  // =========================================
  // 1. ELEMENT SELECTORS
  // =========================================

  const menuToggle = document.getElementById("menuToggle");
  const navigation = document.getElementById("navigation");
  const navLinks = document.querySelectorAll(".nav-link");

  // OUR WORK
  const galleryButtons = document.querySelectorAll(".project-view");
  const workFilters = document.querySelectorAll(".work-filter");
  const workCards = document.querySelectorAll(".work-card");

  // LIGHTBOX
  const lightbox = document.getElementById("lightbox");
  const lightboxImage = document.getElementById("lightboxImage");
  const lightboxClose = document.getElementById("lightboxClose");

  // BEFORE & AFTER
  const comparisonRange = document.getElementById("comparisonRange");
  const beforeAfterFrame = document.getElementById("beforeAfterFrame");

  // FOOTER
  const yearElement = document.getElementById("currentYear");

  // WHATSAPP
  const whatsappLinks = document.querySelectorAll(".whatsapp-link");


  // =========================================
  // 2. MOBILE NAVIGATION
  // =========================================

  function isMobileNavigation() {
    return window.innerWidth <= 760;
  }

  function openNavigation() {
    if (!menuToggle || !navigation) return;

    navigation.classList.add("open");

    menuToggle.setAttribute("aria-expanded", "true");
    menuToggle.setAttribute("aria-label", "Tutup navigasi");
  }

  function closeNavigation() {
    if (!menuToggle || !navigation) return;

    navigation.classList.remove("open");

    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Buka navigasi");
  }

  function toggleNavigation() {
    if (!menuToggle || !navigation) return;

    const isOpen = navigation.classList.contains("open");

    if (isOpen) {
      closeNavigation();
    } else {
      openNavigation();
    }
  }

  if (menuToggle && navigation) {

    // Buka dan tutup menu
    menuToggle.addEventListener("click", (event) => {
      event.stopPropagation();
      toggleNavigation();
    });

    // Tutup menu setelah link dipilih
    navigation.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeNavigation);
    });

    // Tutup menu ketika klik di luar navigasi
    document.addEventListener("click", (event) => {
      const clickedInside =
        navigation.contains(event.target) ||
        menuToggle.contains(event.target);

      if (!clickedInside) {
        closeNavigation();
      }
    });

    // Tutup menu ketika berubah ke desktop
    window.addEventListener("resize", () => {
      if (!isMobileNavigation()) {
        closeNavigation();
      }
    });
  }


  // =========================================
  // 3. ACTIVE NAVIGATION ON SCROLL
  // =========================================

  const sections = document.querySelectorAll("main section[id]");

  function updateActiveNavigation() {
    if (!sections.length || !navLinks.length) return;

    const scrollPosition = window.scrollY + 150;
    let currentSection = sections[0].id;

    sections.forEach((section) => {
      const sectionTop =
        section.getBoundingClientRect().top + window.scrollY;

      if (scrollPosition >= sectionTop) {
        currentSection = section.id;
      }
    });

    // Aktifkan section terakhir ketika mencapai bawah halaman
    const reachedBottom =
      window.innerHeight + window.scrollY >=
      document.documentElement.scrollHeight - 5;

    if (reachedBottom) {
      currentSection = sections[sections.length - 1].id;
    }

    navLinks.forEach((link) => {
      const isActive =
        link.getAttribute("href") === `#${currentSection}`;

      link.classList.toggle("active", isActive);

      if (isActive) {
        link.setAttribute("aria-current", "location");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  let scrollScheduled = false;

  function handleScroll() {
    if (scrollScheduled) return;

    scrollScheduled = true;

    window.requestAnimationFrame(() => {
      updateActiveNavigation();
      scrollScheduled = false;
    });
  }

  window.addEventListener("scroll", handleScroll, {
    passive: true
  });

  window.addEventListener("resize", updateActiveNavigation);

  updateActiveNavigation();


  // =========================================
  // 4. WHATSAPP BOOKING
  // =========================================

  // GANTI dengan nomor WhatsApp bisnis sebenarnya.
  // Format: 628xxxxxxxxxx
  // Tanpa tanda +, spasi, atau strip.

  const whatsappNumber = "6281234567890";

  const bookingMessage = [
    "Halo AUTOCARE STUDIO!",
    "",
    "Saya ingin melakukan booking layanan detailing.",
    "",
    "Nama:",
    "Jenis Mobil:",
    "Layanan:",
    "Tanggal Booking:",
    "",
    "Mohon informasi lebih lanjut. Terima kasih!"
  ].join("\n");

  function createWhatsAppURL() {
    const cleanNumber = whatsappNumber.replace(/\D/g, "");

    if (!cleanNumber || cleanNumber.length < 10 || cleanNumber.length > 15) {
      console.error("Nomor WhatsApp tidak valid.");
      return null;
    }

    return (
      `https://wa.me/${cleanNumber}?text=` +
      encodeURIComponent(bookingMessage)
    );
  }

  const whatsappURL = createWhatsAppURL();

  whatsappLinks.forEach((link) => {
    if (!whatsappURL) return;

    link.href = whatsappURL;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  });


  // =========================================
  // 5. OUR WORK — PROJECT FILTER
  // =========================================

  if (workFilters.length && workCards.length) {

    workFilters.forEach((filterButton) => {
      filterButton.addEventListener("click", () => {

        const selectedCategory = filterButton.dataset.filter;

        // Perbarui tombol aktif
        workFilters.forEach((button) => {
          const isActive = button === filterButton;

          button.classList.toggle("active", isActive);
          button.setAttribute("aria-pressed", String(isActive));
        });

        // Tampilkan project sesuai kategori
        workCards.forEach((card) => {
          const cardCategory = card.dataset.category;

          const shouldShow =
            selectedCategory === "all" ||
            cardCategory === selectedCategory;

          card.classList.toggle("is-hidden", !shouldShow);
        });

      });
    });

  }


  // =========================================
  // 6. LIGHTBOX — OPEN & CLOSE PROJECT IMAGE
  // =========================================

  let previousFocusedElement = null;

  function isLightboxOpen() {
    return Boolean(
      lightbox &&
      lightbox.classList.contains("open")
    );
  }

  function openLightbox(button) {
    if (!lightbox || !lightboxImage || !button) return;

    const imagePath = button.dataset.image;
    const cardImage = button.querySelector("img");

    if (!imagePath) {
      console.error("Path gambar project tidak ditemukan.");
      return;
    }

    previousFocusedElement = document.activeElement;

    lightboxImage.src = imagePath;
    lightboxImage.alt = cardImage
      ? cardImage.alt
      : "Project AUTOCARE STUDIO";

    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");

    document.body.classList.add("lightbox-open");

    // Pindahkan fokus ke tombol close
    if (lightboxClose) {
      lightboxClose.focus();
    }
  }

  function closeLightbox() {
    if (!lightbox || !lightboxImage) return;

    if (!isLightboxOpen()) return;

    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");

    document.body.classList.remove("lightbox-open");

    // Kosongkan gambar setelah ditutup
    lightboxImage.removeAttribute("src");
    lightboxImage.alt = "";

    // Kembalikan fokus ke project yang sebelumnya dibuka
    if (
      previousFocusedElement &&
      document.contains(previousFocusedElement)
    ) {
      previousFocusedElement.focus();
    }

    previousFocusedElement = null;
  }

  // Klik project untuk membuka gambar
  galleryButtons.forEach((button) => {
    button.addEventListener("click", () => {
      openLightbox(button);
    });
  });

  // Tombol close
  if (lightboxClose) {
    lightboxClose.addEventListener("click", closeLightbox);
  }

  // Klik area gelap untuk menutup lightbox
  if (lightbox) {
    lightbox.addEventListener("click", (event) => {
      if (event.target === lightbox) {
        closeLightbox();
      }
    });
  }

  // Tangani error gambar lightbox
  if (lightboxImage) {
    lightboxImage.addEventListener("error", () => {
      console.error(
        "Gambar project tidak dapat dimuat:",
        lightboxImage.src
      );
    });
  }


  // =========================================
  // 7. BEFORE & AFTER SLIDER
  // =========================================

  if (comparisonRange && beforeAfterFrame) {

    function updateComparison() {
      const value = Number(comparisonRange.value);

      beforeAfterFrame.style.setProperty(
        "--split",
        `${value}%`
      );
    }

    comparisonRange.addEventListener("input", updateComparison);

    // Posisi awal slider
    updateComparison();
  }


  // =========================================
  // 8. KEYBOARD ACCESSIBILITY
  // =========================================

  document.addEventListener("keydown", (event) => {

    // Escape: tutup menu dan lightbox
    if (event.key === "Escape") {
      closeNavigation();
      closeLightbox();
    }

    // Focus trap ketika lightbox terbuka
    if (event.key === "Tab" && isLightboxOpen()) {
      event.preventDefault();

      if (lightboxClose) {
        lightboxClose.focus();
      }
    }

  });


  // =========================================
  // 9. AUTOMATIC FOOTER YEAR
  // =========================================

  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }


  // =========================================
  // 10. IMAGE ERROR CHECK
  // =========================================

  document.querySelectorAll(".work-card-image img").forEach((image) => {
    image.addEventListener("error", () => {
      console.error(
        "Gambar project tidak ditemukan:",
        image.src
      );
    });
  });




  // =========================================
  // 11. SCROLL REVEAL — SOFT SECTION ENTRANCE
  // =========================================

  const revealTargets = document.querySelectorAll(
    [
      "main section:not(.hero) .section-intro",
      "main section:not(.hero) .why-card",
      "main section:not(.hero) .service-item",
      "main section:not(.hero) .work-card",
      "main section:not(.hero) .comparison-content",
      "main section:not(.hero) .about-content",
      "main section:not(.hero) .about-image",
      "main section:not(.hero) .booking-content",
      "main section:not(.hero) .booking-form",
      "main section:not(.hero) .value-item"
    ].join(",")
  );

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (revealTargets.length) {
    if (reduceMotion || !("IntersectionObserver" in window)) {
      revealTargets.forEach((element) => {
        element.classList.add("is-visible");
      });
    } else {
      revealTargets.forEach((element, index) => {
        element.classList.add("reveal-on-scroll");

        // Stagger nearby cards slightly without making the page feel slow.
        const itemIndex = index % 4;
        if (itemIndex > 0) {
          element.classList.add(`reveal-delay-${itemIndex}`);
        }
      });

      const revealObserver = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;

            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          });
        },
        {
          threshold: 0.12,
          rootMargin: "0px 0px -45px 0px"
        }
      );

      revealTargets.forEach((element) => {
        revealObserver.observe(element);
      });
    }
  }

  // =========================================
  // 12. INITIALIZATION
  // =========================================

  console.log(
    "AUTOCARE STUDIO — JavaScript berhasil dijalankan."
  );

});
