import { execSync } from "child_process";

function runCommand(command) {
  try {
    const startTime = performance.now();
    execSync(command, { stdio: "inherit" });
    const endTime = performance.now();
    console.log(`[TIME] '${command}' completed in ${(endTime - startTime) / 1000}s`);
  } catch (error) {
    console.error(`Error executing command: '${command}'`, error.message);
    process.exit(1);
  }
}

function getPythonCommand() {
  const pythonVariants = ["python", "python3", "py"];
  for (const cmd of pythonVariants) {
    try {
      const version = execSync(`${cmd} --version`, { encoding: "utf-8", stdio: "pipe" });
      console.log(`Found ${cmd}: ${version.trim()}`);
      return cmd;
    } catch {
      continue;
    }
  }
  console.error(
    "Python is not installed. Please install Python (3.7-3.11 recommended) before proceeding."
  );
  process.exit(1);
}

console.log("Checking Python installation...");
const pythonCmd = getPythonCommand();
console.log(`Using ${pythonCmd} for installation...`);

// Upgrade pip
runCommand(`${pythonCmd} -m pip install --upgrade pip`);

// Install PaddleOCR dependencies
console.log("Installing PaddleOCR dependencies...");
// Install PaddlePaddle (CPU version)
runCommand(`${pythonCmd} -m pip install paddlepaddle `);

// Install PaddleOCR
runCommand(`${pythonCmd} -m pip install paddleocr`);

// Install OpenCV for preprocessing
runCommand(`${pythonCmd} -m pip install opencv-python`);

// Optional: Install PaddlePaddle with CUDA support (if GPU desired)
try {
  console.log("Attempting to install PaddlePaddle with CUDA support...");
  // Note: Adjust CUDA version based on your system (e.g., cu118 for CUDA 11.8)
  runCommand(`${pythonCmd} -m pip install paddlepaddle-gpu `);
  console.log("PaddlePaddle with CUDA installed. Update 'use_gpu=True' in ocr.py for GPU support.");
} catch (error) {
  console.warn("Failed to install PaddlePaddle with CUDA. Continuing with CPU version.");
}

console.log("PaddleOCR and dependencies installed successfully!");