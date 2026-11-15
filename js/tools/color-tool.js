/**
 * DevToolbox - Generator Tools
 * 10. Color Converter (HEX, RGB, HSL, CMYK, WCAG Contrast & Harmonies)
 */

window.DevToolbox = window.DevToolbox || {};
window.DevToolbox.tools = window.DevToolbox.tools || {};

(function (DT) {
  'use strict';

  // --- Color Math Helpers ---
  function hexToRgb(hex) {
    let clean = hex.replace(/^#/, '').trim();
    if (clean.length === 3) {
      clean = clean.split('').map(c => c + c).join('');
    }
    if (clean.length !== 6 || !/^[0-9A-Fa-f]{6}$/.test(clean)) {
      return null;
    }
    const num = parseInt(clean, 16);
    return {
      r: (num >> 16) & 255,
      g: (num >> 8) & 255,
      b: num & 255
    };
  }

  function rgbToHex(r, g, b) {
    const toHex = (n) => {
      const clamped = Math.max(0, Math.min(255, Math.round(n)));
      return clamped.toString(16).padStart(2, '0');
    };
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
  }

  function rgbToHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
  }

  function hslToRgb(h, s, l) {
    h = (((h % 360) + 360) % 360) / 360;
    s = Math.max(0, Math.min(100, s)) / 100;
    l = Math.max(0, Math.min(100, l)) / 100;

    let r, g, b;
    if (s === 0) {
      r = g = b = l; // achromatic
    } else {
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }

    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255)
    };
  }

  function rgbToCmyk(r, g, b) {
    const rNorm = r / 255;
    const gNorm = g / 255;
    const bNorm = b / 255;

    const k = 1 - Math.max(rNorm, gNorm, bNorm);
    if (k === 1) {
      return { c: 0, m: 0, y: 0, k: 100 };
    }
    const c = (1 - rNorm - k) / (1 - k);
    const m = (1 - gNorm - k) / (1 - k);
    const y = (1 - bNorm - k) / (1 - k);

    return {
      c: Math.round(c * 100),
      m: Math.round(m * 100),
      y: Math.round(y * 100),
      k: Math.round(k * 100)
    };
  }

  // Relative luminance for WCAG contrast calculation
  function getLuminance(r, g, b) {
    const a = [r, g, b].map(v => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
  }

  function getContrastRatio(rgb1, rgb2) {
    const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
    const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);
    return (brightest + 0.05) / (darkest + 0.05);
  }

  // --- 10. Color Converter Tool Controller ---
  DT.tools.colorConverter = {
    init() {
      const container = document.getElementById('tool-color-converter');
      if (!container) return;

      const colorPicker = container.querySelector('#color-picker-input');
      const swatchPreview = container.querySelector('#color-swatch-preview');
      const randomBtn = container.querySelector('#color-random-btn');

      // Input fields
      const inputHex = container.querySelector('#color-input-hex');
      const inputRgbR = container.querySelector('#color-input-r');
      const inputRgbG = container.querySelector('#color-input-g');
      const inputRgbB = container.querySelector('#color-input-b');
      const inputHslH = container.querySelector('#color-input-h');
      const inputHslS = container.querySelector('#color-input-s');
      const inputHslL = container.querySelector('#color-input-l');

      // Strings
      const strHex = container.querySelector('#color-str-hex');
      const strRgb = container.querySelector('#color-str-rgb');
      const strHsl = container.querySelector('#color-str-hsl');
      const strCmyk = container.querySelector('#color-str-cmyk');

      // WCAG & Harmony elements
      const contrastWhite = container.querySelector('#color-contrast-white');
      const contrastBlack = container.querySelector('#color-contrast-black');
      const harmonyContainer = container.querySelector('#color-harmonies-list');

      let currentColor = { r: 99, g: 102, b: 241 }; // Default #6366F1

      function updateAllViews(source = '') {
        const { r, g, b } = currentColor;
        const hex = rgbToHex(r, g, b);
        const hsl = rgbToHsl(r, g, b);
        const cmyk = rgbToCmyk(r, g, b);

        // Update preview swatch
        if (swatchPreview) {
          swatchPreview.style.backgroundColor = hex;
        }

        // Update native picker
        if (colorPicker && source !== 'picker') {
          colorPicker.value = hex;
        }

        // Update inputs
        if (inputHex && source !== 'hex') {
          inputHex.value = hex;
        }
        if (inputRgbR && source !== 'rgb') {
          inputRgbR.value = r;
          inputRgbG.value = g;
          inputRgbB.value = b;
        }
        if (inputHslH && source !== 'hsl') {
          inputHslH.value = hsl.h;
          inputHslS.value = hsl.s;
          inputHslL.value = hsl.l;
        }

        // Update output text representations
        if (strHex) strHex.textContent = hex;
        if (strRgb) strRgb.textContent = `rgb(${r}, ${g}, ${b})`;
        if (strHsl) strHsl.textContent = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
        if (strCmyk) strCmyk.textContent = `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`;

        // Update Contrast Ratios
        const contrastW = getContrastRatio(currentColor, { r: 255, g: 255, b: 255 });
        const contrastB = getContrastRatio(currentColor, { r: 0, g: 0, b: 0 });

        if (contrastWhite) {
          const passAA = contrastW >= 4.5 ? 'PASS (AA)' : 'FAIL';
          contrastWhite.innerHTML = `
            <div class="contrast-score">${contrastW.toFixed(2)}:1</div>
            <div class="contrast-badge ${contrastW >= 4.5 ? 'badge-pass' : 'badge-fail'}">${passAA}</div>
          `;
        }

        if (contrastBlack) {
          const passAA = contrastB >= 4.5 ? 'PASS (AA)' : 'FAIL';
          contrastBlack.innerHTML = `
            <div class="contrast-score">${contrastB.toFixed(2)}:1</div>
            <div class="contrast-badge ${contrastB >= 4.5 ? 'badge-pass' : 'badge-fail'}">${passAA}</div>
          `;
        }

        // Update Harmonies (Complementary, Analogous, Triadic)
        if (harmonyContainer) {
          const compH = (hsl.h + 180) % 360;
          const compRgb = hslToRgb(compH, hsl.s, hsl.l);
          const compHex = rgbToHex(compRgb.r, compRgb.g, compRgb.b);

          const ana1H = (hsl.h + 30) % 360;
          const ana1Rgb = hslToRgb(ana1H, hsl.s, hsl.l);
          const ana1Hex = rgbToHex(ana1Rgb.r, ana1Rgb.g, ana1Rgb.b);

          const ana2H = (hsl.h + 330) % 360;
          const ana2Rgb = hslToRgb(ana2H, hsl.s, hsl.l);
          const ana2Hex = rgbToHex(ana2Rgb.r, ana2Rgb.g, ana2Rgb.b);

          const tri1H = (hsl.h + 120) % 360;
          const tri1Rgb = hslToRgb(tri1H, hsl.s, hsl.l);
          const tri1Hex = rgbToHex(tri1Rgb.r, tri1Rgb.g, tri1Rgb.b);

          const tri2H = (hsl.h + 240) % 360;
          const tri2Rgb = hslToRgb(tri2H, hsl.s, hsl.l);
          const tri2Hex = rgbToHex(tri2Rgb.r, tri2Rgb.g, tri2Rgb.b);

          const harmonies = [
            { name: 'Complementary', hex: compHex },
            { name: 'Analogous +30°', hex: ana1Hex },
            { name: 'Analogous -30°', hex: ana2Hex },
            { name: 'Triadic +120°', hex: tri1Hex },
            { name: 'Triadic +240°', hex: tri2Hex }
          ];

          let hHtml = '';
          harmonies.forEach(h => {
            hHtml += `
              <div class="harmony-chip" data-hex="${h.hex}" title="Click to use ${h.hex}">
                <div class="harmony-swatch" style="background-color: ${h.hex}"></div>
                <div class="harmony-meta">
                  <span class="harmony-name">${h.name}</span>
                  <span class="harmony-hex">${h.hex}</span>
                </div>
              </div>
            `;
          });
          harmonyContainer.innerHTML = hHtml;

          harmonyContainer.querySelectorAll('.harmony-chip').forEach(chip => {
            chip.addEventListener('click', () => {
              const hexVal = chip.getAttribute('data-hex');
              const parsed = hexToRgb(hexVal);
              if (parsed) {
                currentColor = parsed;
                updateAllViews();
                DT.toast.info(`Selected harmony: ${hexVal}`);
              }
            });
          });
        }
      }

      // Event: Native Color Picker
      if (colorPicker) {
        colorPicker.addEventListener('input', (e) => {
          const parsed = hexToRgb(e.target.value);
          if (parsed) {
            currentColor = parsed;
            updateAllViews('picker');
          }
        });
      }

      // Event: HEX input
      if (inputHex) {
        inputHex.addEventListener('input', () => {
          const parsed = hexToRgb(inputHex.value);
          if (parsed) {
            currentColor = parsed;
            updateAllViews('hex');
          }
        });
      }

      // Event: RGB inputs
      const handleRgbChange = () => {
        const r = parseInt(inputRgbR.value || 0, 10);
        const g = parseInt(inputRgbG.value || 0, 10);
        const b = parseInt(inputRgbB.value || 0, 10);
        currentColor = {
          r: Math.max(0, Math.min(255, r)),
          g: Math.max(0, Math.min(255, g)),
          b: Math.max(0, Math.min(255, b))
        };
        updateAllViews('rgb');
      };

      if (inputRgbR) inputRgbR.addEventListener('input', handleRgbChange);
      if (inputRgbG) inputRgbG.addEventListener('input', handleRgbChange);
      if (inputRgbB) inputRgbB.addEventListener('input', handleRgbChange);

      // Event: HSL inputs
      const handleHslChange = () => {
        const h = parseInt(inputHslH.value || 0, 10);
        const s = parseInt(inputHslS.value || 0, 10);
        const l = parseInt(inputHslL.value || 0, 10);
        currentColor = hslToRgb(h, s, l);
        updateAllViews('hsl');
      };

      if (inputHslH) inputHslH.addEventListener('input', handleHslChange);
      if (inputHslS) inputHslS.addEventListener('input', handleHslChange);
      if (inputHslL) inputHslL.addEventListener('input', handleHslChange);

      // Event: Random Color Generator
      if (randomBtn) {
        randomBtn.addEventListener('click', () => {
          currentColor = {
            r: Math.floor(Math.random() * 256),
            g: Math.floor(Math.random() * 256),
            b: Math.floor(Math.random() * 256)
          };
          updateAllViews();
          DT.toast.success(`Generated random color: ${rgbToHex(currentColor.r, currentColor.g, currentColor.b)}`);
        });
      }

      // Attach copy events to format cards
      container.querySelectorAll('.btn-color-copy').forEach(btn => {
        btn.addEventListener('click', () => {
          const targetId = btn.getAttribute('data-target');
          const targetEl = container.querySelector(targetId);
          if (targetEl) {
            DT.clipboard.copy(targetEl.textContent.trim(), 'Color copied to clipboard!', btn);
          }
        });
      });

      // Initial render
      updateAllViews();
    }
  };

})(window.DevToolbox);
