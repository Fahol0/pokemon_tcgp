const toggleSideMenuButton = document.getElementById('toggle-side-menu');
const sideMenu = document.getElementById('side-menu');
const globalOverlay = document.getElementById('global-overlay');
const modalOverlay = document.getElementById('modal-overlay');
const openModalButtons = document.querySelectorAll('.open-modal');
const modals = document.querySelectorAll('.modal');
const closeModalButtons = document.querySelectorAll('.close-modal');

let modal_opened = false;

// Afficher ou masquer le menu et l'overlay global
toggleSideMenuButton.addEventListener('click', () => {
    sideMenu.classList.toggle('open');
    globalOverlay.style.display = sideMenu.classList.contains('open') ? 'block' : 'none';
});

// Ouvrir une modale spécifique lorsque l'on clique sur un bouton
openModalButtons.forEach(button => {
    button.addEventListener('click', () => {
        const modalId = button.getAttribute('data-modal');
        const modal = document.getElementById(modalId);
        if (modal_opened) {
            modals.style.display = 'none';
        }
        else {
            modal.style.display = 'block';
            modalOverlay.style.display = 'block';
            modal_opened = true;
        }
    });
});

// Fermer la modale lorsqu'on clique sur le bouton de fermeture
closeModalButtons.forEach(button => {
    button.addEventListener('click', () => {
        const modal = button.closest('.modal');
        modal.style.display = 'none';
        modalOverlay.style.display = 'none';
        modal_opened = false;
    });
});

// Fermer la modale lorsque l'on clique en dehors de celle-ci
modalOverlay.addEventListener('click', () => {
    modals.forEach(modal => {
        modal.style.display = 'none';
    });
    modalOverlay.style.display = 'none';
    modal_opened = false;
});

// Fermer la modale lorsque l'on clique en dehors de celle-ci
globalOverlay.addEventListener('click', () => {
    sideMenu.classList.remove('open');
    globalOverlay.style.display = 'none';
    modals.forEach(modal => {
        modal.style.display = 'none';
    });
});
