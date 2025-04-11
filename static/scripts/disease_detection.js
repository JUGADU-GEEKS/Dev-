document.addEventListener('DOMContentLoaded', function() {
    // Tab switching functionality
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');
            
            // Update active tab button
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Show selected tab content
            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === tabId) {
                    content.classList.add('active');
                }
            });
        });
    });
    
    // Image upload functionality
    const uploadArea = document.getElementById('uploadArea');
    const uploadInstructions = document.getElementById('uploadInstructions');
    const imageInput = document.getElementById('imageInput');
    const previewImage = document.getElementById('previewImage');
    const removeImageBtn = document.getElementById('removeImage');
    
    // Handle file selection
    imageInput.addEventListener('change', function(e) {
        handleFileUpload(e.target.files[0]);
    });
    
    // Handle drag and drop
    uploadArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        uploadArea.classList.add('active');
    });
    
    uploadArea.addEventListener('dragleave', function() {
        uploadArea.classList.remove('active');
    });
    
    uploadArea.addEventListener('drop', function(e) {
        e.preventDefault();
        uploadArea.classList.remove('active');
        
        if (e.dataTransfer.files.length) {
            handleFileUpload(e.dataTransfer.files[0]);
        }
    });
    
    // Remove image button handler
    removeImageBtn.addEventListener('click', function() {
        resetImageUpload();
    });
    
    function handleFileUpload(file) {
        if (!file || !file.type.match('image.*')) {
            alert('Please select an image file (jpg, png, etc.)');
            return;
        }
        
        const reader = new FileReader();
        
        reader.onload = function(e) {
            // Show preview image
            previewImage.src = e.target.result;
            previewImage.classList.remove('hidden');
            uploadInstructions.classList.add('hidden');
            removeImageBtn.classList.remove('hidden');
        };
        
        reader.readAsDataURL(file);
    }
    
    function resetImageUpload() {
        // Reset the file input
        imageInput.value = '';
        
        // Hide preview and show upload instructions
        previewImage.src = '';
        previewImage.classList.add('hidden');
        uploadInstructions.classList.remove('hidden');
        removeImageBtn.classList.add('hidden');
    }
    
    // Form submission handlers
    const imageUploadForm = document.getElementById('imageUploadForm');
    const descriptionForm = document.getElementById('descriptionForm');
    const resultContainer = document.getElementById('result');
    
    // Handle image upload form submission
    imageUploadForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Check if an image is selected
        if (previewImage.src === '' || previewImage.classList.contains('hidden')) {
            alert('Please upload an image first');
            return;
        }
        
        // Get the selected crop type
        const cropType = document.getElementById('cropType').value;
        
        // In a real implementation, you would send the image to a server for processing
        // Here we'll just simulate a response for demonstration
        
        // Show loading state
        showLoadingState();
        
        // Simulate API call delay
        setTimeout(() => {
            // Process would normally happen on server
            const detectionResult = simulateDiseaseDetection(cropType);
            displayResults(detectionResult);
        }, 1500);
    });
    
    // Handle description form submission
    descriptionForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const cropType = document.getElementById('cropType2').value;
        const symptoms = document.getElementById('symptoms').value;
        const affectedParts = Array.from(document.querySelectorAll('input[name="affectedParts"]:checked'))
            .map(checkbox => checkbox.value);
        const spreadPattern = document.getElementById('spreadPattern').value;
        
        // Validate required fields
        if (!cropType || !symptoms) {
            alert('Please fill in all required fields');
            return;
        }
        
        // Show loading state
        showLoadingState();
        
        // Simulate API call delay
        setTimeout(() => {
            // Process would normally happen on server
            const detectionResult = simulateTextBasedDetection(cropType, symptoms, affectedParts, spreadPattern);
            displayResults(detectionResult);
        }, 1500);
    });
    
    function showLoadingState() {
        resultContainer.classList.remove('hidden');
        resultContainer.innerHTML = `
            <h2>Analyzing...</h2>
            <div style="text-align: center; padding: 2rem;">
                <div class="loading-spinner"></div>
                <p>Processing your information...</p>
            </div>
        `;
    }
    
    function displayResults(result) {
        resultContainer.classList.remove('hidden');
        
        // Scroll to results
        resultContainer.scrollIntoView({ behavior: 'smooth' });
        
        // Set results data
        document.getElementById('diseaseName').textContent = result.name;
        document.getElementById('diseaseDescription').textContent = result.description;
        document.getElementById('diseaseImage').src = result.imageUrl;
        
        // Populate treatment list
        const treatmentList = document.getElementById('treatmentList');
        treatmentList.innerHTML = '';
        
        result.treatments.forEach(treatment => {
            const li = document.createElement('li');
            li.textContent = treatment;
            treatmentList.appendChild(li);
        });
        
        resultContainer.innerHTML = `
            <h2>Detection Results</h2>
            <div class="disease-display">
                <div class="disease-image">
                    <img id="diseaseImage" src="${result.imageUrl}" alt="${result.name}">
                </div>
                <div class="disease-info">
                    <h3 id="diseaseName">${result.name}</h3>
                    <p id="diseaseDescription">${result.description}</p>
                    <div class="treatment-section">
                        <h4>Recommended Treatment</h4>
                        <ul id="treatmentList">
                            ${result.treatments.map(treatment => `<li>${treatment}</li>`).join('')}
                        </ul>
                    </div>
                </div>
            </div>
        `;
    }
    
    // Simulation functions for demo purposes
    // In a real implementation, these would be replaced with actual API calls
    
    function simulateDiseaseDetection(cropType) {
        // Mock data - in a real app, this would come from a machine learning model
        const diseases = {
            'wheat': {
                name: 'Wheat Leaf Rust',
                description: 'Leaf rust is caused by the fungus Puccinia triticina. It appears as small, round, orange-brown pustules on the leaf surface. Severe infections can lead to leaf death and reduced grain yield and quality.',
                imageUrl: 'https://www.cropscience.bayer.us/-/media/Bayer-CropScience/Country-United-States-Internet/Images/Learning-Center/Articles/Rust-In-Wheat/Wheat-Leaf-Rust.ashx?h=450&w=450&hash=B1ED8F8DEDC3C3EE0B892FA8D8FF9D43',
                treatments: [
                    'Apply appropriate fungicides at the first sign of infection',
                    'Plant resistant wheat varieties',
                    'Implement crop rotation with non-host crops',
                    'Remove volunteer wheat which can harbor the pathogen'
                ]
            },
            'rice': {
                name: 'Rice Blast',
                description: 'Rice blast is caused by the fungus Magnaporthe oryzae. It affects all above-ground parts of the rice plant, causing diamond-shaped lesions on leaves and necrosis of panicles, leading to significant yield losses.',
                imageUrl: 'https://www.infonet-biovision.org/sites/default/files/plant_health/cropsfruitsvegetables/2103_rice_blast.jpeg',
                treatments: [
                    'Apply fungicides preventatively before disease onset',
                    'Plant resistant rice varieties',
                    'Maintain proper water management in rice paddies',
                    'Avoid excessive nitrogen fertilization',
                    'Improve air circulation between plants with proper spacing'
                ]
            },
            'corn': {
                name: 'Northern Corn Leaf Blight',
                description: 'Northern corn leaf blight is caused by the fungus Exserohilum turcicum. It appears as long, cigar-shaped gray-green to tan lesions on the leaves, which can significantly reduce photosynthesis and yield.',
                imageUrl: 'https://extension.umn.edu/sites/extension.umn.edu/files/styles/caption_medium/public/nclb2.jpg?itok=GGtCWR6_',
                treatments: [
                    'Plant resistant corn hybrids',
                    'Apply foliar fungicides when disease is present',
                    'Practice crop rotation with non-host crops',
                    'Implement tillage practices to reduce residue that harbors the pathogen'
                ]
            },
            'potato': {
                name: 'Late Blight',
                description: 'Late blight is caused by the oomycete Phytophthora infestans. It appears as dark, water-soaked lesions on leaves, stems, and tubers. Under humid conditions, white fungal growth can be seen on the underside of leaves. It can rapidly destroy entire fields if left untreated.',
                imageUrl: 'https://extension.umn.edu/sites/extension.umn.edu/files/late-blight-leaf.jpg',
                treatments: [
                    'Apply preventative fungicides before disease onset',
                    'Plant certified disease-free seed potatoes',
                    'Improve air circulation by proper plant spacing',
                    'Destroy volunteer potato plants and rejected tubers',
                    'Harvest during dry conditions to prevent tuber infection'
                ]
            },
            'tomato': {
                name: 'Early Blight',
                description: 'Early blight is caused by the fungus Alternaria solani. It appears as dark brown spots with concentric rings on lower leaves first, then progresses upward. Severe infections can lead to significant defoliation and reduced yield.',
                imageUrl: 'https://extension.umn.edu/sites/extension.umn.edu/files/early-blight-tomato_0.jpg',
                treatments: [
                    'Apply fungicides at first signs of disease',
                    'Remove and destroy infected leaves',
                    'Improve air circulation through proper spacing and pruning',
                    'Use mulch to prevent soil-borne spores from splashing onto leaves',
                    'Implement crop rotation with non-solanaceous crops'
                ]
            },
            'default': {
                name: 'Unknown Plant Disease',
                description: 'Based on the image analysis, this appears to be a fungal infection affecting the plant tissue. The symptoms suggest a potentially serious condition that could affect crop yield if left untreated.',
                imageUrl: 'https://extension.sdstate.edu/sites/default/files/2020-03/S-0003-23-C.jpg',
                treatments: [
                    'Apply a broad-spectrum fungicide as a first response',
                    'Isolate affected plants to prevent spread',
                    'Improve air circulation around plants',
                    'Reduce overhead irrigation to keep foliage dry',
                    'Consult with a local agricultural extension office for specific diagnosis'
                ]
            }
        };
        
        return diseases[cropType] || diseases['default'];
    }
    
    function simulateTextBasedDetection(cropType, symptoms, affectedParts, spreadPattern) {
        // Very basic text analysis - in a real app, this would use NLP/ML
        let diseaseKey = 'default';
        
        // Very simple keyword matching
        if (cropType === 'wheat' && 
            symptoms.toLowerCase().includes('rust') || 
            symptoms.toLowerCase().includes('orange') || 
            symptoms.toLowerCase().includes('pustule')) {
            diseaseKey = 'wheat';
        } 
        else if (cropType === 'rice' && 
                (symptoms.toLowerCase().includes('blast') || 
                symptoms.toLowerCase().includes('lesion') || 
                symptoms.toLowerCase().includes('diamond'))) {
            diseaseKey = 'rice';
        }
        else if (cropType === 'corn' && 
                (symptoms.toLowerCase().includes('blight') || 
                symptoms.toLowerCase().includes('lesion') || 
                symptoms.toLowerCase().includes('cigar'))) {
            diseaseKey = 'corn';
        }
        else if (cropType === 'potato' && 
                (symptoms.toLowerCase().includes('late blight') || 
                symptoms.toLowerCase().includes('water-soaked') || 
                symptoms.toLowerCase().includes('phytophthora'))) {
            diseaseKey = 'potato';
        }
        else if (cropType === 'tomato' && 
                (symptoms.toLowerCase().includes('early blight') || 
                symptoms.toLowerCase().includes('alternaria') || 
                symptoms.toLowerCase().includes('concentric'))) {
            diseaseKey = 'tomato';
        }
        
        return simulateDiseaseDetection(diseaseKey);
    }
}); 