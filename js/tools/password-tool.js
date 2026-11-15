/**
 * DevToolbox - Generator Tools
 * 9. Password Generator (Cryptographically Secure)
 */

window.DevToolbox = window.DevToolbox || {};
window.DevToolbox.tools = window.DevToolbox.tools || {};

(function (DT) {
  'use strict';

  const CHAR_SETS = {
    upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lower: 'abcdefghijklmnopqrstuvwxyz',
    numbers: '0123456789',
    symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
  };

  const AMBIGUOUS_CHARS = /[0Oo1lI|]/g;
  const BRACKET_CHARS = /[{}()[\]<>]/g;

  /**
   * Secure random number generator between 0 and max (exclusive)
   * Uses rejection sampling to eliminate modulo bias.
   */
  function secureRandomInt(max) {
    if (max <= 1) return 0;
    const array = new Uint32Array(1);
    const maxUint32 = 0xFFFFFFFF;
    const limit = maxUint32 - (maxUint32 % max);
    let rand;
    do {
      window.crypto.getRandomValues(array);
      rand = array[0];
    } while (rand >= limit);
    return rand % max;
  }

  /**
   * Calculate password entropy in bits: E = L * log2(poolSize)
   */
  function calculateEntropy(password, poolSize) {
    if (!password || poolSize <= 0) return 0;
    return Math.round(password.length * (Math.log(poolSize) / Math.LN2));
  }

  /**
   * Evaluate strength and crack time based on entropy
   */
  function evaluateStrength(entropy) {
    if (entropy < 28) {
      return { score: 1, label: 'Very Weak', color: '#ef4444', crackTime: 'A few seconds', width: '20%' };
    } else if (entropy < 46) {
      return { score: 2, label: 'Weak', color: '#f97316', crackTime: 'A few minutes to hours', width: '40%' };
    } else if (entropy < 62) {
      return { score: 3, label: 'Moderate', color: '#eab308', crackTime: 'A few months', width: '60%' };
    } else if (entropy < 84) {
      return { score: 4, label: 'Strong', color: '#22c55e', crackTime: 'Thousands of years', width: '80%' };
    } else {
      return { score: 5, label: 'Very Strong', color: '#06b6d4', crackTime: 'Billions of centuries', width: '100%' };
    }
  }

  // --- 9. Password Generator Tool Controller ---
  DT.tools.passwordGenerator = {
    init() {
      const container = document.getElementById('tool-password-generator');
      if (!container) return;

      const output = container.querySelector('#pwd-output');
      const lengthSlider = container.querySelector('#pwd-length');
      const lengthNumber = container.querySelector('#pwd-length-val');
      const chkUpper = container.querySelector('#pwd-opt-upper');
      const chkLower = container.querySelector('#pwd-opt-lower');
      const chkNumbers = container.querySelector('#pwd-opt-numbers');
      const chkSymbols = container.querySelector('#pwd-opt-symbols');
      const chkExcludeAmbiguous = container.querySelector('#pwd-opt-ambiguous');
      const chkExcludeBrackets = container.querySelector('#pwd-opt-brackets');

      const btnGenerate = container.querySelector('#pwd-generate-btn');
      const btnCopy = container.querySelector('#pwd-copy-btn');
      const strengthBar = container.querySelector('#pwd-strength-bar');
      const strengthLabel = container.querySelector('#pwd-strength-label');
      const strengthCrack = container.querySelector('#pwd-strength-crack');
      const entropyBadge = container.querySelector('#pwd-entropy-badge');

      // Bulk Generator Elements
      const bulkContainer = container.querySelector('#pwd-bulk-list');
      const bulkBtn = container.querySelector('#pwd-bulk-generate-btn');
      const bulkCopyAllBtn = container.querySelector('#pwd-bulk-copy-all');
      const bulkCountSelect = container.querySelector('#pwd-bulk-count');

      function getPool() {
        let pool = '';
        const requiredChars = [];

        let upperSet = CHAR_SETS.upper;
        let lowerSet = CHAR_SETS.lower;
        let numSet = CHAR_SETS.numbers;
        let symSet = CHAR_SETS.symbols;

        if (chkExcludeAmbiguous && chkExcludeAmbiguous.checked) {
          upperSet = upperSet.replace(AMBIGUOUS_CHARS, '');
          lowerSet = lowerSet.replace(AMBIGUOUS_CHARS, '');
          numSet = numSet.replace(AMBIGUOUS_CHARS, '');
        }

        if (chkExcludeBrackets && chkExcludeBrackets.checked) {
          symSet = symSet.replace(BRACKET_CHARS, '');
        }

        if (chkUpper && chkUpper.checked) {
          pool += upperSet;
          if (upperSet.length > 0) requiredChars.push(upperSet[secureRandomInt(upperSet.length)]);
        }
        if (chkLower && chkLower.checked) {
          pool += lowerSet;
          if (lowerSet.length > 0) requiredChars.push(lowerSet[secureRandomInt(lowerSet.length)]);
        }
        if (chkNumbers && chkNumbers.checked) {
          pool += numSet;
          if (numSet.length > 0) requiredChars.push(numSet[secureRandomInt(numSet.length)]);
        }
        if (chkSymbols && chkSymbols.checked) {
          pool += symSet;
          if (symSet.length > 0) requiredChars.push(symSet[secureRandomInt(symSet.length)]);
        }

        return { pool, requiredChars };
      }

      function generateSinglePassword() {
        const { pool, requiredChars } = getPool();
        const length = parseInt(lengthSlider ? lengthSlider.value : 16, 10);

        if (!pool || pool.length === 0) {
          DT.toast.warning('Please select at least one character type!');
          return '';
        }

        // Fill array with secure random choices from pool
        const result = [...requiredChars];
        while (result.length < length) {
          result.push(pool[secureRandomInt(pool.length)]);
        }

        // Fisher-Yates shuffle with crypto randomness
        for (let i = result.length - 1; i > 0; i--) {
          const j = secureRandomInt(i + 1);
          const temp = result[i];
          result[i] = result[j];
          result[j] = temp;
        }

        const password = result.slice(0, length).join('');

        // Update UI
        if (output) output.value = password;

        // Entropy and strength
        const entropy = calculateEntropy(password, pool.length);
        const strength = evaluateStrength(entropy);

        if (strengthBar) {
          strengthBar.style.width = strength.width;
          strengthBar.style.backgroundColor = strength.color;
        }

        if (strengthLabel) {
          strengthLabel.textContent = strength.label;
          strengthLabel.style.color = strength.color;
        }

        if (strengthCrack) {
          strengthCrack.textContent = `Est. crack time: ${strength.crackTime}`;
        }

        if (entropyBadge) {
          entropyBadge.textContent = `${entropy} bits entropy`;
        }

        return password;
      }

      function generateBulk() {
        if (!bulkContainer) return;
        const count = parseInt(bulkCountSelect ? bulkCountSelect.value : 5, 10);
        const { pool } = getPool();

        if (!pool || pool.length === 0) {
          DT.toast.warning('Please select at least one character type!');
          return;
        }

        const passwords = [];
        for (let i = 0; i < count; i++) {
          passwords.push(generateSinglePassword());
        }

        let html = '';
        passwords.forEach((pwd, idx) => {
          html += `
            <div class="bulk-pwd-item">
              <span class="bulk-pwd-index">#${idx + 1}</span>
              <code class="bulk-pwd-text">${DT.escapeHtml(pwd)}</code>
              <button type="button" class="btn btn-xs btn-outline btn-bulk-copy" data-pwd="${DT.escapeHtml(pwd)}" title="Copy this password">
                ${DT.getIcon('copy', 'btn-icon')} Copy
              </button>
            </div>
          `;
        });

        bulkContainer.innerHTML = html;

        bulkContainer.querySelectorAll('.btn-bulk-copy').forEach(btn => {
          btn.addEventListener('click', () => {
            const pwdVal = btn.getAttribute('data-pwd');
            DT.clipboard.copy(pwdVal, 'Password copied!', btn);
          });
        });
      }

      // Slider sync
      if (lengthSlider && lengthNumber) {
        lengthSlider.addEventListener('input', () => {
          lengthNumber.textContent = lengthSlider.value;
          generateSinglePassword();
        });
      }

      // Checkbox events
      [chkUpper, chkLower, chkNumbers, chkSymbols, chkExcludeAmbiguous, chkExcludeBrackets].forEach(chk => {
        if (chk) {
          chk.addEventListener('change', () => {
            // Ensure at least one primary set is checked
            const anyPrimary = (chkUpper && chkUpper.checked) ||
              (chkLower && chkLower.checked) ||
              (chkNumbers && chkNumbers.checked) ||
              (chkSymbols && chkSymbols.checked);

            if (!anyPrimary) {
              if (chkLower) chkLower.checked = true;
              DT.toast.warning('At least one character group is required');
            }
            generateSinglePassword();
          });
        }
      });

      if (btnGenerate) {
        btnGenerate.addEventListener('click', () => {
          generateSinglePassword();
          DT.toast.success('Generated new password');
        });
      }

      if (btnCopy) {
        btnCopy.addEventListener('click', () => {
          DT.clipboard.copy(output.value, 'Password copied to clipboard!', btnCopy);
        });
      }

      if (bulkBtn) {
        bulkBtn.addEventListener('click', () => {
          generateBulk();
          DT.toast.success('Generated bulk passwords');
        });
      }

      if (bulkCopyAllBtn) {
        bulkCopyAllBtn.addEventListener('click', () => {
          const items = bulkContainer ? bulkContainer.querySelectorAll('.bulk-pwd-text') : [];
          if (items.length === 0) {
            DT.toast.warning('Generate bulk passwords first');
            return;
          }
          const allText = Array.from(items).map(el => el.textContent).join('\n');
          DT.clipboard.copy(allText, `Copied ${items.length} passwords!`, bulkCopyAllBtn);
        });
      }

      // Initial generation
      generateSinglePassword();
    }
  };

})(window.DevToolbox);
