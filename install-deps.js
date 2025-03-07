const { execSync } = require("child_process");

function runCommand(command) {
    try {
        execSync(command, { stdio: "inherit" });
    } catch (error) {
        console.error(`Error executing command: ${command}`, error);
        process.exit(1);
    }
}

// Detect if Python is available
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

// Install required Python dependencies
runCommand(`${pythonCmd} -m pip install --upgrade pip`);
runCommand(`${pythonCmd} -m pip install easyocr`);

console.log(" EasyOCR and dependencies installed successfully.");
