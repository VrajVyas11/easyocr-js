# easyocr-js

A Node.js wrapper for the Python EasyOCR library

## Description

easyocr-js is a lightweight Node.js wrapper for the EasyOCR Python library, allowing developers to perform Optical Character Recognition (OCR) in their Node.js applications with minimal setup. This package provides a simple interface to leverage EasyOCR's capabilities within JavaScript/TypeScript projects.

## Installation

```bash
npm install easyocr-js
```

### Prerequisites
- Python 3.6+ must be installed on your system.
- Pip package manager is required.
- The necessary Python dependencies will be installed automatically during the npm installation process.

## Usage

easyocr-js supports CommonJS module systems. Below is an example:

### Example

```javascript
const EasyOCRWrapper = require("easyocr-js");

(async () => {
    const ocr = new EasyOCRWrapper();
    console.log(await ocr.init("en"));
    console.log(await ocr.readText("path/to/yourimage.jpg")); // Replace with actual image path
    console.log(await ocr.close());
})();
```

## API

### `init(languages: string): Promise<object>`
Initializes the OCR reader with the specified languages.

- `languages`: Comma-separated language codes (e.g., `'en,fr'`).
- Returns a Promise resolving to a status object.

### `readText(imagePath: string): Promise<object>`
Performs OCR on the specified image.

- `imagePath`: Path to the image file.
- Returns a Promise resolving to an array of detected text objects:

```json
{
  "status": "success",
  "data": [
    {
      "bbox": [[x1, y1], [x2, y2]],
      "text": "Detected text",
      "confidence": 0.98
    }
  ]
}
```

### `close(): Promise<object>`
Closes the OCR reader and releases resources.

## Requirements

- Node.js 14.0.0 or higher
- Python 3.6 or higher
- Pip (Python package installer)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please submit a pull request with your improvements.

## Issues

If you encounter any bugs or have feature suggestions, please open an issue in the [GitHub repository](https://github.com/VrajVyas11/easyocr-js/issues).

