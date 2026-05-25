(function () {
  document.body.classList.add("city-page");

  const title = document.querySelector("h1");
  const summary = document.querySelector(".summary, h1 + p");
  const backLink = document.querySelector('body > a[href="../../index.html"]');
  const firstImage = document.querySelector("figure img");
  const savedTheme = localStorage.getItem("dd-map-theme");

  if (savedTheme === "dark") {
    document.body.classList.add("is-dark");
  }

  const themeButton = document.createElement("button");
  themeButton.className = "city-theme-toggle";
  themeButton.type = "button";
  themeButton.textContent = document.body.classList.contains("is-dark") ? "Day mode" : "Night mode";
  document.body.appendChild(themeButton);

  themeButton.addEventListener("click", () => {
    const isDark = document.body.classList.toggle("is-dark");
    localStorage.setItem("dd-map-theme", isDark ? "dark" : "day");
    themeButton.textContent = isDark ? "Day mode" : "Night mode";
  });

  if (title && firstImage && !document.querySelector(".city-hero")) {
    const hero = document.createElement("section");
    hero.className = "city-hero";
    const heroImageUrl = new URL(firstImage.getAttribute("src"), window.location.href).href;
    hero.style.setProperty("--hero-image", `url("${heroImageUrl}")`);

    const eyebrow = document.createElement("span");
    eyebrow.className = "city-hero__eyebrow";
    eyebrow.textContent = "Travel note";

    const meta = document.createElement("div");
    meta.className = "city-hero__meta";
    const dates = Array.from(document.querySelectorAll("h2")).map((heading) => heading.textContent.trim());
    const photos = document.querySelectorAll("figure img").length;
    meta.textContent = `${dates[0] || "Memory"}${dates.length > 1 ? ` - ${dates[dates.length - 1]}` : ""} · ${photos} photos`;

    const body = document.createElement("div");
    body.className = "city-hero__body";

    if (backLink) hero.appendChild(backLink);
    body.appendChild(eyebrow);
    body.appendChild(title);
    if (summary) body.appendChild(summary);
    body.appendChild(meta);
    hero.appendChild(body);
    document.body.insertBefore(hero, document.body.firstChild);
  }

  Array.from(document.querySelectorAll("h2")).forEach((heading, index) => {
    heading.dataset.index = String(index + 1).padStart(2, "0");
  });

  const figures = Array.from(document.querySelectorAll("figure"));

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });

    figures.forEach((figure) => observer.observe(figure));
  } else {
    figures.forEach((figure) => figure.classList.add("is-visible"));
  }

  const images = Array.from(document.querySelectorAll("figure img"));
  if (!images.length) return;

  const lightbox = document.createElement("div");
  lightbox.className = "lightbox";
  lightbox.innerHTML = [
    '<button class="lightbox__button" type="button" aria-label="Close">×</button>',
    '<button class="lightbox__nav lightbox__nav--prev" type="button" aria-label="Previous">‹</button>',
    '<img alt="">',
    '<button class="lightbox__nav lightbox__nav--next" type="button" aria-label="Next">›</button>',
    '<div class="lightbox__caption"></div>',
    '<div class="lightbox__meta"></div>'
  ].join("");
  document.body.appendChild(lightbox);

  const lightboxImage = lightbox.querySelector("img");
  const lightboxCaption = lightbox.querySelector(".lightbox__caption");
  const lightboxMeta = lightbox.querySelector(".lightbox__meta");
  const closeButton = lightbox.querySelector("button");
  const prevButton = lightbox.querySelector(".lightbox__nav--prev");
  const nextButton = lightbox.querySelector(".lightbox__nav--next");
  const cityName = title ? title.textContent.trim() : document.title;
  let activeIndex = 0;

  function closeLightbox() {
    lightbox.classList.remove("is-open");
    document.body.style.overflow = "";
  }

  function openImage(index) {
    activeIndex = (index + images.length) % images.length;
    const image = images[activeIndex];
    const figure = image.closest("figure");
    const caption = figure ? figure.innerText.trim() : "";
    const dateHeading = figure?.parentElement?.previousElementSibling?.matches("h2")
      ? figure.parentElement.previousElementSibling.textContent.trim()
      : "";

    lightboxImage.src = image.currentSrc || image.src;
    lightboxImage.alt = image.alt || "";
    lightboxCaption.textContent = caption || image.alt || "";
    lightboxMeta.textContent = `${cityName}${dateHeading ? ` · ${dateHeading}` : ""} · ${activeIndex + 1}/${images.length}`;
    lightbox.classList.add("is-open");
    document.body.style.overflow = "hidden";
  }

  images.forEach((image, index) => {
    image.addEventListener("click", () => openImage(index));
  });

  closeButton.addEventListener("click", closeLightbox);
  prevButton.addEventListener("click", () => openImage(activeIndex - 1));
  nextButton.addEventListener("click", () => openImage(activeIndex + 1));
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) closeLightbox();
  });
  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeLightbox();
    if (event.key === "ArrowLeft" && lightbox.classList.contains("is-open")) openImage(activeIndex - 1);
    if (event.key === "ArrowRight" && lightbox.classList.contains("is-open")) openImage(activeIndex + 1);
  });

  document.addEventListener("click", (event) => {
    const link = event.target.closest("a[href]");
    if (!link) return;
    const href = link.getAttribute("href");
    if (!href || href.startsWith("#") || href.startsWith("http")) return;

    event.preventDefault();
    document.body.classList.add("is-leaving");
    setTimeout(() => {
      window.location.href = href;
    }, 180);
  });
})();
