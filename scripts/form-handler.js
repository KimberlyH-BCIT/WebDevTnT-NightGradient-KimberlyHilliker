// Form handler for signup form
// 
// TABLE OF CONTENTS:
// 1. DOM Element References (lines 8-10)
// 2. Animation Configuration (lines 12-30)
//    - Sign array and max count
//    - Neon color palette
// 3. Sign Generation Function (lines 32-63)
//    - Random color selection
//    - Target direction (corners/sides)
//    - Size and speed randomization
// 4. Sign Initialization (lines 65-70)
// 5. Animation Loop (lines 72-110)
//    - Position calculation
//    - Growth factor
//    - Off-screen detection and respawn
//    - Gradient generation
// 6. Form Interaction Handlers (lines 115-160)
//    - Conditional textarea display
//    - Form validation
//    - Reset functionality

document.addEventListener('DOMContentLoaded', function() {
  const hearSelect = document.getElementById('hear');
  const detailsLabel = document.getElementById('details-label');
  const detailsTextarea = document.getElementById('details');
  
  // ===== ANIMATION CONFIGURATION =====
  const body = document.body;
  const signs = [];
  const MAX_SIGNS = 100;
  const DEG_TO_RAD = Math.PI / 180;
  
  // Animation constants
  const MAX_DISTANCE = 80;
  const OPACITY_FADE_DISTANCE = 60;
  const GROWTH_DIVISOR = 40;
  const GROWTH_MULTIPLIER = 2;
  const MIN_SPEED = 0.3;
  const SPEED_RANGE = 0.4;
  const MIN_WIDTH = 150;
  const WIDTH_RANGE = 200;
  const MIN_HEIGHT = 100;
  const HEIGHT_RANGE = 200;
  
  // Pre-computed values
  const BASE_GRADIENT = 'linear-gradient(180deg, #060410 0%, #0d0815 35%, #10101a 65%, #080612 100%)';
  
  const NEON_COLORS = [
    'rgba(255, 0, 150,',
    'rgba(0, 255, 255,',
    'rgba(200, 0, 255,',
    'rgba(255, 255, 0,',
    'rgba(255, 100, 0,',
    'rgba(0, 255, 100,',
    'rgba(255, 0, 255,',
    'rgba(255, 0, 128,',
    'rgba(0, 200, 255,',
    'rgba(138, 43, 226,',
    'rgba(255, 150, 0,',
    'rgba(0, 255, 200,',
    'rgba(255, 200, 0,',
    'rgba(100, 255, 255,',
    'rgba(255, 100, 200,'
  ];
  
  const TARGETS = [
    { x: 0, y: 0, angle: Math.atan2(-50, -50) },      // Top-left corner
    { x: 100, y: 0, angle: Math.atan2(-50, 50) },     // Top-right corner
    { x: 0, y: 100, angle: Math.atan2(50, -50) },     // Bottom-left corner
    { x: 100, y: 100, angle: Math.atan2(50, 50) },    // Bottom-right corner
    { x: 0, y: 50, angle: Math.atan2(0, -50) },       // Left side
    { x: 100, y: 50, angle: Math.atan2(0, 50) }       // Right side
  ];
  
  // ===== HELPER FUNCTIONS =====
  function calculateOpacity(distance) {
    return Math.max(0, 1 - distance / OPACITY_FADE_DISTANCE);
  }
  
  function generateSign() {
    const colorBase = NEON_COLORS[Math.floor(Math.random() * NEON_COLORS.length)];
    const target = TARGETS[Math.floor(Math.random() * TARGETS.length)];
    const width = Math.random() * WIDTH_RANGE + MIN_WIDTH;
    const height = Math.random() * HEIGHT_RANGE + MIN_HEIGHT;
    const isHorizontal = Math.random() > 0.5;
    
    return {
      colorBase: colorBase,
      angle: target.angle,
      cosAngle: Math.cos(target.angle),
      sinAngle: Math.sin(target.angle),
      width: isHorizontal ? width : height,
      height: isHorizontal ? height : width,
      scale: 0,
      speed: Math.random() * SPEED_RANGE + MIN_SPEED
    };
  }
  
  // ===== ANIMATION INITIALIZATION =====
  for (let i = 0; i < MAX_SIGNS; i++) {
    const sign = generateSign();
    sign.scale = Math.random() * 70; // Stagger initial positions
    signs.push(sign);
  }
  
  function animateNeonSigns() {
    const activeGradients = [];
    
    for (let i = 0; i < signs.length; i++) {
      const sign = signs[i];
      sign.scale += sign.speed;
      
      const distance = sign.scale;
      const x = 50 + sign.cosAngle * distance;
      const y = 50 + sign.sinAngle * distance;
      
      // Check if sign moved off screen
      if (distance > MAX_DISTANCE || x < -20 || x > 120 || y < -20 || y > 120) {
        signs[i] = generateSign();
      } else {
        // Calculate size growth as sign approaches edges
        const growthFactor = 1 + (distance / GROWTH_DIVISOR) * GROWTH_MULTIPLIER;
        const currentWidth = sign.width * growthFactor;
        const currentHeight = sign.height * growthFactor;
        
        const opacity = calculateOpacity(distance);
        const opacity2 = opacity * 0.4;
        
        const gradient = `radial-gradient(ellipse ${currentWidth}px ${currentHeight}px at ${x}% ${y}%, ${sign.colorBase} ${opacity}) 0%, ${sign.colorBase} ${opacity2}) 35%, transparent 60%)`;
        activeGradients.push(gradient);
      }
    }
    
    body.style.background = activeGradients.join(', ') + ', ' + BASE_GRADIENT;
    requestAnimationFrame(animateNeonSigns);
  }
  
  // Start the animation
  animateNeonSigns();
  
  // Handle conditional display of details textarea
  if (hearSelect && detailsLabel && detailsTextarea) {
    hearSelect.addEventListener('change', function() {
      const value = this.value;
      
      // Show details field for "magic" or "other"
      if (value === 'magic' || value === 'other') {
        detailsLabel.classList.remove('visually-hidden');
        detailsTextarea.classList.remove('visually-hidden');
        detailsTextarea.required = true;
      } else {
        detailsLabel.classList.add('visually-hidden');
        detailsTextarea.classList.add('visually-hidden');
        detailsTextarea.required = false;
        detailsTextarea.value = ''; // Clear the field when hidden
      }
    });
  }
  
  // Handle form submission
  const form = document.querySelector('.form');
  if (form) {
    form.addEventListener('submit', function(e) {
      // Let the form validate naturally
      if (!this.checkValidity()) {
        e.preventDefault();
        // Browser will show validation messages
      }
    });
  }
  
  // Handle reset button
  const resetButton = document.querySelector('button[type="reset"]');
  if (resetButton) {
    resetButton.addEventListener('click', function() {
      // Hide the details field when form is reset
      if (detailsLabel && detailsTextarea) {
        detailsLabel.classList.add('visually-hidden');
        detailsTextarea.classList.add('visually-hidden');
        detailsTextarea.required = false;
      }
    });
  }
});
