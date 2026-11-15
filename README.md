# 🛠️ DevToolbox – Complete Developer Utility Toolkit

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![GitHub Pages](https://img.shields.io/badge/Hosted-GitHub%20Pages-success.svg)](https://pages.github.com/)
[![Pure Vanilla](https://img.shields.io/badge/Stack-Vanilla%20HTML5%20%7C%20CSS3%20%7C%20JS-purple.svg)](#technologies)
[![Privacy First](https://img.shields.io/badge/Privacy-100%25%20Client--Side-green.svg)](#security--privacy)

**DevToolbox** is a modern, responsive, high-performance developer toolkit crafted for engineers, software architects, and designers. It brings together 10 essential developer utilities into a single, cohesive dashboard with an ultra-sleek dark/light theme, glassmorphism aesthetics, instant search, and zero backend dependencies.

All operations execute **100% locally in your browser** using native Web APIs (`Web Crypto API`, `TextEncoder`, `TextDecoder`, etc.). No tracking, no latency, no server round-trips.

---

## 🌟 Key Features

- ⚡ **Zero-Latency Client-Side Execution** – Everything runs directly in the client browser with instantaneous feedback.
- 🔒 **Privacy-First Architecture** – Data, code, passwords, and tokens never leave your machine.
- 🎨 **Modern Dark & Light Theme** – Crafted with deep slate tones, vibrant purple/blue gradient accents, glassmorphic cards, and smooth CSS transitions.
- ⭐ **Pinned Favourites System** – Star your most frequent tools for quick access, persisted via `localStorage`.
- 🕒 **Recent Tools Tracker** – Automatically records your workflow history with relative timestamps and one-click clear.
- 🔍 **Instant Tool Search** – Real-time keyboard-first tool discovery (`Ctrl+K` or `/` shortcut) filtering across tool names, categories, and tags.
- 📋 **Seamless Clipboard Copying** – One-click copy buttons with interactive visual feedback and toast notifications.
- 📱 **100% Mobile-Friendly & Responsive** – Adapts flawlessly from 4K desktop screens down to smartphones with off-canvas navigation.
- 🌐 **GitHub Pages Ready** – Pure static architecture with relative asset paths, zero build step required.

---

## 🧰 Available Tools (10 Fully Functional Utilities)

### 🗂️ JSON Tools
1. **JSON Formatter**
   - Beautifies, formats, and indents JSON data.
   - Configurable indentation: 2 spaces, 4 spaces, or tabs.
   - One-click minification / compaction mode.
   - Live payload size calculation and line count metrics.
   - Accurate syntax error handling with line and column pointers.
   
2. **JSON Validator**
   - Rigorous JSON validation engine.
   - Visual line and column error pointers with code snippet context highlighting.
   - Structural analysis: counts total keys, arrays, and calculates maximum object depth.
   - Pre-loaded with valid and broken test samples.

### 🔤 Encoding Tools
3. **Base64 Encoder**
   - Encodes plain text and UTF-8 Unicode characters (supports emojis 🎉, accented letters, and special symbols).
   - Standard Base64 or URL-Safe Base64 (`-` and `_` characters without `=` padding).
   - Live encoding toggle as you type.

4. **Base64 Decoder**
   - Decodes standard and URL-safe Base64 strings back to clean UTF-8 plain text.
   - Automatic missing padding reconstruction.
   - Syntax validation to flag malformed Base64 sequences.

5. **URL Encoder**
   - Safely encodes URLs and query parameter strings.
   - Supports both `Component` (`encodeURIComponent`) and `Full URL` (`encodeURI`) modes.
   - Option to encode spaces as `%20` or `+`.

6. **URL Decoder**
   - Decodes percent-encoded query parameters and full URLs.
   - Option to treat `+` signs as spaces.
   - Catches malformed URI byte sequences with helpful explanations.

### 📝 Text Tools
7. **Case Converter**
   - Transforms text into 9 different developer formats:
     - `UPPERCASE`
     - `lowercase`
     - `Title Case`
     - `Sentence case`
     - `camelCase`
     - `PascalCase`
     - `snake_case`
     - `kebab-case`
     - `CONSTANT_CASE`
   - Real-time preview grid displaying every case simultaneously with individual copy and apply buttons.

8. **Word Counter & Text Analyzer**
   - Real-time metrics: words, characters (with & without spaces), sentences, paragraphs, and lines.
   - Estimated reading time (200 words/min) and speaking time (130 words/min).
   - Average word length analysis.
   - Top 5 keyword density tracker (excluding common English stop words).

### ⚙️ Generator Tools
9. **Password Generator**
   - Cryptographically secure random password generation powered by `window.crypto.getRandomValues`.
   - Length slider from 6 to 64 characters.
   - Granular character set toggles: uppercase, lowercase, numbers, and special symbols.
   - Ambiguous character exclusion (`0, O, o, 1, l, I, |`) and bracket exclusion (`{}[]()<>`).
   - Entropy meter (in bits) with animated strength bar and estimated crack time.
   - Bulk mode: generate batches of 5, 10, or 20 passwords at once with copy-all capability.

10. **Color Converter**
    - Bi-directional conversion between `HEX`, `RGB`, `HSL`, and `CMYK` formats.
    - Synchronized inputs: changes in any format automatically update all other formats.
    - Interactive native color picker and live color preview swatch.
    - Random color generator.
    - WCAG 2.1 contrast ratio analyzer with pass/fail badges for both white (#FFF) and black (#000) text.
    - Harmonies generator: complementary, analogous, and triadic color schemes with one-click selection.

---

## 💻 Technologies Used

| Technology | Purpose |
| :--- | :--- |
| **HTML5** | Semantic structure, accessible forms, meta tags |
| **CSS3** | Custom variables, glassmorphism, responsive grid & flexbox, smooth transitions |
| **Vanilla JavaScript (ES6+)** | Pure client-side logic, hash router, zero external dependencies |
| **Web Crypto API** | Secure entropy generation for the password generator (`crypto.getRandomValues`) |
| **LocalStorage API** | Persistence for theme preference, favorite tools, and recent tool history |
| **SVG Icons** | Crisp, scalable, resolution-independent vector icons |

---

## 📂 Folder Structure

```
devtoolbox/
├── index.html                 # Main single-page application entry point
├── README.md                  # Project documentation & deployment guide
├── assets/
│   └── favicon.svg            # Custom vector developer toolbox icon
├── css/
│   └── styles.css             # Unified CSS design system (Dark & Light themes)
└── js/
    ├── app.js                 # App controller, router, search, theme & state management
    ├── utils.js               # Storage, clipboard, toast notification, and DOM helpers
    └── tools/
        ├── json-tools.js      # JSON Formatter & JSON Validator
        ├── encoding-tools.js  # Base64 & URL Encoders and Decoders
        ├── text-tools.js      # Case Converter & Word Counter
        ├── password-tool.js   # Cryptographically secure Password Generator
        └── color-tool.js      # Color Converter, WCAG contrast & harmonies
```

---

## 🚀 How to Run Locally

Because DevToolbox is written in pure vanilla web technologies with zero dependencies or compilation steps, you can run it in multiple ways:

### Option 1: Direct File Execution (Simplest)
1. Clone or download the repository.
2. Locate the project folder in your file explorer.
3. Double-click `index.html` to open it directly in Google Chrome, Mozilla Firefox, Microsoft Edge, or Safari.

### Option 2: Using VS Code Live Server
1. Open the `devtoolbox` directory in [Visual Studio Code](https://code.visualstudio.com/).
2. Install the **Live Server** extension if not already installed.
3. Right-click `index.html` and click **"Open with Live Server"**.

### Option 3: Using Any Local Static Server
If you prefer a terminal server:
```bash
# Using Python 3 (if installed)
python -m http.server 8000

# Using Node npx (if installed)
npx serve .
```
Then visit `http://localhost:8000` in your web browser.

---

## 🌐 GitHub Pages Deployment Instructions

DevToolbox is pre-configured and 100% compatible with GitHub Pages out of the box:

1. **Create a GitHub Repository**:
   - Go to [GitHub](https://github.com) and create a new public repository (e.g., `devtoolbox`).

2. **Push the Files**:
   ```bash
   git init
   git add .
   git commit -m "feat: complete DevToolbox suite with 10 tools"
   git branch -M main
   git remote add origin https://github.com/<your-username>/devtoolbox.git
   git push -u origin main
   ```

3. **Enable GitHub Pages**:
   - In your GitHub repository, navigate to **Settings** > **Pages** (under the "Code and automation" section).
   - Under **Build and deployment** > **Source**, choose **Deploy from a branch**.
   - Under **Branch**, select `main` and root directory `/(root)`, then click **Save**.

4. **Access Your Live Website**:
   - GitHub Pages will deploy your site in ~1–2 minutes.
   - Your live URL will be:
     ```
     https://<your-username>.github.io/devtoolbox/
     ```

---

## 📸 Screenshots

<!-- Replace placeholders with live screenshots when deployed -->
```
+-----------------------------------------------------------------------------------------+
|  [Logo] DevToolbox                                 [Search Tools...]   [Sun/Moon] Theme |
+-----------------------------------------------------------------------------------------+
|                                                                                         |
|   Your Complete Developer Toolkit                                                       |
|   Fast, Local & Private Developer Utilities                                            |
|                                                                                         |
|   [ 10 Available Tools ]   [ 2 Pinned Favourites ]   [ 4 Recents ]   [ 4 Categories ]   |
|                                                                                         |
|   FAVOURITE TOOLS                                                                       |
|   +-----------------------+  +-----------------------+                                  |
|   | { } JSON Formatter ★  |  | 🔒 Password Gen.   ★  |                                  |
|   +-----------------------+  +-----------------------+                                  |
|                                                                                         |
|   ALL DEVELOPER TOOLS                                                                   |
|   [All] [JSON Tools] [Encoding Tools] [Text Tools] [Generators]                         |
|                                                                                         |
|   +-------------------+  +-------------------+  +-------------------+                   |
|   | JSON Formatter    |  | JSON Validator    |  | Base64 Encoder    |                   |
|   +-------------------+  +-------------------+  +-------------------+                   |
|   | Base64 Decoder    |  | URL Encoder       |  | URL Decoder       |                   |
|   +-------------------+  +-------------------+  +-------------------+                   |
|   | Case Converter    |  | Word Counter      |  | Color Converter   |                   |
|   +-------------------+  +-------------------+  +-------------------+                   |
+-----------------------------------------------------------------------------------------+
```

---

## 🔒 Security & Privacy

- **Local Execution**: All data transformations (JSON parsing, Base64/URL encoding, text counting, cryptography) are performed entirely within the client runtime.
- **No Third-Party Analytics**: No Google Analytics, cookies, telemetry, or external trackers.
- **Cryptographic Randomness**: Passwords utilize the browser's native `crypto.getRandomValues` CSPRNG, avoiding predictable pseudorandom number generators (`Math.random`).

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE). Feel free to use, modify, and distribute it for personal and commercial projects.
