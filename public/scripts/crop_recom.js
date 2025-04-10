document.addEventListener('DOMContentLoaded', () => {
    // Register the GSAP plugins
    gsap.registerPlugin(ScrollToPlugin);

    // Make sure all elements are visible
    document.querySelectorAll('.form-group, .input-row, input, select, label').forEach(el => {
        el.style.opacity = 1;
        el.style.visibility = 'visible';
        if (el.tagName === 'DIV') {
            el.style.display = 'block';
        }
    });

    // Reset any transform that might be hiding elements
    document.querySelectorAll('.container, .form-group').forEach(el => {
        el.style.transform = 'none';
    });

    // Disable the floating animation completely
    const floatingAnimation = gsap.getTweensOf('.container');
    floatingAnimation.forEach(tween => tween.kill());

    // Button pulse animation - simpler version
    gsap.to('.recommend-btn', {
        boxShadow: '0 0 15px rgba(106, 118, 42, 0.6)',
        scale: 1.03,
        duration: 1,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
    });

    // pH Level Slider
    const phSlider = document.getElementById('ph');
    const phValue = document.querySelector('.ph-value');

    phSlider.addEventListener('input', (e) => {
        const value = parseFloat(phSlider.value);
        phValue.textContent = value.toFixed(1);
        
        // Change color based on pH value
        let textColor;
        
        if (value < 4.5) textColor = '#ff5252'; // Strongly acidic
        else if (value < 6.5) textColor = '#ff9800'; // Acidic
        else if (value < 7.5) textColor = '#4caf50'; // Neutral
        else if (value < 8.5) textColor = '#2196f3'; // Alkaline
        else textColor = '#9c27b0'; // Strongly alkaline
        
        phValue.style.color = textColor;
    });

    // Set initial pH value
    phValue.textContent = parseFloat(phSlider.value).toFixed(1);

    // Form Submission
    const form = document.getElementById('recommendationForm');
    const resultContainer = document.getElementById('result');
    const recommendedCrop = document.getElementById('recommendedCrop');
    const cropImage = document.getElementById('cropImage');
    const cropDescription = document.getElementById('cropDescription');

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get form values
        const nitrogen = parseFloat(document.getElementById('nitrogen').value);
        const phosphorus = parseFloat(document.getElementById('phosphorus').value);
        const potassium = parseFloat(document.getElementById('potassium').value);
        const temperature = parseFloat(document.getElementById('temperature').value);
        const humidity = parseFloat(document.getElementById('humidity').value);
        const rainfall = parseFloat(document.getElementById('rainfall').value);
        const ph = parseFloat(document.getElementById('ph').value);

        // For demonstration purposes, determine crop based on simple rules
        // In a real application, this would be replaced with ML model prediction
        const crop = determineCrop(nitrogen, phosphorus, potassium, temperature, humidity, rainfall, ph);

        // Display the result
        resultContainer.style.display = 'block';
        
        // Set recommended crop
        recommendedCrop.textContent = crop.name;
        cropImage.src = crop.image;
        cropDescription.textContent = crop.description;

        // Scroll to result
        resultContainer.scrollIntoView({ behavior: 'smooth' });
    });

    function determineCrop(nitrogen, phosphorus, potassium, temperature, humidity, rainfall, ph) {
        const crops = [
            {
                name: 'Rice',
                image: 'https://assets.agriexpo.online/images/featured-images/agricultural-product-rice-5d4c0c0aa4e8a.jpg',
                description: 'Rice thrives in areas with high rainfall and humidity. It prefers temperatures between 20°C and 35°C. Ideal for lowland areas with good water retention.'
            },
            {
                name: 'Wheat',
                image: 'https://www.agrifarming.in/wp-content/uploads/2022/01/Wheat-Cultivation-Income1.jpg',
                description: 'Wheat requires moderate temperatures between 15°C and 25°C. It grows well in well-drained soils with moderate rainfall and humidity. Rich in nutrients and versatile.'
            },
            {
                name: 'Corn (Maize)',
                image: 'https://nutrienagsolutions.com.au/sites/default/files/2022-05/shutterstock_719368977%20%281%29.jpg',
                description: 'Corn needs warm temperatures between 20°C and 30°C. It requires adequate rainfall during growing season and well-drained soils. High in nitrogen demand.'
            },
            {
                name: 'Cotton',
                image: 'https://images.unsplash.com/photo-1594494842991-784fd6b814e3',
                description: 'Cotton grows best in areas with long growing seasons and plenty of sunshine. It requires temperatures between 18°C and 30°C. Moderate water needs but high humidity.'
            },
            {
                name: 'Tomato',
                image: 'https://images.unsplash.com/photo-1607305387299-a3d9611cd469',
                description: 'Tomatoes require warm temperatures between 21°C and 24°C. They need well-drained soil with pH between 6.0 and 6.8. Moderate water and humidity needs.'
            },
            {
                name: 'Potato',
                image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655',
                description: 'Potatoes grow best in cool temperatures between 15°C and 20°C. They prefer well-drained, loose soil with pH 5.0 to 6.5. Moderate rainfall requirements.'
            }
        ];

        // Simple decision logic (in a real app, this would be a trained ML model)
        if (temperature > 25 && humidity > 80 && rainfall > 200) {
            return crops[0]; // Rice
        } else if (temperature > 20 && temperature < 30 && nitrogen > 80) {
            return crops[2]; // Corn
        } else if (temperature > 15 && temperature < 25 && rainfall < 150) {
            return crops[1]; // Wheat
        } else if (temperature > 18 && humidity > 60) {
            return crops[3]; // Cotton
        } else if (temperature > 20 && ph > 6 && ph < 6.8) {
            return crops[4]; // Tomato
        } else {
            return crops[5]; // Potato
        }
    }
}); 