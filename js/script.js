console.log("start");

const URL = 'https://rickandmortyapi.com/api/';
let CURRENT_PAGE = 1;
let MAX_PAGES = null;
let NEXT_PAGE = null;
let PREVIOUS_PAGE = null;

let setCharacters = data => {
    document.getElementById('characters_grid').textContent = "";
    (data.results).forEach(r => {
        el = document.createElement('div');
        el.className = 'character';
        el.onclick = (e) => {
            modal.style.display = "block";
            setModalCharacter(e);
        }
        el.innerHTML = `<img class="character_image" src="${r.image}"></img>
                        <div class="character_info">
                            <div class="character_name">${r.name}</div>
                            <div class="character_status ${r.status}">${r.status} - ${r.gender}</div>
                        </div>
                        <input class="character_id" type="hidden" value="${r.id}">`;     
        document.getElementById('characters_grid').appendChild(el);
    });
}
let setModalCharacter = e => {
    console.log(e.target);
    let target = (e.target).closest(`.character`);
    let target_id = (target).querySelector('.character_id');
    if (target_id) {
        fetchData(`${URL}character/${target_id.value}`).then(data => {
            let el = document.getElementsByClassName('modal-content')[0];
            el.innerHTML = `
                <div class="modal_main_area">
                    <img src="${data.image}" alt="" class="modal_main_img">
                    <div class="modal_main_title">${data.name}</div>
                    <div class="modal_main_status ${data.status}">${data.status} - ${data.species}</div>
                </div>
                <div class="modal_secondary_area">
                    <div>Gender: ${data.gender}</div>
                    <div>Last seen location: ${data.location.name}</div>
                    <div>Number of episodes appeared: ${data.episode.length}</div>
                </div>`
        });
    }
}
let setPages = data => {
    MAX_PAGES = data.info.pages;
    NEXT_PAGE = data.info.next;
    PREVIOUS_PAGE = data.info.prev;
    if (data.info.prev == null) {
        CURRENT_PAGE = 1;
    } else {
        const word_position = (data.info.prev).search("page=");
        CURRENT_PAGE = parseInt((data.info.prev).slice(word_position + 5)) + 1;
    }
    document.getElementById('pagination_info').innerHTML = `${CURRENT_PAGE} of ${MAX_PAGES}`;

    if (CURRENT_PAGE == MAX_PAGES) {
        document.getElementsByClassName("next")[0].classList.add("inactive");
        document.getElementsByClassName("previous")[0].classList.remove("inactive");
    }
    else if (CURRENT_PAGE == 1) {
        document.getElementsByClassName("previous")[0].classList.add("inactive");
        document.getElementsByClassName("next")[0].classList.remove("inactive");
    } else {
        document.getElementsByClassName("previous")[0].classList.remove("inactive");
        document.getElementsByClassName("next")[0].classList.remove("inactive");
    }
}
let setErrorMessage = message => {
    let el = document.createElement('span');
    el.className = 'error_message';
    el.innerHTML = message;     
    document.getElementById('characters_grid').appendChild(el);
}
let nextPage = () => {
    if (CURRENT_PAGE < MAX_PAGES) {
        fetchData(NEXT_PAGE).then(data => 
            initData(data)
        );
    } 
}
let previousPage = () => {
    if (CURRENT_PAGE > 1) {
        fetchData(PREVIOUS_PAGE).then(data => 
            initData(data)
        );
    } 
}
let initData = data => {
    if (data.error) {
        setErrorMessage(data.error);
    }
    else {
        setCharacters(data);
        setPages(data);
    }
};
let fetchData = async url => {
    return await fetch(url)
    .then(response => response.json())
    .then(data => {
        console.log(data)
        return data;
    })
    .catch(error => console.error('Error:', error));
}


fetchData(`${URL}character/?page=0`).then(data => {
    initData(data)
});

// Get the modal
var modal = document.getElementById("myModal");
// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];
// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    document.getElementsByClassName('modal-content')[0].textContent = "";
    modal.style.display = "none";
}
// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    document.getElementsByClassName('modal-content')[0].textContent = "";
    modal.style.display = "none";
  }
}