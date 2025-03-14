declare module "easyocr-js" {
    export default class EasyOCRWrapper {
      constructor();
      init(language: string): Promise<string>;
      readText(imagePath: string): Promise<string>;
      close(): Promise<string>;
    }
  }