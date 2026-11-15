/**
 * DevToolbox - Text Tools
 * 7. Case Converter
 * 8. Word Counter
 */

window.DevToolbox = window.DevToolbox || {};
window.DevToolbox.tools = window.DevToolbox.tools || {};

(function (DT) {
  'use strict';

  // --- Case Conversion Helpers ---
  function toWords(str) {
    if (!str) return [];
    // Match sequences of alphanumeric characters, splitting on case switches and delimiters
    return str
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/[^a-zA-Z0-9]+/g, ' ')
      .trim()
      .split(/\s+/)
      .filter(Boolean);
  }

  const CASE_CONVERTERS = {
    upper: (text) => text.toUpperCase(),
    lower: (text) => text.toLowerCase(),
    title: (text) => {
      // Capitalize first letter of every word
      return text.toLowerCase().replace(/(^|\s|[^\w'])\w/g, (match) => match.toUpperCase());
    },
    sentence: (text) => {
      // Capitalize first letter of each sentence, lowercase the rest
      return text.toLowerCase().replace(/(^\s*|[.!?]\s+)(\w)/g, (match, prefix, char) => {
        return prefix + char.toUpperCase();
      });
    },
    camel: (text) => {
      const words = toWords(text);
      if (words.length === 0) return '';
      return words[0].toLowerCase() + words.slice(1).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('');
    },
    pascal: (text) => {
      const words = toWords(text);
      return words.map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('');
    },
    snake: (text) => {
      const words = toWords(text);
      return words.map(w => w.toLowerCase()).join('_');
    },
    kebab: (text) => {
      const words = toWords(text);
      return words.map(w => w.toLowerCase()).join('-');
    },
    constant: (text) => {
      const words = toWords(text);
      return words.map(w => w.toUpperCase()).join('_');
    }
  };

  // --- 7. Case Converter Tool Controller ---
  DT.tools.caseConverter = {
    init() {
      const container = document.getElementById('tool-case-converter');
      if (!container) return;

      const input = container.querySelector('#case-input');
      const clearBtn = container.querySelector('#case-clear-btn');
      const sampleBtn = container.querySelector('#case-sample-btn');
      const copyAllBtn = container.querySelector('#case-copy-btn');
      const actionButtons = container.querySelectorAll('[data-case-action]');
      const previewsContainer = container.querySelector('#case-previews-list');
      const statsBadge = container.querySelector('#case-stats');

      const caseLabels = {
        upper: 'UPPERCASE',
        lower: 'lowercase',
        title: 'Title Case',
        sentence: 'Sentence case',
        camel: 'camelCase',
        pascal: 'PascalCase',
        snake: 'snake_case',
        kebab: 'kebab-case',
        constant: 'CONSTANT_CASE'
      };

      function updatePreviews() {
        const text = input.value;
        if (!text) {
          if (previewsContainer) {
            previewsContainer.innerHTML = `
              <div class="empty-state">
                ${DT.getIcon('text', 'empty-icon')}
                <p>Type or paste text above to see conversions across all cases</p>
              </div>
            `;
          }
          if (statsBadge) statsBadge.textContent = '0 characters | 0 words';
          return;
        }

        const words = text.trim() ? text.trim().split(/\s+/).length : 0;
        if (statsBadge) {
          statsBadge.textContent = `${text.length} characters | ${words} words`;
        }

        if (previewsContainer) {
          let html = '';
          Object.keys(CASE_CONVERTERS).forEach(caseKey => {
            const converted = CASE_CONVERTERS[caseKey](text);
            const label = caseLabels[caseKey] || caseKey;
            html += `
              <div class="case-preview-card" data-key="${caseKey}">
                <div class="case-card-header">
                  <span class="case-card-label">${label}</span>
                  <div class="case-card-actions">
                    <button type="button" class="btn btn-xs btn-outline btn-case-apply" data-case="${caseKey}" title="Apply this case to input">Apply</button>
                    <button type="button" class="btn btn-xs btn-outline btn-case-copy" data-case="${caseKey}" title="Copy to clipboard">
                      ${DT.getIcon('copy', 'btn-icon')} Copy
                    </button>
                  </div>
                </div>
                <div class="case-card-text">${DT.escapeHtml(converted)}</div>
              </div>
            `;
          });
          previewsContainer.innerHTML = html;

          // Attach copy and apply events to the cards
          previewsContainer.querySelectorAll('.btn-case-copy').forEach(btn => {
            btn.addEventListener('click', () => {
              const caseKey = btn.getAttribute('data-case');
              const converted = CASE_CONVERTERS[caseKey](input.value);
              DT.clipboard.copy(converted, `${caseLabels[caseKey]} copied!`, btn);
            });
          });

          previewsContainer.querySelectorAll('.btn-case-apply').forEach(btn => {
            btn.addEventListener('click', () => {
              const caseKey = btn.getAttribute('data-case');
              input.value = CASE_CONVERTERS[caseKey](input.value);
              updatePreviews();
              DT.toast.success(`Applied ${caseLabels[caseKey]}`);
            });
          });
        }
      }

      if (input) {
        input.addEventListener('input', updatePreviews);
      }

      // Main action buttons (top bar quick triggers)
      actionButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          const action = btn.getAttribute('data-case-action');
          if (CASE_CONVERTERS[action]) {
            input.value = CASE_CONVERTERS[action](input.value);
            updatePreviews();
            DT.toast.success(`Transformed to ${caseLabels[action] || action}`);
          }
        });
      });

      if (sampleBtn) {
        sampleBtn.addEventListener('click', () => {
          input.value = 'hello world! welcome to DevToolbox: the ultimate suite for modern web developers.';
          updatePreviews();
          DT.toast.info('Sample text loaded');
        });
      }

      if (clearBtn) {
        clearBtn.addEventListener('click', () => {
          input.value = '';
          updatePreviews();
          DT.toast.info('Cleared text');
        });
      }

      if (copyAllBtn) {
        copyAllBtn.addEventListener('click', () => {
          DT.clipboard.copy(input.value, 'Input text copied!', copyAllBtn);
        });
      }

      // Initial state
      updatePreviews();
    }
  };

  // --- 8. Word Counter Tool Controller ---
  DT.tools.wordCounter = {
    init() {
      const container = document.getElementById('tool-word-counter');
      if (!container) return;

      const input = container.querySelector('#wc-input');
      const clearBtn = container.querySelector('#wc-clear-btn');
      const sampleBtn = container.querySelector('#wc-sample-btn');
      const copyBtn = container.querySelector('#wc-copy-btn');

      // Metric elements
      const elWords = container.querySelector('#wc-stat-words');
      const elChars = container.querySelector('#wc-stat-chars');
      const elCharsNoSpaces = container.querySelector('#wc-stat-chars-no-spaces');
      const elSentences = container.querySelector('#wc-stat-sentences');
      const elParagraphs = container.querySelector('#wc-stat-paragraphs');
      const elLines = container.querySelector('#wc-stat-lines');
      const elReadingTime = container.querySelector('#wc-stat-reading-time');
      const elSpeakingTime = container.querySelector('#wc-stat-speaking-time');
      const elAvgWordLen = container.querySelector('#wc-stat-avg-word-len');
      const elKeywords = container.querySelector('#wc-keyword-density');

      const STOP_WORDS = new Set([
        'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i',
        'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at',
        'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she',
        'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what',
        'so', 'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go', 'me',
        'when', 'make', 'can', 'like', 'time', 'no', 'just', 'him', 'know', 'take',
        'people', 'into', 'year', 'your', 'good', 'some', 'could', 'them', 'see', 'other',
        'than', 'then', 'now', 'look', 'only', 'come', 'its', 'over', 'think', 'also'
      ]);

      function calculateMetrics() {
        const text = input.value;
        const trimmed = text.trim();

        // 1. Words
        const wordsArray = trimmed ? trimmed.split(/\s+/).filter(Boolean) : [];
        const wordsCount = wordsArray.length;

        // 2. Characters
        const charsWithSpaces = text.length;
        const charsNoSpaces = text.replace(/\s/g, '').length;

        // 3. Sentences
        const sentencesArray = trimmed ? trimmed.split(/[.!?]+(?:\s+|$)/).filter(s => s.trim().length > 0) : [];
        const sentencesCount = sentencesArray.length;

        // 4. Paragraphs
        const paragraphsArray = trimmed ? trimmed.split(/\n\s*\n/).filter(p => p.trim().length > 0) : [];
        const paragraphsCount = paragraphsArray.length;

        // 5. Lines
        const linesCount = text ? text.split('\n').length : 0;

        // 6. Reading time (200 words/min)
        const readingMinutes = Math.ceil(wordsCount / 200);
        const readingSecs = Math.round((wordsCount / 200) * 60);
        let readingTimeStr = '0 sec';
        if (wordsCount > 0) {
          readingTimeStr = readingSecs < 60 ? `${readingSecs} sec` : `~${readingMinutes} min`;
        }

        // 7. Speaking time (130 words/min)
        const speakingMinutes = Math.ceil(wordsCount / 130);
        const speakingSecs = Math.round((wordsCount / 130) * 60);
        let speakingTimeStr = '0 sec';
        if (wordsCount > 0) {
          speakingTimeStr = speakingSecs < 60 ? `${speakingSecs} sec` : `~${speakingMinutes} min`;
        }

        // 8. Average word length
        let totalWordChars = 0;
        wordsArray.forEach(w => totalWordChars += w.replace(/[^a-zA-Z0-9]/g, '').length);
        const avgWordLen = wordsCount > 0 ? (totalWordChars / wordsCount).toFixed(1) : '0';

        // Update DOM stats
        if (elWords) elWords.textContent = wordsCount.toLocaleString();
        if (elChars) elChars.textContent = charsWithSpaces.toLocaleString();
        if (elCharsNoSpaces) elCharsNoSpaces.textContent = charsNoSpaces.toLocaleString();
        if (elSentences) elSentences.textContent = sentencesCount.toLocaleString();
        if (elParagraphs) elParagraphs.textContent = paragraphsCount.toLocaleString();
        if (elLines) elLines.textContent = linesCount.toLocaleString();
        if (elReadingTime) elReadingTime.textContent = readingTimeStr;
        if (elSpeakingTime) elSpeakingTime.textContent = speakingTimeStr;
        if (elAvgWordLen) elAvgWordLen.textContent = avgWordLen;

        // 9. Keyword Frequency
        if (elKeywords) {
          if (wordsCount === 0) {
            elKeywords.innerHTML = '<div class="empty-keywords">Type or paste text to analyze keyword density</div>';
          } else {
            const freq = {};
            wordsArray.forEach(rawWord => {
              const clean = rawWord.toLowerCase().replace(/[^a-z0-9]/g, '');
              if (clean.length > 2 && !STOP_WORDS.has(clean)) {
                freq[clean] = (freq[clean] || 0) + 1;
              }
            });

            const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 5);

            if (sorted.length === 0) {
              elKeywords.innerHTML = '<div class="empty-keywords">No significant keywords found yet</div>';
            } else {
              let kwHtml = '<div class="keyword-chips-list">';
              sorted.forEach(([word, count]) => {
                const percent = ((count / wordsCount) * 100).toFixed(1);
                kwHtml += `
                  <div class="keyword-chip">
                    <span class="kw-word">${DT.escapeHtml(word)}</span>
                    <span class="kw-badge">${count} (${percent}%)</span>
                  </div>
                `;
              });
              kwHtml += '</div>';
              elKeywords.innerHTML = kwHtml;
            }
          }
        }
      }

      if (input) {
        input.addEventListener('input', calculateMetrics);
      }

      if (sampleBtn) {
        sampleBtn.addEventListener('click', () => {
          input.value = `DevToolbox is an all-in-one developer toolkit crafted for modern web engineers, designers, and software architects. It combines rapid text processing, JSON formatting, password creation, encoding utilities, and color conversions into a singular, high-performance web dashboard.

Whether formatting deeply nested API payloads or generating cryptographically secure credentials, DevToolbox provides instant results entirely in your browser with zero server roundtrips.

Privacy is paramount: all calculations, conversions, and cryptographic operations execute locally on your machine via standard web APIs.`;
          calculateMetrics();
          DT.toast.info('Sample text loaded');
        });
      }

      if (clearBtn) {
        clearBtn.addEventListener('click', () => {
          input.value = '';
          calculateMetrics();
          DT.toast.info('Cleared text');
        });
      }

      if (copyBtn) {
        copyBtn.addEventListener('click', () => {
          DT.clipboard.copy(input.value, 'Text copied to clipboard!', copyBtn);
        });
      }

      // Initial run
      calculateMetrics();
    }
  };

})(window.DevToolbox);
