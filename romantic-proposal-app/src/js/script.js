function showSection(sectionId) {
    // Hide all sections
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    // Show the selected section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// Add floating hearts effect
function createFloatingHeart() {
    const heart = document.createElement('div');
    heart.innerHTML = '❤️';
    heart.style.position = 'fixed';
    heart.style.left = Math.random() * 100 + '%';
    heart.style.top = '100%';
    heart.style.fontSize = Math.random() * 20 + 20 + 'px';
    heart.style.opacity = '0.7';
    heart.style.zIndex = '999';
    heart.style.pointerEvents = 'none';
    heart.style.transition = 'all 4s linear';
    
    document.body.appendChild(heart);
    
    setTimeout(() => {
        heart.style.top = '-100px';
        heart.style.opacity = '0';
    }, 100);
    
    setTimeout(() => {
        heart.remove();
    }, 4100);
}

// Create floating hearts periodically
setInterval(createFloatingHeart, 2000);

// Add sparkle effect on mouse move
document.addEventListener('mousemove', (e) => {
    if (Math.random() > 0.9) {
        const sparkle = document.createElement('div');
        sparkle.innerHTML = '✨';
        sparkle.style.position = 'fixed';
        sparkle.style.left = e.clientX + 'px';
        sparkle.style.top = e.clientY + 'px';
        sparkle.style.pointerEvents = 'none';
        sparkle.style.fontSize = '20px';
        sparkle.style.zIndex = '999';
        sparkle.style.transition = 'all 1s ease-out';
        
        document.body.appendChild(sparkle);
        
        setTimeout(() => {
            sparkle.style.opacity = '0';
            sparkle.style.transform = 'translateY(-50px)';
        }, 10);
        
        setTimeout(() => {
            sparkle.remove();
        }, 1010);
    }
});
