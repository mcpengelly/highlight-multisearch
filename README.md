# Highlight & Search: Maps, Wikipedia, YouTube & More

A Chrome extension that lets you highlight text and search it instantly on Google Maps, Wikipedia, YouTube, Amazon, and more via the right-click menu.

## Webstore download
<!-- TODO -->

## Installation & Development

1. **Install dependencies:**
   ```sh
   npm install
   ```
2. **Build the extension:**
   ```sh
   npm run build
   ```

   - Bundled files and assets will be in the `dist/` directory.
   - Load `dist/` as an unpacked extension in Chrome.
3. **Run tests:**
   ```sh
   npm test
   ```

   - Uses Jest with ES module support for utility tests.

## Key Details & Tricky Bits

- **Modern JS:** Uses ES modules (`import`/`export`) everywhere. Utilities are shared between extension scripts and tests.
- **Bundling:** Vite bundles all extension scripts and copies static assets (manifest, icons, HTML) to `dist/`.
- **Testing:** Jest is configured for ESM. Run tests with `npm test` (uses Node's `--experimental-vm-modules`).
- **Vite config:** Multi-entry build for background, content, and options scripts. Static assets copied with `vite-plugin-static-copy`.

- **Amazon region selection:** Set in the options page; affects Amazon search URLs.

## Quick Start

- `npm install` → `npm run build` → load `dist/` in Chrome → highlight text and right-click to search!

