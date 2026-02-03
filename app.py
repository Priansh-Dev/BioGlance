from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import os
import json
from werkzeug.utils import secure_filename
import PyPDF2
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel('gemini-2.5-flash')

UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'pdf', 'png', 'jpg', 'jpeg'}

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def extract_text_from_pdf(file_path):
    text = ""
    with open(file_path, 'rb') as file:
        pdf_reader = PyPDF2.PdfReader(file)
        for page in pdf_reader.pages:
            text += page.extract_text()
    return text

def analyze_with_gemini(text):
    prompt = f"""
Analyze this medical report and extract medical parameters with values. Determine if each is normal/abnormal.

Report: {text}

Respond in JSON format:
{{
  "parameters": [
    {{
      "name": "Parameter Name",
      "value": numeric_value,
      "unit": "unit",
      "status": "normal/high/low",
      "severity": "normal/medium/high",
      "reference_range": "min-max unit",
      "explanation": "Brief explanation"
    }}
  ],
  "recommendations": ["recommendation1", "recommendation2"],
  "specialists": ["specialist1", "specialist2"],
  "summary": "Overall health summary"
}}
"""
    
    try:
        response = model.generate_content(prompt)
        response_text = response.text.strip()
        
        if response_text.startswith('```json'):
            response_text = response_text[7:-3]
        elif response_text.startswith('```'):
            response_text = response_text[3:-3]
            
        return json.loads(response_text)
    except:
        return None

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
    
    file = request.files['file']
    if file.filename == '' or not file.filename.lower().endswith('.pdf'):
        return jsonify({'error': 'Please select a PDF file'}), 400
    
    filename = secure_filename(file.filename)
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file.save(file_path)
    
    try:
        text = extract_text_from_pdf(file_path)
        
        if not text.strip():
            return jsonify({'error': 'Could not extract text from PDF'}), 400
        
        gemini_result = analyze_with_gemini(text)
        
        if gemini_result and 'parameters' in gemini_result:
            abnormal = [p for p in gemini_result['parameters'] if p['status'] != 'normal']
            normal = [p for p in gemini_result['parameters'] if p['status'] == 'normal']
            
            analysis = {
                'abnormal': abnormal,
                'normal': normal,
                'recommendations': gemini_result.get('recommendations', []),
                'specialists': gemini_result.get('specialists', []),
                'summary': gemini_result.get('summary', '')
            }
        else:
            return jsonify({'error': 'Failed to analyze report with AI'}), 500
        
        os.remove(file_path)
        
        return jsonify({
            'success': True,
            'analysis': analysis
        })
        
    except Exception as e:
        if os.path.exists(file_path):
            os.remove(file_path)
        return jsonify({'error': f'Error processing file: {str(e)}'}), 500

if __name__ == '__main__':
    app.run(debug=True)