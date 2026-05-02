
function mountGrassField(target) {
  target.innerHTML = `
    <div class="field">
      <div class="grass-strip"></div>
      <div class="clippings"></div>
      <input 
        class="grass-input"
        autocorrect="off"
        autocapitalize="off"
        spellcheck="false"
        autocomplete="off"
      />
      <span class="measure"></span>
    </div>
  `;

  const field = target.querySelector(".field");
  const grassStrip = target.querySelector(".grass-strip");
  const clippings = target.querySelector(".clippings");
  const input = target.querySelector(".grass-input");
  const measure = target.querySelector(".measure");

  const bladeCount = 110;
  const blades = [];
  const leftPadding = 16;
  const rightPadding = 16;

  let textStartX = leftPadding;
  let prevTextWidth = 0;

  function rand(min, max) {
    return Math.random() * (max - min) + min;
  }

  function setTextStart(x) {
    const maxStart = Math.max(leftPadding, field.clientWidth - rightPadding - 20);
    textStartX = Math.max(leftPadding, Math.min(x, maxStart));
    input.style.paddingLeft = `${textStartX}px`;
  }

  field.addEventListener("pointerdown", (event) => {
    const rect = field.getBoundingClientRect();
    const x = event.clientX - rect.left;

    if (!input.value) {
      setTextStart(x);
      prevTextWidth = 0;
      updateGrass();
    }

    input.focus();
  });

  function makeBlade(i) {
    const blade = document.createElement("div");
    blade.className = "blade";

    let baseHeight;
    const r = Math.random();

    if (r < 0.18) baseHeight = rand(14, 24);
    else if (r < 0.72) baseHeight = rand(24, 42);
    else baseHeight = rand(42, 62);

    const tilt = rand(-14, 14);
    const hue = rand(105, 128);
    const light = rand(26, 44);

    blade.dataset.baseHeight = baseHeight.toFixed(2);
    blade.dataset.currentHeight = baseHeight.toFixed(2);
    blade.dataset.baseTilt = tilt.toFixed(2);

    blade.style.left = `${i * (100 / bladeCount)}%`;
    blade.style.height = `${baseHeight}px`;
    blade.style.transform = `rotate(${tilt}deg)`;
    blade.style.background = `hsl(${hue}, 50%, ${light}%)`;

    grassStrip.appendChild(blade);
    blades.push(blade);
  }

  function buildGrass() {
    grassStrip.innerHTML = "";
    blades.length = 0;

    for (let i = 0; i < bladeCount; i++) {
      makeBlade(i);
    }
  }

  function getTextWidth() {
    measure.textContent = input.value || "";
    return measure.offsetWidth;
  }

  function spawnClipping(blade, cutAmountPx) {
    if (cutAmountPx < 6) return;

    const bladeLeft = blade.offsetLeft;
    const oldHeight = parseFloat(blade.dataset.currentHeight);
    const tilt = parseFloat(blade.dataset.baseTilt);
    const color = blade.style.background;

    const piece = document.createElement("div");
    piece.className = "clip-piece";
    piece.style.left = `${bladeLeft}px`;
    piece.style.bottom = `${Math.max(0, oldHeight - cutAmountPx)}px`;
    piece.style.height = `${Math.max(5, cutAmountPx)}px`;
    piece.style.background = color;
    piece.style.setProperty("--start-rot", `${tilt}deg`);
    piece.style.setProperty("--end-rot", `${tilt + rand(-18, 18)}deg`);
    piece.style.setProperty("--fall-y", `${rand(14, 30)}px`);
    piece.style.setProperty("--drift-x", `${rand(-5, 5)}px`);

    clippings.appendChild(piece);
    piece.addEventListener("animationend", () => piece.remove());
  }

  function updateGrass(event) {
    const textWidth = getTextWidth();
    const cutStart = textStartX;
    const cutEnd = textStartX + textWidth;

    const prevCutEnd = textStartX + prevTextWidth;
    const isDeletion =
      (event && event.inputType && event.inputType.startsWith("delete")) ||
      textWidth < prevTextWidth;

    if (!input.value) {
      prevTextWidth = 0;
    }

    blades.forEach((blade) => {
      const bladeLeft = blade.offsetLeft;
      const bladeCenter = bladeLeft + 1.5;
      const baseHeight = parseFloat(blade.dataset.baseHeight);
      const prevHeight = parseFloat(blade.dataset.currentHeight);
      const baseTilt = parseFloat(blade.dataset.baseTilt);

      const softness = 18;
      let influence = 0;

      if (bladeCenter >= cutStart && bladeCenter <= cutEnd) {
        const distToEdge = Math.min(bladeCenter - cutStart, cutEnd - bladeCenter);
        influence = Math.min(1, 0.76 + distToEdge / 24);
      } else if (bladeCenter > cutEnd && bladeCenter < cutEnd + softness) {
        influence = 1 - (bladeCenter - cutEnd) / softness;
      } else if (bladeCenter < cutStart && bladeCenter > cutStart - softness) {
        influence = 1 - (cutStart - bladeCenter) / softness;
      }

      influence = Math.max(0, Math.min(influence, 1));

      let targetHeight = baseHeight;

      if (textWidth > 0 && influence > 0) {
        const cutStrength =
          baseHeight > 42 ? 0.84 :
          baseHeight > 24 ? 0.72 :
          0.58;

        targetHeight = Math.max(5, baseHeight * (1 - influence * cutStrength));
      }

      const newTilt = baseTilt * (1 - influence * 0.6);
      const cutAmountPx = prevHeight - targetHeight;

      blade.style.transitionDelay = "0ms";

      if (!isDeletion && cutAmountPx > 7 && Math.random() < 0.34) {
        spawnClipping(blade, cutAmountPx * rand(0.55, 0.9));
      }

      if (isDeletion && prevTextWidth > textWidth) {
        const inRegrowBand = bladeCenter > cutEnd && bladeCenter <= prevCutEnd;

        if (inRegrowBand) {
          const distFromOldRight = prevCutEnd - bladeCenter;
          const maxBand = Math.max(prevCutEnd - cutEnd, 1);
          const progress = distFromOldRight / maxBand;
          const delay = progress * 220;

          blade.style.transitionDelay = `${delay}ms`;
        }
      }

      blade.dataset.currentHeight = targetHeight.toFixed(2);
      blade.style.height = `${targetHeight}px`;
      blade.style.transform = `rotate(${newTilt}deg)`;
    });

    prevTextWidth = textWidth;
  }

  buildGrass();
  setTextStart(leftPadding);

  input.addEventListener("input", updateGrass);

  window.addEventListener("resize", () => {
    const currentValue = input.value;
    buildGrass();
    prevTextWidth = 0;
    input.value = currentValue;
    updateGrass();
  });

  updateGrass();
}
