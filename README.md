# multisearch-highlight

A Chrome extension for highlighting search results across multiple search engines.

## Structure

```
.
├── extension
│   ├── content.js
│   ├── background.js
│   ├── options.html
│   ├── options.js
│   ├── manifest.json
│   └── logos
│       ├── icon_16x16.png
│       ├── icon_48x48.png
│       └── icon_128x128.png
├── LICENSE
├── package.json
├── privacy-policy.md
├── README.md
├── test
│   └── utils.test.js
└── utils
    └── utils.js
```

- `extension/` contains the Chrome extension source files.
- `extension/logos/` contains icon assets.
- `test/` contains placeholder for tests.
- `utils/` contains placeholder for utility scripts.

## Installation

1. Clone this repository.
2. Go to `chrome://extensions` in your browser.
3. Enable Developer Mode.
4. Click "Load unpacked" and select the `extension/` folder.
