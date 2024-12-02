const toggleButton = document.getElementById('toggle-tabs-button');
const menu = document.getElementById('menu');
const head = document.getElementById('head');
let clicked = 0;

toggleButton.addEventListener('click', () => {
    menu.classList.toggle('collapse');
    head.classList.toggle('collapse');
    toggleButton.classList.toggle('rotate');
    clicked = !clicked;
    console.log(`clicked = ${clicked}`);
});

window.addEventListener('scroll', () => {
    if (window.scrollY === 0 && clicked) {
        menu.classList.toggle('collapse');
        head.classList.toggle('collapse');
        toggleButton.classList.toggle('rotate');
        clicked = !clicked;
        console.log(`clicked = ${clicked}`);
    }
});
