document.addEventListener('DOMContentLoaded', () => {
    const proposalElement = document.getElementById('proposalMessage');
    if (proposalElement) {
        proposalElement.textContent = 'Will you be my forever? 💖';
    }

    const loveQuotesElement = document.getElementById('loveQuotes');
    if (loveQuotesElement) {
        loveQuotesElement.innerHTML = `
            <p>"Love is composed of a single soul inhabiting two bodies." - Aristotle</p>
            <p>"You know you’re in love when you can’t fall asleep because reality is finally better than your dreams." - Dr. Seuss</p>
        `;
    }

    const careMessagesElement = document.getElementById('careMessages');
    if (careMessagesElement) {
        careMessagesElement.innerHTML = `
            <p>I care about you more than words can express.</p>
            <p>Your happiness is my priority.</p>
        `;
    }

    const sharePictureButton = document.getElementById('sharePictureButton');
    if (sharePictureButton) {
        sharePictureButton.addEventListener('click', () => {
            alert('I am waiting for your picture! 😊');
        });
    }
});