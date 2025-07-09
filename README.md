# Highlight & Search: Maps, Wikipedia, YouTube & More

A Chrome extension that lets you highlight text and search it instantly on Google Maps, Wikipedia, YouTube, Amazon, and more via the right-click menu.

**Effective Date:** [Set your date]  
## Webstore download
<!-- TODO -->

## Installation & Development

1. **Install dependencies:**
   ```sh
   npm install
   ```
2. **Package the extension:**
   ```sh
   npm run publish
   ```
   - This will create `multisearch-highlight.zip` containing the extension/ folder for upload to the Chrome Web Store.
   - For local testing, load the `extension/` folder as an unpacked extension in Chrome.
3. **Run tests:**
   ```sh
   npm test
   ```
   - Uses Jest with ES module support for utility tests.

## Key Details

- **Modern JS:** Uses ES modules (`import`/`export`) everywhere. Utilities are shared between extension scripts and tests.
- **No content scripts:** The extension does not inject any code into web pages. All logic is handled via background scripts and context menus.
- **Bundling:** Vite bundles all extension scripts and copies static assets (manifest, icons, HTML) to `dist/` (if you use a build step for future features).
- **Testing:** Jest is configured for ESM. Run tests with `npm test` (uses Node's `--experimental-vm-modules`).

- **Amazon region selection:** Set in the options page; affects Amazon search URLs.

## Quick Start

- `npm install` → `npm run publish` → load `extension/` in Chrome → highlight text and right-click to search!

