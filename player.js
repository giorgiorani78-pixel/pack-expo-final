(function () {
  const grid = document.querySelector(".grid[data-cols]");

  if (grid) {
    const cols = Math.max(1, parseInt(grid.dataset.cols, 10) || 7);
    const items = grid.querySelectorAll("figure").length;
    const rows = Math.max(1, Math.ceil(items / cols));

    document.body.style.setProperty("--cols", cols);
    document.body.style.setProperty("--rows", rows);
  }

  const modal = document.querySelector(".video-overlay");

  if (!modal) {
    return;
  }

  const dialog = modal.querySelector(".video-dialog");
  const videoEl = modal.querySelector("video");
  const closeBtn = modal.querySelector(".modal-close");
  const nativeWidth = 1920;
  const nativeHeight = 1080;

  function fitDialog() {
    const padding = 48;
    const maxWidth = Math.min(nativeWidth, window.innerWidth - padding);
    const maxHeight = Math.min(nativeHeight, window.innerHeight - padding);
    const scale = Math.min(maxWidth / nativeWidth, maxHeight / nativeHeight, 1);

    dialog.style.width = `${Math.round(nativeWidth * scale)}px`;
    dialog.style.height = `${Math.round(nativeHeight * scale)}px`;
  }

  function showModal(src) {
    fitDialog();
    videoEl.loop = false;
    videoEl.src = src;
    modal.hidden = false;

    requestAnimationFrame(() => {
      modal.classList.add("visible");
      videoEl.play().catch(() => {
        /* autoplay might fail on some kiosks */
      });
    });
  }

  function hideModal() {
    modal.classList.remove("visible");
    videoEl.pause();
    videoEl.removeAttribute("src");
    videoEl.load();

    setTimeout(() => {
      modal.hidden = true;
    }, 300);
  }

  document.querySelectorAll("[data-video]").forEach((element) => {
    element.addEventListener("click", () => {
      const src = element.dataset.video;

      if (src) {
        showModal(src);
      }
    });
  });

  closeBtn.addEventListener("click", (event) => {
    event.stopPropagation();
    hideModal();
  });

  dialog.addEventListener("click", (event) => {
    event.stopPropagation();
  });

  modal.addEventListener("click", hideModal);

  videoEl.addEventListener("ended", () => {
    videoEl.pause();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal.classList.contains("visible")) {
      hideModal();
    }
  });

  window.addEventListener("resize", () => {
    if (modal.classList.contains("visible")) {
      fitDialog();
    }
  });
})();
