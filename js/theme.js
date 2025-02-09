const themeToggle = document.getElementById('themeToggle');
const body = document.body;
const icon = themeToggle.querySelector('i');

// Load saved theme
const savedTheme = localStorage.getItem('theme') || 'light';
body.classList.add(`${savedTheme}-theme`);
updateIcon();

themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-theme');
    body.classList.toggle('light-theme');
    
    // Save theme preference
    const currentTheme = body.classList.contains('dark-theme') ? 'dark' : 'light';
    localStorage.setItem('theme', currentTheme);
    
    updateIcon();
});

function updateIcon() {
    const isDark = body.classList.contains('dark-theme');
    icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
}