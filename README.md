#  Medical Report Analyzer

AI-powered medical report analysis using Google Gemini 2.5 Flash. Upload your medical reports and get instant insights on abnormal parameters, personalized recommendations, and specialist referrals.

## Features

-  **AI-Powered Analysis** - Uses Google Gemini 2.5 Flash for intelligent medical report interpretation
-  **PDF Support** - Upload and analyze PDF medical reports
-  **Abnormal Parameter Detection** - Focuses on parameters that need attention
-  **Smart Recommendations** - Get personalized health improvement suggestions
-  **Specialist Referrals** - AI suggests appropriate medical specialists
-  **Responsive Design** - Works on desktop, tablet, and mobile devices

##  Quick Start

### Prerequisites
- Python 3.7+
- Google Gemini API key ([Get one here](https://makersuite.google.com/app/apikey))

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd "Medical Report Analyser"
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   venv\Scripts\activate  # Windows
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements_minimal.txt
   ```

4. **Set up API key**
   Create a `.env` file:
   ```
   GEMINI_API_KEY=your-gemini-api-key-here
   ```

5. **Run the application**
   ```bash
   python app.py
   ```

6. **Open browser**
   Navigate to: http://localhost:5000

##  How to Use

1. **Upload** your medical report (PDF format)
2. **Click "Analyze Report"** to process with AI
3. **Review results** in the 4-column grid layout
4. **Follow recommendations** and consult suggested specialists

##  Project Structure

```
Medical Report Analyser/
├── app.py                 # Flask backend with Gemini AI
├── templates/
│   └── index.html        # Frontend interface
├── static/
│   ├── style.css         # Styling
│   └── script.js         # JavaScript functionality
├── .env                  # API key configuration
├── requirements_minimal.txt  # Python dependencies
└── README.md            # This file
```

##  Technology Stack

- **Backend**: Flask, Google Generative AI (Gemini 2.5 Flash)
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **PDF Processing**: PyPDF2
- **Environment**: Python-dotenv

##  UI Features

- **4-Column Grid Layout** - Displays abnormal parameters efficiently
- **Responsive Design** - Adapts to different screen sizes
- **Color-Coded Severity** - Visual indicators for parameter severity levels
- **Clean Interface** - Minimal, medical-focused design

##  Important Notes

- **Educational Use Only** - This tool is for educational purposes and should not replace professional medical advice
- **Data Privacy** - Files are processed temporarily and immediately deleted
- **API Costs** - Using Gemini API may incur costs based on usage

##  Development

### Adding New Features
The AI handles most medical analysis automatically. To customize:

1. **Modify prompts** in `analyze_with_gemini()` function
2. **Update UI** in `templates/index.html` and `static/` files
3. **Add new routes** in `app.py` as needed

### Environment Variables
- `GEMINI_API_KEY` - Your Google Gemini API key (required)

##  License

MIT License - Feel free to use and modify.

##  Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

##  Support

For issues or questions:
- Check the troubleshooting section above
- Create an issue in the repository
- Ensure your API key is properly configured

---

** Disclaimer**: This application is for educational and informational purposes only. Always consult qualified healthcare professionals for medical decisions and treatment.