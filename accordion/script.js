document.addEventListener("DOMContentLoaded", function () {
    initializeAccordions();
});

function initializeAccordions() {
    const accordionButtons = document.querySelectorAll(".accordion-header");

    accordionButtons.forEach(button => {
        button.innerHTML += getSvgData();
        button.addEventListener("click", toggleAccordion);
    });
}

function toggleAccordion(event) {
    const button = event.currentTarget;
    const panel = button.nextElementSibling;

    if (panel.style.height) {
        closeAccordion(panel, button);
    } else {
        openAccordion(panel, button);
    }
}

function openAccordion(panel, button) {
    panel.style.height = panel.scrollHeight + "px";
    panel.classList.add('open');
    button.classList.add('active');
}

function closeAccordion(panel, button) {
    panel.style.height = null;
    panel.addEventListener('transitionend', function handler() {
        panel.classList.remove('open');
        panel.removeEventListener('transitionend', handler);
    });
    button.classList.remove('active');
}

function getSvgData() {
    return `
    <span class="accordion-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x" viewBox="0 0 16 16">
            <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z"></path>
        </svg>
    </span>`;
}
