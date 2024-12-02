const toggleSideMenuButton = document.getElementById('toggle-side-menu');
const sideMenu = document.getElementById('side-menu');
const globalOverlay = document.getElementById('global-overlay');
const openModalButtons = document.querySelectorAll('.open-modal');
const modals = document.querySelectorAll('.modal');
const closeModalButtons = document.querySelectorAll('.close-modal');

toggleSideMenuButton.addEventListener('click', () => {
    sideMenu.classList.toggle('open');
    globalOverlay.style.display = sideMenu.classList.contains('open') ? 'block' : 'none';
});

openModalButtons.forEach(button => {
    button.addEventListener('click', () => {
        const modalId = button.getAttribute('data-modal');
        const modal = document.getElementById(modalId);
        modal.style.display = 'block';
    });
});

closeModalButtons.forEach(button => {
    button.addEventListener('click', () => {
        const modal = button.closest('.modal');
        modal.style.display = 'none';
    });
});

globalOverlay.addEventListener('click', () => {
    sideMenu.classList.remove('open');
    globalOverlay.style.display = 'none';
    modals.forEach(modal => {
        modal.style.display = 'none';
    });
});
