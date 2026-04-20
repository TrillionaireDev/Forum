(function () {
  const inputTop = document.getElementById("waterformInputTop");
  const inputMid = document.getElementById("waterformInputMid");
  const inputRight = document.getElementById("waterformInputRight");

  const falls = document.getElementById("waterformFalls");
  const outputTop = document.getElementById("waterformOutputTop");
  const outputMid = document.getElementById("waterformOutputMid");
  const outputRight = document.getElementById("waterformOutputRight");

  const cursorTop = document.querySelector(".waterform-cursor-top");
  const cursorMid = document.querySelector(".waterform-cursor-mid");
  const cursorRight = document.querySelector(".waterform-cursor-right");

  if (!inputTop || !inputMid || !inputRight || !falls) return;

  let settledTop = "";
  let settledMid = "";
  let settledRight = "";

  const MAX_CHARS = 7;
  const CHAR_WIDTH = 12;

  function rand(min, max) {
    return Math.random() * (max - min) + min;
  }

  function createWaterLines() {
    const lines = [
      { x: 88,  h: 250, cls: "soft",   o: 0.34 },
      { x: 93,  h: 272, cls: "mid",    o: 0.52 },
      { x: 98,  h: 262, cls: "bright", o: 0.76 },
      { x: 100, h: 280, cls: "bright", o: 0.82 },
      { x: 103, h: 268, cls: "mid",    o: 0.58 },
      { x: 108, h: 256, cls: "soft",   o: 0.36 },
      { x: 112, h: 244, cls: "soft",   o: 0.28 }
    ];

    lines.forEach((item) => {
      const line = document.createElement("div");
      line.className = `waterform-line ${item.cls}`;
      line.style.left = `${item.x}px`;
      line.style.height = `${item.h}px`;
      line.style.opacity = item.o;
      falls.appendChild(line);
    });
  }

  function getStackPosition(index) {
    return { x: index * CHAR_WIDTH, y: 0 };
  }

  function createSettledChar(target, char, index) {
    const span = document.createElement("span");
    span.className = "waterform-settled-char";
    span.textContent = char;

    const pos = getStackPosition(index);
    span.style.left = `${pos.x}px`;
    span.style.top = `${pos.y}px`;

    target.appendChild(span);
  }

  function resetBlink(el) {
    el.style.animation = "none";
    el.offsetHeight;
    el.style.animation = "waterform-blink 1s steps(1) infinite";
  }

  function blinkBurst(el) {
    el.style.animation = "none";
    el.offsetHeight;
    el.style.animation = "waterform-blink 0.65s steps(1) 2";
    setTimeout(() => {
      el.style.animation = "";
    }, 1300);
  }

  function dropChar(char, config) {
    const {
      spawnX,
      spawnY,
      cursorEl,
      outputEl,
      outputLeft,
      outputTopPos,
      getText,
      setText,
      burstOnly
    } = config;

    const currentText = getText();
    if (currentText.length >= MAX_CHARS) return;

    const landingIndex = currentText.length;
    const stackPos = getStackPosition(landingIndex);

    const landingX = stackPos.x;
    const landingY = stackPos.y;
    const bottomY = 200;

    const fallRotate = rand(170, 210);
    const settleRotate = rand(-6, 6);

    const platform = document.createElement("div");
    platform.className = "waterform-platform-char";
    platform.textContent = char;
    platform.style.left = `${spawnX - 12}px`;
    platform.style.top = `${spawnY}px`;
    falls.appendChild(platform);

    if (burstOnly) {
      blinkBurst(cursorEl);
    } else {
      resetBlink(cursorEl);
    }

    setTimeout(() => {
      const el = document.createElement("div");
      el.className = "waterform-char";
      el.textContent = char;
      el.style.left = `${spawnX}px`;
      el.style.top = `${spawnY + 4}px`;
      el.style.opacity = "0";
      el.style.transform = `translate(0px, 0px) rotate(-32deg)`;
      falls.appendChild(el);

      platform.remove();

      requestAnimationFrame(() => {
        el.style.transition = "transform 950ms ease-in, color 950ms ease-in, text-shadow 950ms ease-in, opacity 220ms ease-out";
        el.style.opacity = "1";
        el.style.transform = `translate(0px, ${bottomY - spawnY - 4}px) rotate(${fallRotate}deg)`;
        el.style.color = "#6a6a6a";
        el.style.textShadow = "0 0 5px rgba(120, 120, 120, 0.18)";
      });

      setTimeout(() => {
        el.style.transition = "transform 360ms ease-out, color 360ms ease-out, text-shadow 360ms ease-out";
        const finalX = outputLeft + landingX - spawnX;
        const finalY = outputTopPos + landingY - 44 - spawnY - 4;
        el.style.transform = `translate(${finalX}px, ${finalY}px) rotate(${settleRotate}deg)`;
        el.style.color = "#5f5f5f";
        el.style.textShadow = "0 0 3px rgba(120, 120, 120, 0.10)";
      }, 950);

      setTimeout(() => {
        setText(currentText + char);
        createSettledChar(outputEl, char, landingIndex);
        el.remove();
      }, 1310);
    }, 420);
  }

  function bindInput(inputEl, handler) {
    inputEl.addEventListener("input", () => {
      const val = inputEl.value;
      if (!val) return;
      const char = val[val.length - 1];
      handler(char);
      inputEl.value = "";
    });
  }

  bindInput(inputTop, (char) => {
    dropChar(char, {
      spawnX: 100,
      spawnY: -36,
      cursorEl: cursorTop,
      outputEl: outputTop,
      outputLeft: 34,
      outputTopPos: 292,
      getText: () => settledTop,
      setText: (v) => { settledTop = v; },
      burstOnly: false
    });
  });

  bindInput(inputMid, (char) => {
    dropChar(char, {
      spawnX: 104,
      spawnY: 86,
      cursorEl: cursorMid,
      outputEl: outputMid,
      outputLeft: 84,
      outputTopPos: 320,
      getText: () => settledMid,
      setText: (v) => { settledMid = v; },
      burstOnly: true
    });
  });

  bindInput(inputRight, (char) => {
    dropChar(char, {
      spawnX: 150,
      spawnY: 36,
      cursorEl: cursorRight,
      outputEl: outputRight,
      outputLeft: 116,
      outputTopPos: 270,
      getText: () => settledRight,
      setText: (v) => { settledRight = v; },
      burstOnly: true
    });
  });

  createWaterLines();
})();