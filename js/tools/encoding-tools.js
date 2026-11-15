/**
 * DevToolbox - Encoding Tools
 * 3. Base64 Encoder
 * 4. Base64 Decoder
 * 5. URL Encoder
 * 6. URL Decoder
 */

window.DevToolbox = window.DevToolbox || {};
window.DevToolbox.tools = window.DevToolbox.tools || {};

(function (DT) {
  'use strict';

  // --- UTF-8 safe Base64 helpers ---
  function utf8ToBase64(str, urlSafe = false) {
    if (!str) return '';
    // Use TextEncoder to get bytes, then convert to binary string for btoa
    const encoder = new TextEncoder();
    const bytes = encoder.encode(str);
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    let base64 = window.btoa(binary);
    if (urlSafe) {
      base64 = base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    }
    return base64;
  }

  function base64ToUtf8(b64) {
    if (!b64) return '';
    // Normalize url-safe base64 to standard base64
    let normalized = b64.trim().replace(/-/g, '+').replace(/_/g, '/');
    // Add padding if missing
    while (normalized.length % 4 !== 0) {
      normalized += '=';
    }
    // Verify valid base64 pattern
    if (!/^[A-Za-z0-9+/=]+$/.test(normalized)) {
      throw new Error('Input contains characters that are not valid Base64.');
    }
    const binary = window.atob(normalized);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    const decoder = new TextDecoder('utf-8', { fatal: true });
    return decoder.decode(bytes);
  }

  // --- 3. Base64 Encoder ---
  DT.tools.b64Encoder = {
    init() {
      const container = document.getElementById('tool-b64-encoder');
      if (!container) return;

      const input = container.querySelector('#b64-enc-input');
      const output = container.querySelector('#b64-enc-output');
      const encodeBtn = container.querySelector('#b64-enc-btn');
      const clearBtn = container.querySelector('#b64-enc-clear');
      const copyBtn = container.querySelector('#b64-enc-copy');
      const sampleBtn = container.querySelector('#b64-enc-sample');
      const urlSafeCheckbox = container.querySelector('#b64-enc-url-safe');
      const liveCheckbox = container.querySelector('#b64-enc-live');
      const statsBadge = container.querySelector('#b64-enc-stats');

      function encode() {
        const text = input.value;
        if (!text) {
          output.value = '';
          if (statsBadge) statsBadge.textContent = 'Empty';
          return;
        }

        try {
          const urlSafe = urlSafeCheckbox ? urlSafeCheckbox.checked : false;
          const encoded = utf8ToBase64(text, urlSafe);
          output.value = encoded;

          if (statsBadge) {
            const rawBytes = new Blob([text]).size;
            const encBytes = encoded.length;
            statsBadge.textContent = `Original: ${rawBytes} B | Encoded: ${encBytes} chars`;
          }
        } catch (err) {
          DT.toast.error('Failed to encode: ' + err.message);
        }
      }

      if (encodeBtn) encodeBtn.addEventListener('click', () => {
        encode();
        DT.toast.success('Text encoded to Base64');
      });

      if (input) {
        input.addEventListener('input', () => {
          if (liveCheckbox && liveCheckbox.checked) {
            encode();
          }
        });
      }

      if (urlSafeCheckbox) {
        urlSafeCheckbox.addEventListener('change', encode);
      }

      if (sampleBtn) {
        sampleBtn.addEventListener('click', () => {
          input.value = 'DevToolbox 🚀 - The modern developer utility suite!\nSupports UTF-8, emojis 🎉, and special chars: à, é, ü, ñ, 💻.';
          encode();
          DT.toast.info('Sample text loaded');
        });
      }

      if (clearBtn) {
        clearBtn.addEventListener('click', () => {
          input.value = '';
          output.value = '';
          if (statsBadge) statsBadge.textContent = 'Ready';
          DT.toast.info('Cleared fields');
        });
      }

      if (copyBtn) {
        copyBtn.addEventListener('click', () => {
          DT.clipboard.copy(output.value, 'Base64 string copied!', copyBtn);
        });
      }
    }
  };

  // --- 4. Base64 Decoder ---
  DT.tools.b64Decoder = {
    init() {
      const container = document.getElementById('tool-b64-decoder');
      if (!container) return;

      const input = container.querySelector('#b64-dec-input');
      const output = container.querySelector('#b64-dec-output');
      const decodeBtn = container.querySelector('#b64-dec-btn');
      const clearBtn = container.querySelector('#b64-dec-clear');
      const copyBtn = container.querySelector('#b64-dec-copy');
      const sampleBtn = container.querySelector('#b64-dec-sample');
      const liveCheckbox = container.querySelector('#b64-dec-live');
      const errorBox = container.querySelector('#b64-dec-error');
      const statsBadge = container.querySelector('#b64-dec-stats');

      function decode(showToast = false) {
        const raw = input.value.trim();
        if (!raw) {
          output.value = '';
          errorBox.classList.add('hidden');
          errorBox.innerHTML = '';
          if (statsBadge) statsBadge.textContent = 'Empty';
          return;
        }

        try {
          const decoded = base64ToUtf8(raw);
          output.value = decoded;
          errorBox.classList.add('hidden');
          errorBox.innerHTML = '';

          if (statsBadge) {
            statsBadge.textContent = `Decoded: ${decoded.length} chars (${new Blob([decoded]).size} B)`;
          }

          if (showToast) DT.toast.success('Base64 decoded successfully');
        } catch (err) {
          errorBox.classList.remove('hidden');
          errorBox.innerHTML = `
            <div class="error-badge">${DT.getIcon('alert', 'error-badge-icon')} Decode Error</div>
            <div class="error-msg">${DT.escapeHtml(err.message)}</div>
            <div class="error-hint">Ensure the input contains valid Base64 characters (A-Z, a-z, 0-9, +, /, or URL-safe -, _) and proper byte padding.</div>
          `;
          if (showToast) DT.toast.error('Invalid Base64 string');
        }
      }

      if (decodeBtn) decodeBtn.addEventListener('click', () => decode(true));

      if (input) {
        input.addEventListener('input', () => {
          if (liveCheckbox && liveCheckbox.checked) {
            decode(false);
          }
        });
      }

      if (sampleBtn) {
        sampleBtn.addEventListener('click', () => {
          // Encoded version of "DevToolbox 🚀 - Developer toolkit"
          input.value = 'RGV2VG9vbGJveCDwn5mpIC0gRGV2ZWxvcGVyIHRvb2xraXQhIFN1cHBvcnRzIFVURi04LCBlbW9qaXMg8J+OiSwgYW5kIHNwZWNpYWwgY2hhcnM6IMOgLCDDqSwgw7wsIMOxLCDwn5K7Lg==';
          decode(true);
        });
      }

      if (clearBtn) {
        clearBtn.addEventListener('click', () => {
          input.value = '';
          output.value = '';
          errorBox.classList.add('hidden');
          errorBox.innerHTML = '';
          if (statsBadge) statsBadge.textContent = 'Ready';
          DT.toast.info('Cleared fields');
        });
      }

      if (copyBtn) {
        copyBtn.addEventListener('click', () => {
          DT.clipboard.copy(output.value, 'Decoded text copied!', copyBtn);
        });
      }
    }
  };

  // --- 5. URL Encoder ---
  DT.tools.urlEncoder = {
    init() {
      const container = document.getElementById('tool-url-encoder');
      if (!container) return;

      const input = container.querySelector('#url-enc-input');
      const output = container.querySelector('#url-enc-output');
      const encodeBtn = container.querySelector('#url-enc-btn');
      const clearBtn = container.querySelector('#url-enc-clear');
      const copyBtn = container.querySelector('#url-enc-copy');
      const sampleBtn = container.querySelector('#url-enc-sample');
      const modeSelect = container.querySelector('#url-enc-mode');
      const spacePlusCheckbox = container.querySelector('#url-enc-space-plus');
      const liveCheckbox = container.querySelector('#url-enc-live');
      const statsBadge = container.querySelector('#url-enc-stats');

      function encode(showToast = false) {
        const raw = input.value;
        if (!raw) {
          output.value = '';
          if (statsBadge) statsBadge.textContent = 'Empty';
          return;
        }

        try {
          const mode = modeSelect ? modeSelect.value : 'component';
          let encoded = '';
          if (mode === 'full') {
            encoded = encodeURI(raw);
          } else {
            encoded = encodeURIComponent(raw);
          }

          if (spacePlusCheckbox && spacePlusCheckbox.checked) {
            encoded = encoded.replace(/%20/g, '+');
          }

          output.value = encoded;

          if (statsBadge) {
            statsBadge.textContent = `Raw: ${raw.length} chars | Encoded: ${encoded.length} chars`;
          }

          if (showToast) DT.toast.success('URL encoded successfully');
        } catch (err) {
          DT.toast.error('URL encode error: ' + err.message);
        }
      }

      if (encodeBtn) encodeBtn.addEventListener('click', () => encode(true));

      if (input) {
        input.addEventListener('input', () => {
          if (liveCheckbox && liveCheckbox.checked) {
            encode(false);
          }
        });
      }

      if (modeSelect) modeSelect.addEventListener('change', () => encode(false));
      if (spacePlusCheckbox) spacePlusCheckbox.addEventListener('change', () => encode(false));

      if (sampleBtn) {
        sampleBtn.addEventListener('click', () => {
          input.value = 'https://api.example.com/v1/search?query=developer tools & categories=web,dev&filter=all tools 100%&tag=🔥';
          encode(true);
        });
      }

      if (clearBtn) {
        clearBtn.addEventListener('click', () => {
          input.value = '';
          output.value = '';
          if (statsBadge) statsBadge.textContent = 'Ready';
          DT.toast.info('Cleared fields');
        });
      }

      if (copyBtn) {
        copyBtn.addEventListener('click', () => {
          DT.clipboard.copy(output.value, 'Encoded URL copied!', copyBtn);
        });
      }
    }
  };

  // --- 6. URL Decoder ---
  DT.tools.urlDecoder = {
    init() {
      const container = document.getElementById('tool-url-decoder');
      if (!container) return;

      const input = container.querySelector('#url-dec-input');
      const output = container.querySelector('#url-dec-output');
      const decodeBtn = container.querySelector('#url-dec-btn');
      const clearBtn = container.querySelector('#url-dec-clear');
      const copyBtn = container.querySelector('#url-dec-copy');
      const sampleBtn = container.querySelector('#url-dec-sample');
      const treatPlusSpace = container.querySelector('#url-dec-plus-space');
      const liveCheckbox = container.querySelector('#url-dec-live');
      const errorBox = container.querySelector('#url-dec-error');
      const statsBadge = container.querySelector('#url-dec-stats');

      function decode(showToast = false) {
        let raw = input.value.trim();
        if (!raw) {
          output.value = '';
          errorBox.classList.add('hidden');
          errorBox.innerHTML = '';
          if (statsBadge) statsBadge.textContent = 'Empty';
          return;
        }

        try {
          if (treatPlusSpace && treatPlusSpace.checked) {
            raw = raw.replace(/\+/g, ' ');
          }

          const decoded = decodeURIComponent(raw);
          output.value = decoded;
          errorBox.classList.add('hidden');
          errorBox.innerHTML = '';

          if (statsBadge) {
            statsBadge.textContent = `Decoded: ${decoded.length} chars`;
          }

          if (showToast) DT.toast.success('URL decoded successfully');
        } catch (err) {
          errorBox.classList.remove('hidden');
          errorBox.innerHTML = `
            <div class="error-badge">${DT.getIcon('alert', 'error-badge-icon')} URI Malformed Error</div>
            <div class="error-msg">${DT.escapeHtml(err.message)}</div>
            <div class="error-hint">This usually happens when an incomplete or invalid percent-encoded sequence exists (e.g., '%' not followed by two hex digits).</div>
          `;
          if (showToast) DT.toast.error('Malformed URL sequence');
        }
      }

      if (decodeBtn) decodeBtn.addEventListener('click', () => decode(true));

      if (input) {
        input.addEventListener('input', () => {
          if (liveCheckbox && liveCheckbox.checked) {
            decode(false);
          }
        });
      }

      if (treatPlusSpace) treatPlusSpace.addEventListener('change', () => decode(false));

      if (sampleBtn) {
        sampleBtn.addEventListener('click', () => {
          input.value = 'https%3A%2F%2Fapi.example.com%2Fv1%2Fsearch%3Fquery%3Ddeveloper%2Btools%20%26%20categories%3Dweb%2Cdev%26filter%3Dall%2Btools%2B100%25%26tag%3D%F0%9F%94%A5';
          decode(true);
        });
      }

      if (clearBtn) {
        clearBtn.addEventListener('click', () => {
          input.value = '';
          output.value = '';
          errorBox.classList.add('hidden');
          errorBox.innerHTML = '';
          if (statsBadge) statsBadge.textContent = 'Ready';
          DT.toast.info('Cleared fields');
        });
      }

      if (copyBtn) {
        copyBtn.addEventListener('click', () => {
          DT.clipboard.copy(output.value, 'Decoded URL copied!', copyBtn);
        });
      }
    }
  };

})(window.DevToolbox);
