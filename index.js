const { spawn } = require("child_process");
const path = require("path");
const os = require("os");

class EasyOCRWrapper {
    constructor() {
        this.pythonCommand = this.getPythonCommand();
        
        // Adjust the path to ocr.py
        const ocrScriptPath = path.resolve(process.cwd(), "node_modules", "easyocr-js", "ocr.py");
        console.log("OCR script path:", ocrScriptPath);
        
        this.pythonProcess = spawn(this.pythonCommand, [ocrScriptPath], {
            stdio: ["pipe", "pipe", "pipe"],
            encoding: "utf-8"
        });

        this.pythonProcess.stdout.setEncoding("utf-8");
        this.buffer = "";
        this.pythonProcess.stdout.on("data", (data) => {
            this.buffer += data;
        });

        this.pythonProcess.stderr.on("data", (errData) => {
            const errorMsg = errData.toString().trim();
            if (errorMsg.includes("Neither CUDA nor MPS are available")) {
                console.warn("Warning:", errorMsg);
            } else {
                console.error("Python Error:", errorMsg);
            }
        });

        this.pythonProcess.on("exit", (code) => {
            console.log(`Python process exited with code ${code}`);
        });
    }

    getPythonCommand() {
        return os.platform() === "win32" ? "python" : "python3";
    }

    async sendCommand(command, args = "") {
        return new Promise((resolve, reject) => {
            this.pythonProcess.stdin.write(`${command} ${args}\n`);

            this.pythonProcess.stdout.once("data", (data) => {
                try {
                    const parsedData = JSON.parse(data.toString().trim());
                    if (parsedData.status === "error") {
                        reject(new Error(parsedData.message));
                    } else {
                        resolve(parsedData);
                    }
                } catch (error) {
                    reject(new Error(`Invalid JSON response: ${data.toString()}`));
                }
            });
        });
    }

    async init(languages) {
        return this.sendCommand("init", languages);
    }

    async readText(imagePath) {
        return this.sendCommand("read_text", imagePath);
    }

    async close() {
        const response = await this.sendCommand("close").catch((err) => {
            console.error("Error while closing:", err.message);
        });

        this.pythonProcess.stdin.end();
        return response;
    }
}

module.exports = EasyOCRWrapper;
