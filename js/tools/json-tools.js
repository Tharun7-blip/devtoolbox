/**
 * DevToolbox - JSON Tools
 * 1. JSON Formatter
 * 2. JSON Validator
 */

window.DevToolbox = window.DevToolbox || {};
window.DevToolbox.tools = window.DevToolbox.tools || {};

(function (DT) {
  'use strict';

  // Sample JSON datasets for demonstration
  const SAMPLE_VALID_JSON = `{
  "name": "DevToolbox",
  "version": "1.0.0",
  "description": "All-in-one developer utility toolkit",
  "openSource": true,
  "stats": {
    "totalTools": 10,
    "rating": 4.98
  },
  "tags": ["developer", "utilities", "productivity", "formatter"],
  "maintainer": {
    "name": "Frontend Team",
    "email": "dev@example.com"
  }
}`;

  const SAMPLE_INVALID_JSON = `{
  "name": "DevToolbox",
  "version": "1.0.0",
  // Comment not allowed in standard JSON!
  "tags": ["developer", "utilities",], // trailing comma error!
  'singleQuotes': 'invalid in JSON'
}`;

  /**
   * Helper to parse JSON and get detailed line/col on error
   */
  function parseJsonWithDetails(rawString) {
    try {
      const parsed = JSON.parse(rawString);
      return { success: true, data: parsed, error: null };
    } catch (err) {
      const message = err.message;
      let line = 1;
      let column = 1;
      let position = null;

      // Extract position from message if available (e.g. "at position 42")
      const posMatch = message.match(/at position (\d+)/i);
      if (posMatch) {
        position = parseInt(posMatch[1], 10);
        const lines = rawString.substring(0, position).split('\n');
        line = lines.length;
        column = lines[lines.length - 1].length + 1;
      } else {
        // Fallback line regex (e.g. "at line 2 column 5")
        const lineMatch = message.match(/line (\d+) column (\d+)/i);
        if (lineMatch) {
          line = parseInt(lineMatch[1], 10);
          column = parseInt(lineMatch[2], 10);
        }
      }

      // Generate snippet preview around error
      let snippet = '';
      if (rawString) {
        const lines = rawString.split('\n');
        const errLineIdx = line - 1;
        const start = Math.max(0, errLineIdx - 2);
        const end = Math.min(lines.length - 1, errLineIdx + 2);
        const snippetLines = [];
        for (let i = start; i <= end; i++) {
          const prefix = i === errLineIdx ? '>> ' : '   ';
          const lineNum = String(i + 1).padStart(4, ' ');
          snippetLines.push(`${prefix}${lineNum} | ${lines[i]}`);
          if (i === errLineIdx && column > 0) {
            const pointerPad = ' '.repeat(8 + Math.max(0, column - 1));
            snippetLines.push(`${pointerPad}^ Error near here`);
          }
        }
        snippet = snippetLines.join('\n');
      }

      return {
        success: false,
        data: null,
        error: {
          message: err.message,
          line,
          column,
          position,
          snippet
        }
      };
    }
  }

  /**
   * Calculate detailed metadata for valid JSON
   */
  function analyzeJson(data) {
    let keyCount = 0;
    let arrayCount = 0;
    let maxDepth = 0;

    function traverse(node, currentDepth) {
      if (currentDepth > maxDepth) maxDepth = currentDepth;
      if (node && typeof node === 'object') {
        if (Array.isArray(node)) {
          arrayCount++;
          node.forEach(item => traverse(item, currentDepth + 1));
        } else {
          const keys = Object.keys(node);
          keyCount += keys.length;
          keys.forEach(k => traverse(node[k], currentDepth + 1));
        }
      }
    }

    traverse(data, 1);
    return { keyCount, arrayCount, maxDepth };
  }

  // --- 1. JSON Formatter Tool Controller ---
  DT.tools.jsonFormatter = {
    init() {
      const container = document.getElementById('tool-json-formatter');
      if (!container) return;

      const inputArea = container.querySelector('#json-fmt-input');
      const outputArea = container.querySelector('#json-fmt-output');
      const indentSelect = container.querySelector('#json-fmt-indent');
      const formatBtn = container.querySelector('#json-fmt-btn');
      const minifyBtn = container.querySelector('#json-fmt-minify-btn');
      const sampleBtn = container.querySelector('#json-fmt-sample-btn');
      const clearBtn = container.querySelector('#json-fmt-clear-btn');
      const copyBtn = container.querySelector('#json-fmt-copy-btn');
      const errorBox = container.querySelector('#json-fmt-error');
      const statsBadge = container.querySelector('#json-fmt-stats');

      function getIndent() {
        const val = indentSelect ? indentSelect.value : '2';
        if (val === 'tab') return '\t';
        if (val === '4') return 4;
        return 2;
      }

      function format(minify = false) {
        const raw = inputArea.value.trim();
        if (!raw) {
          outputArea.value = '';
          errorBox.classList.add('hidden');
          errorBox.innerHTML = '';
          if (statsBadge) statsBadge.textContent = 'No data';
          return;
        }

        const res = parseJsonWithDetails(raw);
        if (!res.success) {
          errorBox.classList.remove('hidden');
          errorBox.innerHTML = `
            <div class="error-badge">${DT.getIcon('alert', 'error-badge-icon')} JSON Syntax Error</div>
            <div class="error-msg">${DT.escapeHtml(res.error.message)} (Line ${res.error.line}, Column ${res.error.column})</div>
            ${res.error.snippet ? `<pre class="error-snippet">${DT.escapeHtml(res.error.snippet)}</pre>` : ''}
          `;
          DT.toast.error('Invalid JSON. Check line ' + res.error.line);
          return;
        }

        errorBox.classList.add('hidden');
        errorBox.innerHTML = '';

        let formatted = '';
        if (minify) {
          formatted = JSON.stringify(res.data);
        } else {
          formatted = JSON.stringify(res.data, null, getIndent());
        }

        outputArea.value = formatted;

        // Update stats
        const originalBytes = new Blob([raw]).size;
        const newBytes = new Blob([formatted]).size;
        const diffPercent = originalBytes > 0 ? (((newBytes - originalBytes) / originalBytes) * 100).toFixed(1) : 0;
        const diffText = diffPercent > 0 ? `+${diffPercent}%` : `${diffPercent}%`;

        if (statsBadge) {
          statsBadge.textContent = `Size: ${DT.formatBytes(newBytes)} (${diffText}) | Lines: ${formatted.split('\n').length}`;
        }

        DT.toast.success(minify ? 'JSON minified successfully' : 'JSON formatted successfully');
      }

      if (formatBtn) {
        formatBtn.addEventListener('click', () => format(false));
      }

      if (minifyBtn) {
        minifyBtn.addEventListener('click', () => format(true));
      }

      if (sampleBtn) {
        sampleBtn.addEventListener('click', () => {
          inputArea.value = SAMPLE_VALID_JSON;
          format(false);
        });
      }

      if (clearBtn) {
        clearBtn.addEventListener('click', () => {
          inputArea.value = '';
          outputArea.value = '';
          errorBox.classList.add('hidden');
          errorBox.innerHTML = '';
          if (statsBadge) statsBadge.textContent = 'Ready';
          DT.toast.info('Cleared fields');
        });
      }

      if (copyBtn) {
        copyBtn.addEventListener('click', () => {
          DT.clipboard.copy(outputArea.value, 'Formatted JSON copied to clipboard!', copyBtn);
        });
      }

      // Live auto-format on indent change if output is already populated
      if (indentSelect) {
        indentSelect.addEventListener('change', () => {
          if (outputArea.value.trim()) {
            format(false);
          }
        });
      }
    }
  };

  // --- 2. JSON Validator Tool Controller ---
  DT.tools.jsonValidator = {
    init() {
      const container = document.getElementById('tool-json-validator');
      if (!container) return;

      const inputArea = container.querySelector('#json-val-input');
      const validateBtn = container.querySelector('#json-val-btn');
      const sampleValidBtn = container.querySelector('#json-val-sample-valid');
      const sampleInvalidBtn = container.querySelector('#json-val-sample-invalid');
      const clearBtn = container.querySelector('#json-val-clear-btn');
      const resultCard = container.querySelector('#json-val-result');
      const copyBtn = container.querySelector('#json-val-copy-btn');

      function validate() {
        const raw = inputArea.value.trim();
        if (!raw) {
          resultCard.className = 'val-result-box empty';
          resultCard.innerHTML = `
            <div class="empty-state">
              ${DT.getIcon('json', 'empty-icon')}
              <p>Enter JSON in the input area above and click <strong>Validate JSON</strong></p>
            </div>
          `;
          return;
        }

        const res = parseJsonWithDetails(raw);
        if (res.success) {
          const stats = analyzeJson(res.data);
          const formatted = JSON.stringify(res.data, null, 2);
          resultCard.className = 'val-result-box valid';
          resultCard.innerHTML = `
            <div class="val-header valid">
              <span class="status-indicator valid">${DT.getIcon('check', 'status-icon')} VALID JSON</span>
              <span class="val-metrics">Total Keys: <strong>${stats.keyCount}</strong> | Arrays: <strong>${stats.arrayCount}</strong> | Max Depth: <strong>${stats.maxDepth}</strong></span>
            </div>
            <div class="val-body">
              <p class="val-summary">Your JSON is syntactically correct and ready for production API usage.</p>
              <div class="val-preview-header">
                <span>Formatted Preview (${DT.formatBytes(new Blob([raw]).size)}):</span>
                <button type="button" class="btn btn-xs btn-outline" id="json-val-preview-copy">${DT.getIcon('copy', 'btn-icon')} Copy JSON</button>
              </div>
              <pre class="val-code-preview"><code>${DT.escapeHtml(formatted)}</code></pre>
            </div>
          `;

          const pCopyBtn = resultCard.querySelector('#json-val-preview-copy');
          if (pCopyBtn) {
            pCopyBtn.addEventListener('click', () => {
              DT.clipboard.copy(formatted, 'Valid JSON copied to clipboard!', pCopyBtn);
            });
          }

          DT.toast.success('JSON is valid and formatted!');
        } else {
          resultCard.className = 'val-result-box invalid';
          resultCard.innerHTML = `
            <div class="val-header invalid">
              <span class="status-indicator invalid">${DT.getIcon('alert', 'status-icon')} INVALID JSON</span>
              <span class="val-location">Error at <strong>Line ${res.error.line}</strong>, <strong>Column ${res.error.column}</strong></span>
            </div>
            <div class="val-body">
              <div class="val-error-message">
                <strong>Syntax Error:</strong> ${DT.escapeHtml(res.error.message)}
              </div>
              ${res.error.snippet ? `
                <div class="val-snippet-container">
                  <div class="snippet-title">Error Context in Source:</div>
                  <pre class="error-snippet">${DT.escapeHtml(res.error.snippet)}</pre>
                </div>
              ` : ''}
              <div class="val-hints">
                <strong>Common JSON Pitfalls:</strong>
                <ul>
                  <li>Keys and string values must be enclosed in double quotes (<code>"key"</code>, not <code>'key'</code>).</li>
                  <li>Trailing commas are not allowed after the last property or array item.</li>
                  <li>JavaScript comments (<code>//</code> or <code>/* */</code>) are forbidden in standard JSON.</li>
                  <li>Undefined and unquoted functions or NaN cannot be serialized.</li>
                </ul>
              </div>
            </div>
          `;
          DT.toast.error(`Invalid JSON: Line ${res.error.line}`);
        }
      }

      if (validateBtn) {
        validateBtn.addEventListener('click', validate);
      }

      if (sampleValidBtn) {
        sampleValidBtn.addEventListener('click', () => {
          inputArea.value = SAMPLE_VALID_JSON;
          validate();
        });
      }

      if (sampleInvalidBtn) {
        sampleInvalidBtn.addEventListener('click', () => {
          inputArea.value = SAMPLE_INVALID_JSON;
          validate();
        });
      }

      if (clearBtn) {
        clearBtn.addEventListener('click', () => {
          inputArea.value = '';
          resultCard.className = 'val-result-box empty';
          resultCard.innerHTML = `
            <div class="empty-state">
              ${DT.getIcon('json', 'empty-icon')}
              <p>Enter JSON in the input area above and click <strong>Validate JSON</strong></p>
            </div>
          `;
          DT.toast.info('Cleared validator');
        });
      }

      if (copyBtn) {
        copyBtn.addEventListener('click', () => {
          DT.clipboard.copy(inputArea.value, 'Input JSON copied!', copyBtn);
        });
      }
    }
  };

})(window.DevToolbox);
