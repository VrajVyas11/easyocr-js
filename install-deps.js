import { execSync } from "child_process";

function runCommand(command) {
    try {
        execSync(command, { stdio: "inherit" });
    } catch (error) {
        console.error(`Error executing command: ${command}`, error);
        process.exit(1);
    }
}

function getPythonCommand() {
    try {
        execSync("python --version", { stdio: "ignore" });
        return "python";
    } catch {
        try {
            execSync("python3 --version", { stdio: "ignore" });
            return "python3";
        } catch {
            console.error("Python is not installed. Please install Python before using easyocr-wrapper.");
            process.exit(1);
        }
    }
}

const pythonCmd = getPythonCommand();
console.log(`Using ${pythonCmd} for installation...`);

// Upgrade pip
runCommand(`${pythonCmd} -m pip install --upgrade pip`);

// Install EasyOCR
runCommand(`${pythonCmd} -m pip install easyocr`);

// Install PyTorch with CUDA support
runCommand(`${pythonCmd} -m pip install torch torchvision torchaudio --extra-index-url https://download.pytorch.org/whl/cu116 --no-cache-dir`);

console.log("EasyOCR with GPU support installed successfully.");
