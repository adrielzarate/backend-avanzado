'use strict';

const langSelect = document.querySelector('.lang-form select');

langSelect.addEventListener("change", (e) => {
    window.location.href = `/lang/${e.target.value}`;
});

const addTagBtn = document.querySelector('#addTagBtn');
const tagInput = document.querySelector('#tagInput');
const tagsInput = document.querySelector('#tagsInput');

if( addTagBtn != undefined ) {
    addTagBtn.addEventListener('click', function(e) {
        e.preventDefault();
        let tagInputVal = tagInput.value;
        tagInput.value = '';
        if(tagInputVal != '' && tagInputVal != ',' ) {
            tagsInput.value = tagsInput.value.replace(/\s/g, '') + ',' + tagInputVal.replace(/\s/g, '');
        }
        tagsInput.value = tagsInput.value[0] == ',' ? tagsInput.value.substring(1) : tagsInput.value;
        tagsInput.value = tagsInput.value[tagsInput.value.length - 1] == ',' ? tagsInput.value.slice(0, -1) : tagsInput.value;
    });
}


if( addTagBtn != undefined ) {
    const eventList = ['keydown', 'paste'];
    for(let event of eventList) {
        tagsInput.addEventListener(event, function(e) {
            e.preventDefault();
        });
    }
}