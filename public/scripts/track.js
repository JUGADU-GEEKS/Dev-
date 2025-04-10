document.addEventListener('DOMContentLoaded', function() {
    // Sample data for initial display
    const initialCrops = [
        {
            week: 1,
            height: 11.34,
            points: 5,
            image: '../public/images/week1.webp',
            uploaded: true
        },
        {
            week: 2,
            height: 16.2,
            points: 10,
            image: '../public/images/week2.jpg',
            uploaded: true
        },
        {
            week: 3,
            height: 34.48,
            points: 10,
            image: '../public/images/week3.webp',
            uploaded: true
        }
    ];

    // Initialize the tracker with sample data
    initializeTracker(initialCrops);

    // Handle new week upload
    document.getElementById('uploadBtn').addEventListener('click', uploadNewWeek);

    // Handle dropdown selection
    const dropdownItems = document.querySelectorAll('.dropdown-item');
    dropdownItems.forEach(item => {
        item.addEventListener('click', function(e) {
            document.getElementById('cropSelector').innerHTML = e.target.innerHTML;
            
            // Animate the dropdown when selecting a new crop
            gsap.from(document.getElementById('cropSelector'), {
                scale: 1.1,
                duration: 0.4,
                ease: "back.out(1.7)"
            });
            
            // You could load specific crop data here based on selection
        });
    });

    // Apply theme colors to carousel controls
    const carouselPrevNext = document.querySelectorAll('.carousel-control-prev, .carousel-control-next');
    carouselPrevNext.forEach(control => {
        control.style.backgroundColor = 'rgba(178, 172, 136, 0.3)';
        control.style.width = '40px';
        control.style.height = '40px';
        control.style.top = '50%';
        control.style.borderRadius = '50%';
        control.style.transform = 'translateY(-50%)';
    });
    
    // Add animation to form inputs
    gsap.utils.toArray('input, textarea').forEach(input => {
        input.addEventListener('focus', function() {
            gsap.to(this, {
                borderColor: '#6a762a',
                duration: 0.3,
                ease: "power2.out"
            });
        });
        
        input.addEventListener('blur', function() {
            gsap.to(this, {
                borderColor: '#ced4da',
                duration: 0.3,
                ease: "power2.out"
            });
        });
    });
});

// Initialize the carousel with crop data
function initializeTracker(crops) {
    const carouselInner = document.querySelector('.carousel-inner');
    const indicators = document.querySelector('.carousel-indicators');
    
    carouselInner.innerHTML = '';
    indicators.innerHTML = '';
    
    crops.forEach((crop, index) => {
        // Create carousel item
        const item = document.createElement('div');
        item.className = `carousel-item ${index === 0 ? 'active' : ''}`;
        
        // Create crop card
        item.innerHTML = `
            <div class="col-md-8 mx-auto">
                <div class="crop-card">
                    <img src="${crop.image}" alt="Crop Week ${crop.week}" class="crop-image">
                    <div class="crop-week">Week ${crop.week}</div>
                    <div class="crop-details">
                        <i class="fas fa-star text-warning me-1"></i>
                        Points: <span class="fw-bold">${crop.points}</span>
                    </div>
                    <div class="crop-details">
                        <i class="fas fa-seedling text-olive me-1"></i>
                        Height: <span class="fw-bold">${crop.height} cm</span>
                    </div>
                    <div class="uploaded-badge">
                        <i class="fas fa-check-circle me-1"></i>
                        UPLOADED
                    </div>
                    <div class="action-buttons">
                        <button class="action-btn download-btn" title="Download Image">
                            <i class="fas fa-download"></i>
                        </button>
                        <button class="action-btn" title="Settings">
                            <i class="fas fa-cog"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
        carouselInner.appendChild(item);
        
        // Create indicator
        const indicator = document.createElement('button');
        indicator.type = 'button';
        indicator.setAttribute('data-bs-target', '#weeklyTracker');
        indicator.setAttribute('data-bs-slide-to', index);
        if (index === 0) {
            indicator.classList.add('active');
            indicator.setAttribute('aria-current', 'true');
        }
        indicator.setAttribute('aria-label', `Week ${crop.week}`);
        indicators.appendChild(indicator);
    });
    
    // Animate all crop cards on initial load
    gsap.from('.crop-card', {
        opacity: 0,
        y: 50,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out",
        delay: 0.5
    });
}

// Function to handle new week upload
function uploadNewWeek() {
    const heightInput = document.getElementById('cropHeight');
    const imageInput = document.getElementById('cropImage');
    const notesInput = document.getElementById('cropNotes');
    
    if (!heightInput.value || !imageInput.files[0]) {
        showAlert('Please enter height and upload an image', 'warning');
        
        // Shake animation for invalid inputs
        gsap.to(heightInput.parentElement, {
            x: [-10, 10, -10, 10, 0],
            duration: 0.5,
            ease: "power1.inOut"
        });
        
        gsap.to(imageInput.parentElement, {
            x: [-10, 10, -10, 10, 0],
            duration: 0.5,
            ease: "power1.inOut"
        });
        
        return;
    }
    
    // Get existing weeks to determine next week number
    const existingWeeks = document.querySelectorAll('.crop-week');
    const nextWeek = existingWeeks.length + 1;
    
    // Calculate points based on growth (simplified example)
    const points = nextWeek * 5 <= 25 ? nextWeek * 5 : 25; // Cap at 25 points
    
    // Create a temporary URL for the uploaded image
    const imageURL = URL.createObjectURL(imageInput.files[0]);
    
    // Animate the upload button
    gsap.to('#uploadBtn', {
        scale: 0.95,
        duration: 0.2,
        ease: "power2.in",
        onComplete: function() {
            gsap.to('#uploadBtn', {
                scale: 1,
                duration: 0.5,
                ease: "elastic.out(1, 0.3)"
            });
            
            // Add new week to tracker
            addNewWeek({
                week: nextWeek,
                height: parseFloat(heightInput.value),
                points: points,
                image: imageURL,
                notes: notesInput.value,
                uploaded: true
            });
            
            // Reset form
            heightInput.value = '';
            imageInput.value = '';
            notesInput.value = '';
            
            // Show success message
            showAlert(`Week ${nextWeek} progress uploaded successfully! You earned ${points} points.`, 'success');
        }
    });
}

// Function to add a new week to the tracker
function addNewWeek(weekData) {
    const carouselInner = document.querySelector('.carousel-inner');
    const indicators = document.querySelector('.carousel-indicators');
    
    // Get current number of weeks
    const currentWeeks = carouselInner.querySelectorAll('.carousel-item').length;
    
    // Create new carousel item
    const item = document.createElement('div');
    item.className = 'carousel-item';
    
    // Create crop card
    item.innerHTML = `
        <div class="col-md-8 mx-auto">
            <div class="crop-card">
                <img src="${weekData.image}" alt="Crop Week ${weekData.week}" class="crop-image">
                <div class="crop-week">Week ${weekData.week}</div>
                <div class="crop-details">
                    <i class="fas fa-star text-warning me-1"></i>
                    Points: <span class="fw-bold">${weekData.points}</span>
                </div>
                <div class="crop-details">
                    <i class="fas fa-seedling text-olive me-1"></i>
                    Height: <span class="fw-bold">${weekData.height} cm</span>
                </div>
                ${weekData.notes ? `<div class="crop-details"><i class="fas fa-sticky-note text-sage me-1"></i>Notes: ${weekData.notes}</div>` : ''}
                <div class="uploaded-badge">
                    <i class="fas fa-check-circle me-1"></i>
                    UPLOADED
                </div>
                <div class="action-buttons">
                    <button class="action-btn download-btn" title="Download Image">
                        <i class="fas fa-download"></i>
                    </button>
                    <button class="action-btn" title="Settings">
                        <i class="fas fa-cog"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
    carouselInner.appendChild(item);
    
    // Create indicator
    const indicator = document.createElement('button');
    indicator.type = 'button';
    indicator.setAttribute('data-bs-target', '#weeklyTracker');
    indicator.setAttribute('data-bs-slide-to', currentWeeks);
    indicator.setAttribute('aria-label', `Week ${weekData.week}`);
    indicators.appendChild(indicator);
    
    // Show the newly added week
    const carousel = new bootstrap.Carousel(document.getElementById('weeklyTracker'));
    carousel.to(currentWeeks);
    
    // Get the newly added card and animate its entrance
    const newCard = carouselInner.lastElementChild.querySelector('.crop-card');
    
    // Set initial state
    gsap.set(newCard, {
        opacity: 0,
        scale: 0.8,
        y: 50
    });
    
    // Animate entrance
    gsap.to(newCard, {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 1,
        ease: "elastic.out(1, 0.5)",
        onComplete: function() {
            // Add a subtle highlight effect
            gsap.fromTo(newCard, 
                { boxShadow: "0 0 0 rgba(106, 118, 42, 0.7)" },
                { 
                    boxShadow: "0 0 20px rgba(106, 118, 42, 0.7)", 
                    duration: 1,
                    yoyo: true,
                    repeat: 1
                }
            );
        }
    });
    
    // Animate the points display
    const pointsElement = newCard.querySelector('.crop-details:first-of-type .fw-bold');
    gsap.from(pointsElement, {
        textContent: 0,
        duration: 1.5,
        snap: { textContent: 1 },
        ease: "power2.out"
    });
}

// Helper function to show alerts
function showAlert(message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-4`;
    alertDiv.style.zIndex = '9999';
    alertDiv.role = 'alert';
    
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    
    document.body.appendChild(alertDiv);
    
    // Animate alert entrance
    gsap.from(alertDiv, {
        y: -50,
        opacity: 0,
        duration: 0.5,
        ease: "back.out(1.7)"
    });
    
    // Auto dismiss after 3 seconds
    setTimeout(() => {
        gsap.to(alertDiv, {
            opacity: 0,
            y: -20,
            duration: 0.5,
            ease: "power2.in",
            onComplete: function() {
                const bsAlert = new bootstrap.Alert(alertDiv);
                bsAlert.close();
            }
        });
    }, 3000);
}

// Helper function to format date
function formatDate(date) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(date).toLocaleDateString('en-US', options);
} 