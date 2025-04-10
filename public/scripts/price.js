document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('predictionForm');
    const resultContainer = document.getElementById('result');
    const predictedPrice = document.getElementById('predictedPrice');

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get form values
        const crop = document.getElementById('crop').value;
        const date = document.getElementById('date').value;
        const rainfall = parseFloat(document.getElementById('rainfall').value);
        const city = document.getElementById('city').value;

        // For demonstration purposes, we'll generate a random price
        // In a real application, this would be replaced with an API call
        const basePrices = {
            wheat: 25,
            rice: 30,
            corn: 20,
            soybean: 35,
            cotton: 40
        };

        // Simple price calculation (for demonstration)
        let price = basePrices[crop] || 0;
        
        // Adjust price based on rainfall (simple simulation)
        if (rainfall > 100) {
            price *= 0.9; // 10% decrease for heavy rainfall
        } else if (rainfall < 50) {
            price *= 1.1; // 10% increase for low rainfall
        }

        // Add some random variation
        price *= (0.95 + Math.random() * 0.1);

        // Display the result
        predictedPrice.textContent = `₹${price.toFixed(2)}`;
        resultContainer.style.display = 'block';

        // Scroll to result
        resultContainer.scrollIntoView({ behavior: 'smooth' });
    });
}); 