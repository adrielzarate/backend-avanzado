'use strict';

const langSelect = document.querySelector('.lang-form select');

langSelect.addEventListener("change", (e) => {
    window.location.href = `/lang/${e.target.value}`;
});