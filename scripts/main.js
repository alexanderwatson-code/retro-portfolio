/* Portafolio retro pixel — interacciones */

(function () {
    'use strict';

    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* --- Efectos de sonido ---
       Cada punto de la interfaz llama a playSfx('nombre'). Mientras no
       pongas un archivo, el <audio data-sfx="nombre"> correspondiente no
       tiene src y esto no hace nada ni da error. Para activar un sonido,
       en cada página pon el archivo en sfx/ y agrega el src, por ejemplo:
       <audio data-sfx="boot" src="sfx/boot.wav" preload="auto"></audio> */
    function playSfx(name) {
        var el = document.querySelector('audio[data-sfx="' + name + '"]');
        if (el && el.currentSrc) {
            el.currentTime = 0;
            el.play().catch(function () {});
        }
    }

    /* --- Cortina entre páginas --- */
    var wipe = document.getElementById('page-wipe');

    if (wipe && !reduced) {
        requestAnimationFrame(function () {
            setTimeout(function () { wipe.classList.add('is-open'); }, 70);
        });

        document.addEventListener('click', function (e) {
            var a = e.target.closest('a[href$=".html"]');
            if (!a || a.target === '_blank' || e.metaKey || e.ctrlKey || e.shiftKey) return;
            var href = a.getAttribute('href');
            if (!href || href.indexOf('http') === 0) return;

            e.preventDefault();
            playSfx('page');
            wipe.classList.remove('is-open');
            setTimeout(function () { window.location.href = href; }, 380);
        });

        /* Si vuelve por el botón "atrás" desde la caché del navegador,
           la cortina puede quedar cerrada del salto anterior. */
        window.addEventListener('pageshow', function (e) {
            if (e.persisted) wipe.classList.add('is-open');
        });
    }

    /* --- Pantalla de encendido (solo en las páginas que la incluyen) --- */
    var boot = document.getElementById('boot-screen');

    if (boot) {
        if (sessionStorage.getItem('aw_booted') === '1') {
            boot.style.display = 'none';
        } else if (reduced) {
            boot.classList.add('is-ready');
            armBootDismiss();
        } else {
            setTimeout(function () { boot.classList.add('is-playing'); }, 250);
            setTimeout(function () { boot.classList.add('is-flashing'); playSfx('boot'); }, 900);
            setTimeout(function () { boot.classList.add('is-naming'); }, 1150);
            setTimeout(function () { boot.classList.add('is-ready'); armBootDismiss(); }, 2250);
        }
    }

    function armBootDismiss() {
        function dismiss(e) {
            if (e && e.type === 'keydown' && e.key !== 'Enter' && e.key !== ' ') return;
            if (e) e.preventDefault();
            document.removeEventListener('keydown', dismiss);
            boot.removeEventListener('click', dismiss);
            boot.removeEventListener('touchstart', dismiss);
            playSfx('confirm');
            sessionStorage.setItem('aw_booted', '1');
            boot.classList.add('is-done');
            setTimeout(function () { boot.style.display = 'none'; }, 380);
        }
        document.addEventListener('keydown', dismiss);
        boot.addEventListener('click', dismiss);
        boot.addEventListener('touchstart', dismiss, { passive: true });
    }

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
        playSfx('move');
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
