import sys
import json
from paddleocr import PaddleOCR
import io
import logging
import time

# Configure stdout for JSON responses
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')

# Suppress PaddleOCR logs to stderr
logging.getLogger('ppocr').setLevel(logging.ERROR)
logging.getLogger('paddleocr').setLevel(logging.ERROR)

reader = None

def init_reader(languages):
    start_time = time.time()
    global reader
    try:
        lang = languages.split(',')[0].strip() if languages else 'en'
        reader = PaddleOCR(
            use_angle_cls=True,       # Enable angle classification
            lang=lang,
            use_gpu=False,            # CPU only
            det_db_thresh=0.3,        # Sensitive detection
            det_db_box_thresh=0.5,    # Retain more boxes
            det_limit_side_len=960,   # Larger size for detail
            det_db_unclip_ratio=1.2,  # Tighter boxes to avoid merging
            rec_batch_num=1,
            max_batch_size=1,
            enable_mkldnn=True,
            cpu_threads=4,
            rec_algorithm='CRNN',     # Accurate recognition
            show_log=False
        )
        end_time = time.time()
        print(f"[TIME] Initialization: {end_time - start_time:.3f}s", file=sys.stderr)
        return json.dumps({"status": "success", "message": "Reader initialized"})
    except Exception as e:
        print(f"[TIME] Initialization failed: {time.time() - start_time:.3f}s", file=sys.stderr)
        return json.dumps({"status": "error", "message": f"Failed to initialize: {str(e)}"})


def read_text(image_path):
    if reader is None:
        return json.dumps({"status": "error", "message": "Reader not initialized"})
    try:
        start_time = time.time()
        cleaned_image_path = image_path.replace(" ", "")
        img = cleaned_image_path
        
        ocr_start = time.time()
        result = reader.ocr(img, cls=True)
        ocr_end = time.time()
        print(f"[TIME] OCR Processing: {ocr_end - ocr_start:.3f}s", file=sys.stderr)
        
        if not result or not result[0]:
            end_time = time.time()
            print(f"[TIME] Total read_text: {end_time - start_time:.3f}s", file=sys.stderr)
            return json.dumps({"status": "success", "data": []})

        formatted_result = [
            {
                'bbox': [[int(coord[0]), int(coord[1])] for coord in line[0]],
                'text': line[1][0],  # Keep raw text (spacing handled by preprocessing)
                'confidence': float(line[1][1])
            }
            for line in result[0]
        ]
        
        end_time = time.time()
        print(f"[TIME] Total read_text: {end_time - start_time:.3f}s", file=sys.stderr)
        return json.dumps({"status": "success", "data": formatted_result})
    except Exception as e:
        end_time = time.time()
        print(f"[TIME] read_text failed: {end_time - start_time:.3f}s", file=sys.stderr)
        return json.dumps({"status": "error", "message": f"Error reading text: {str(e)}"})

def process_command(command, args):
    start_time = time.time()
    if command == 'init':
        result = init_reader(args)
    elif command == 'read_text':
        result = read_text(args)
    elif command == 'close':
        result = json.dumps({"status": "success", "message": "Closing process"})
    else:
        result = json.dumps({"status": "error", "message": "Invalid command"})
    end_time = time.time()
    print(f"[TIME] Command '{command}': {end_time - start_time:.3f}s", file=sys.stderr)
    return result

if __name__ == '__main__':
    while True:
        try:
            line = sys.stdin.readline().strip()
            if not line:
                break

            parts = line.split(maxsplit=1)
            command = parts[0]
            args = parts[1] if len(parts) > 1 else ""

            result = process_command(command, args)
            sys.stdout.write(result + '\n')
            sys.stdout.flush()

            if command == 'close':
                break
        except Exception as e:
            sys.stdout.write(json.dumps({"status": "error", "message": str(e)}) + '\n')
            sys.stdout.flush()