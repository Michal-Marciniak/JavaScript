// input element
const filterInput = document.getElementById('filter-input');  

filterInput.addEventListener('keyup', filterNames);

function filterNames(){

    // input values UpperCase 
    filteredInput = filterInput.value.toUpperCase();
    
    let li = document.querySelectorAll('li.collection-item');

    for(i=0; i<li.length; i++) {
        
        let matchedValue = li[i].getElementsByTagName('div')[0].textContent.toUpperCase();

        // If input value matched
        if(matchedValue.indexOf(filteredInput) > -1) {  // or  if(matchedValue.includes(filteredInput))
            li[i].style.display = '';
        } else {
            li[i].style.display = 'none';
        }
    }
}