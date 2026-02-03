const dropZone = document.getElementById('drop-zone');
const fileInput = document.getElementById('file-input');
const analyzeBtn = document.getElementById('analyze-btn');
const uploadSection = document.getElementById('upload-section');
const resultsSection = document.getElementById('results-section');

let selectedFile = null;

// Trigger file input on click
dropZone.onclick = () => fileInput.click();

fileInput.onchange = (e) => {
    if (e.target.files.length > 0) {
        selectedFile = e.target.files[0];
        dropZone.querySelector('p').innerText = `File selected: ${selectedFile.name}`;
        analyzeBtn.disabled = false;
    }
};

analyzeBtn.onclick = async () => {
    if (!selectedFile) return;
    
    analyzeBtn.innerText = "Processing with AI...";
    analyzeBtn.disabled = true;
    
    try {
        const formData = new FormData();
        formData.append('file', selectedFile);
        
        const response = await fetch('http://localhost:5000/upload', {
            method: 'POST',
            body: formData
        });
        
        const result = await response.json();
        
        if (result.success) {
            displayResults(result.analysis);
            uploadSection.classList.add('hidden');
            resultsSection.classList.remove('hidden');
        } else {
            alert('Error: ' + result.error);
            analyzeBtn.innerText = "Analyze Report";
            analyzeBtn.disabled = false;
        }
    } catch (error) {
        alert('Error connecting to server. Please make sure the backend is running.');
        analyzeBtn.innerText = "Analyze Report";
        analyzeBtn.disabled = false;
    }
};

// Drag and drop visual effects
dropZone.ondragover = (e) => { e.preventDefault(); dropZone.classList.add('active'); };
dropZone.ondragleave = () => dropZone.classList.remove('active');
dropZone.ondrop = (e) => {
    e.preventDefault();
    selectedFile = e.dataTransfer.files[0];
    fileInput.files = e.dataTransfer.files;
    dropZone.classList.remove('active');
    dropZone.querySelector('p').innerText = `File selected: ${selectedFile.name}`;
    analyzeBtn.disabled = false;
};

function displayResults(analysis) {
    // Update status summary
    const abnormalBadge = document.querySelector('.badge.abnormal');
    const normalBadge = document.querySelector('.badge.normal');
    
    abnormalBadge.textContent = `${analysis.abnormal.length} Abnormal Flags`;
    normalBadge.textContent = `${analysis.normal.length} Normal Parameters`;
    
    // Display only abnormal parameters in 4-column grid
    const abnormalGrid = document.getElementById('abnormal-grid');
    abnormalGrid.innerHTML = '';
    
    if (analysis.abnormal.length === 0) {
        abnormalGrid.innerHTML = '<div style="grid-column: 1 / -1; text-align: center; color: #16a34a; font-weight: 600; padding: 40px;">🎉 All parameters are within normal ranges!</div>';
    } else {
        analysis.abnormal.forEach(param => {
            abnormalGrid.appendChild(createParameterCard(param));
        });
    }
    
    // Update recommendations section
    const summaryText = document.getElementById('summary-text');
    const recommendationsList = document.getElementById('recommendations-list');
    const specialistsList = document.getElementById('specialists-list');
    
    if (analysis.summary) {
        summaryText.innerHTML = `<p style="background: #f0f9ff; padding: 15px; border-radius: 8px; margin-bottom: 15px;"><strong>Summary:</strong> ${analysis.summary}</p>`;
    }
    
    recommendationsList.innerHTML = analysis.recommendations.map(rec => `<li>${rec}</li>`).join('');
    specialistsList.innerHTML = `<strong>Recommended Specialists:</strong> ${analysis.specialists.join(', ')}`;
}

function createParameterCard(param) {
    const card = document.createElement('div');
    card.className = `parameter-card ${param.severity || param.status}`;
    
    card.innerHTML = `
        <div class="param-info">
            <h4>${param.name}</h4>
            <span class="value">${param.value} ${param.unit}</span>
        </div>
        <p class="insight">
            ${param.explanation || `Status: <strong>${param.status.charAt(0).toUpperCase() + param.status.slice(1)}</strong>`}
        </p>
        ${param.reference_range ? `<small style="color: #64748b;">Normal: ${param.reference_range}</small>` : ''}
    `;
    
    return card;
}

function calculateGaugePosition(param) {
    // Extract min and max from reference_range
    const rangeMatch = param.reference_range.match(/(\d+(?:\.\d+)?)-(\d+(?:\.\d+)?)/); 
    if (!rangeMatch) return 50; // Default to middle if can't parse
    
    const min = parseFloat(rangeMatch[1]);
    const max = parseFloat(rangeMatch[2]);
    const position = ((param.value - min) / (max - min)) * 100;
    return Math.min(Math.max(position, 0), 100);
}