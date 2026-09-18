/* Portafolio retro pixel — interacciones */

(function () {
    'use strict';

    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* --- Si un sprite no carga, se oculta en lugar de mostrar el icono roto --- */
    document.querySelectorAll('img.pkm, img.corner').forEach(function (img) {
        img.addEventListener('error', function () { img.style.display = 'none'; });
        if (img.complete && img.naturalWidth === 0) img.style.display = 'none';
    });

    /* --- Texto que se escribe solo, como el diálogo del juego --- */
    var typed = document.querySelectorAll('[data-type]');

    typed.forEach(function (el, i) {
        var full = el.textContent.trim();
        if (reduced) return;

        el.textContent = '';
        el.style.minHeight = '1.45em';

        var delay = i * 700;
        setTimeout(function () {
            var n = 0;
            var timer = setInterval(function () {
                el.textContent = full.slice(0, ++n);
                if (n >= full.length) clearInterval(timer);
            }, 28);
        }, delay);
    });

    /* --- Menú navegable con flechas y Enter --- */
    var items = Array.prototype.slice.call(document.querySelectorAll('.menu-buttons .btn'));
    if (!items.length) return;

    var index = 0;
    items[0].classList.add('is-active');

    function select(next) {
        items[index].classList.remove('is-active');
        index = (next + items.length) % items.length;
        items[index].classList.add('is-active');
        items[index].focus();
    }

    document.addEventListener('keydown', function (e) {
        switch (e.key) {
            case 'ArrowRight':
            case 'ArrowDown':
                e.preventDefault(); select(index + 1); break;
            case 'ArrowLeft':
            case 'ArrowUp':
                e.preventDefault(); select(index - 1); break;
            case 'Enter':
                if (document.activeElement === document.body) {
                    e.preventDefault(); items[index].click();
                }
                break;
        }
    });

    items.forEach(function (el, i) {
        el.addEventListener('mouseenter', function () {
            items[index].classList.remove('is-active');
            index = i;
            el.classList.add('is-active');
        });
    });
})();
