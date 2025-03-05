document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.page-nav__day').forEach(day => {
        day.addEventListener('click', (event) => {
            event.preventDefault();
            window.location.href = day.getAttribute('href');
        });
    });
});

