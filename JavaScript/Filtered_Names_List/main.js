// input element
const filterInput = document.getElementById('filter-input');  

filterInput.addEventListener('keyup', filterNames);

function filterNames(){

    // input values UpperCase 
    filteredInput = filterInput.value.toUpperCase();
    
    let li = document.querySelectorAll('li.collection-item');

    li.forEach(listItem => {
        if(listItem.getElementsByTagName('div')[0].textContent.toUpperCase().indexOf(filteredInput) > -1) {
            listItem.style.display = '';
        } else {
            listItem.style.display = 'none';
        }
    })
}
