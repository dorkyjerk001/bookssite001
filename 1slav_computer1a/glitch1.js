let currentImageIndex = 0;
const images = [
    'img1/1preview_Image02.jpg',
    'img1/1thorntrip5_Image06.jpg',
    'img1/1thorntrip5_Image20.jpg',
    'img1/1preview_Image03.png',
    'img1/1thorntrip5_Image21.jpg'
];

// Function to apply random glitch effects to the background
function glitchBackground() {
    const body = document.body;
    const glitchEffects = [
        'filter: blur(2px);',
        'filter: brightness(0.8);',
        'filter: contrast(1.5);',
        'filter: hue-rotate(90deg);',
        'filter: saturate(1.5);',
        'filter: sepia(0.5);',
        'transform: scale(1.05);',
        'transform: rotate(1deg);',
        'opacity: 0.9;'
    ];
    const randomEffect = glitchEffects[Math.floor(Math.random() * glitchEffects.length)];
    body.style.cssText += randomEffect;

    // Reset the effect after a short duration
    setTimeout(() => {
        body.style.cssText = body.style.cssText.replace(randomEffect, '');
    }, 500);
}

// Function to create random flickering effect
function flickerBackground() {
    const body = document.body;
    const flickerDuration = Math.random() * 300 + 100; // Random flicker duration between 100ms and 400ms
    body.style.opacity = '0.5'; // Dim the background
    setTimeout(() => {
        body.style.opacity = '1'; // Restore opacity
    }, flickerDuration);
}

// Function to show random error messages
function showRandomError() {
    const errorMessages = [
        "Error 404: Unicorns not found!",
        "Oops! Something went wrong with the toaster.",
        "Warning: Cats are taking over the internet!",
        "Error: Too much awesomeness detected!",
        "Do you love Gadget Hackwrench?",
        "Alert: Your socks are mismatched!",
        "Error: The coffee machine is out of order!",
        "Oops! The squirrels have escaped!",
        "Do you love Gadget Hackwrench? (Version 2)",
        "Warning: Your browser is now a potato!",
        "Do you love Gadget Hackwrench? (Limited Edition)",
        "Error: The sky is falling!",
        "Do you love Gadget Hackwrench? (Special Offer)",
        "Oops! Your computer has turned into a pumpkin!"
    ];

    const randomMessage = errorMessages[Math.floor(Math.random() * errorMessages.length)];
    alert(randomMessage);
}

// Function to zoom, pan, rotate, and switch background images
function transformBackground() {
    const body = document.body;
    const scale = Math.random() * (1.5 - 0.8) + 0.8; // Random scale between 0.8 and 1.5
    const rotate = Math.random() * 360; // Random rotation between 0 and 360 degrees
    const translateX = Math.random() * 100 - 50; // Random pan in X direction
    const translateY = Math.random() * 100 - 50; // Random pan in Y direction

    body.style.transition = 'transform 1s ease, background-image 1s ease';
    body.style.transform = `scale(${scale}) rotate(${rotate}deg) translate(${translateX}px, ${translateY}px)`;

    // Switch background image
    currentImageIndex = (currentImageIndex + 1) % images.length;
    body.style.backgroundImage = `url(${images[currentImageIndex]})`;

    // Reset transform after a short duration
    setTimeout(() => {
        body.style.transform = 'scale(1) rotate(0deg) translate(0, 0)';
    }, 1000);
}

// Set intervals for glitch effects, flickering, error messages, and background transformations
setInterval(glitchBackground, 1000); // Glitch every second
setInterval(flickerBackground, 2000); // Flicker every 2 seconds
setInterval(showRandomError, 5000); // Show random error every 5 seconds
setInterval(transformBackground, 8000); // Transform background every 8 seconds
