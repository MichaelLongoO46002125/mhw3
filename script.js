const contentSec = document.querySelector('section[data-sec="content-sec"]'); //Sezione contenuti
const favSec= document.querySelector('section[data-sec="fav-sec"]');          //Sezione preferiti
const favList= favSec.querySelector('.fav-list');                             //Lista preferiti
const contentMsg= document.querySelector('[data-cont-msg="msg"]');            //Messaggio 0 contenuti

let viewableContent = []; //ID dei contenuti visualizzabili
let contentsOffset = 0;   //Indice per la lista viewableContent che indica il primo contenuto visualizzato
let viewableFav = [];     //ID dei contenuti aggiunti tra i preferiti
let favOffset = 0;        //Indice per la lista viewableFav che indica il primo preferito visualizzato

//Funzioni e Listener

function searchByID(ID) {
    for(let cont of contents) //Cerco il contenuto avente il dato ID
    {
        if(cont.id === parseInt(ID,10))
            return cont; //Restituisco l'oggetto che rappresenta il contenuto
    }

    return null; //Se arrivo qui significa che non l'ho trovato, restituisco null per indicare errore
                 //basta modificare un id con ispeziona elemento per arrivare a questo punto
}

//Listener per i pulsanti prossimo/precedente contenuto
function onNextCont(){
    // Della lista mostro solo 4 contenuti per volta quindi logicamente devo lavorare con una "finestra" 
    // di dimensione 4 e quindi il mio offset non può essere maggiore della lunghezza della lista - 4                             
    if(contentsOffset < viewableContent.length-4) //Se la condizione è falsa => non ho contenuti nascosti a destra
    {   //Nascondo il primo contenuto visualizzato
        contentSec.querySelector('[data-content-id="' + viewableContent[contentsOffset] + '"]')
            .classList.add('hidden');
        //Visualizzo il prossimo contenuto
        contentSec.querySelector('[data-content-id="' + viewableContent[contentsOffset+4] + '"]')
            .classList.remove('hidden');

        contentsOffset++; //Sposto l'offset di 1 posizione a destra (sposto la "finestra" di una posizione a destra)
    } 
}

function onPrevCont(){
    if(contentsOffset>0)//Controllo se prima del primo contenuto visualizzato ci sono contenuti nascosti che lo precedono
    {
        contentsOffset--; //Sposto l'offset di una posizione a sinistra
        //Nascondo il contenuto visualizzato più a destra
        contentSec.querySelector('[data-content-id="' + viewableContent[contentsOffset+4] + '"]')
            .classList.add('hidden');
        //Visualizzo il contenuto nascosto che precede l'attuale primo visualizzato
        contentSec.querySelector('[data-content-id="' + viewableContent[contentsOffset] + '"]')
            .classList.remove('hidden');
    }
}

//Listener per i pulsanti prossimo/precedente preferito
function onNextFav(){
    //Della lista mostro solo 3 elementi per volta quindi logicamente devo lavorare con una "finestra" 
    //di dimensione 3 e quindi il mio offset non può essere maggiore della lunghezza della lista - 3                                   
    if(favOffset < viewableFav.length-3) //Se la condizione è falsa => non ho preferiti nascosti a destra
    {   //Nascondo il primo preferito visualizzato
        favList.querySelector('[data-fav-id="' + viewableFav[favOffset] + '"]')
            .classList.add('hidden');
        //Visualizzo il prossimo preferito
        favList.querySelector('[data-fav-id="' + viewableFav[favOffset+3] + '"]')
            .classList.remove('hidden');

        favOffset++; //Sposto l'offset di 1 posizione a destra (sposto la "finestra" di una posizione a destra)
    }  
}

function onPrevFav(){
    if(favOffset>0) //Controllo se prima del primo preferito visualizzato ci sono preferiti nascosti che lo precedono
    {
        favOffset--; //Sposto l'offset di una posizione a sinistra
        //Nascondo il preferito visualizzato più a destra
        favList.querySelector('[data-fav-id="' + viewableFav[favOffset+3] + '"]')
            .classList.add('hidden');
        //Visualizzo il preferito nascosto che precede l'attuale primo preferito
        favList.querySelector('[data-fav-id="' + viewableFav[favOffset] + '"]')
            .classList.remove('hidden');
    }
}

//Listener per le descrizioni
function showDescription(event)
{
    //Pendo l'ID associato al contenuto e cerco tale ID nel file contents.js
    const cont= searchByID(event.currentTarget.parentNode.parentNode.dataset.contentId);

    if( cont === null) 
    {
        console.log("Errore");
        return;
    }

    event.currentTarget.textContent= cont.description;

    event.currentTarget.removeEventListener('click', showDescription);
    event.currentTarget.addEventListener('click', hideDescription);
}

function hideDescription(event)
{
    event.currentTarget.textContent= 'Clicca per mostrare la descrizione...';

    event.currentTarget.removeEventListener('click', hideDescription);
    event.currentTarget.addEventListener('click', showDescription);
}

//Listener per la barra di ricerca
function searchContents(event)
{
    viewableContent= []; //Resetto la lista che indica quali contenuti posso visualizzare
    contentsOffset= 0; //Resetto l'offset

    for(let cont of contents)
    {   
        //includes restituisce true se la stringa cercata costituisce una parte della stringa in cui cerchiamo
        //altrimenti restituisce false
        //if(cont.title.toUpperCase().includes(event.currentTarget.value.toUpperCase()))
        if(cont.title.toUpperCase().indexOf(event.currentTarget.value.toUpperCase()) !== -1 )
            viewableContent.push(cont.id); 
            //Se il titolo soddisfa la ricerca aggiungo l'id del contenuto tra quelli visualizzabili
    }
    
    if(viewableContent.length === 0) //Se non ho elementi da visualizzare lo comunico mostrando un messaggio
        contentMsg.classList.remove('hidden');
    else
        contentMsg.classList.add('hidden');

    let i=0;
    for(const cont of contentSec.querySelectorAll('[data-content-id]'))
    {
        //Se il contenuto non è tra quelli visualizzabili o ne ho già visualizzati 4
        if( viewableContent.indexOf(parseInt(cont.dataset.contentId, 10)) === -1 || i >= 4)
            cont.classList.add('hidden'); //allora non lo rendo visibile
        else //Altrimenti lo rendo visibile
        {
            cont.classList.remove('hidden');
            i++;
        }
    }
}

//Listener per la rimozione/aggiunta dei preferiti
function remFav(event)
{
    //Rendo cliccabile nuovamente il bottone per aggiungere ai preferiti il corrispondente contenuto.
    contentSec.querySelector('[data-content-id="' + event.currentTarget.parentNode.dataset.favId +'"]')
    .querySelector('.btn-add-fav')
    .addEventListener('click', addFav);

    //Cerco la posizione dell'id del preferito nella lista dei preferiti visualizzabili
    let i=viewableFav.indexOf(parseInt(event.currentTarget.parentNode.dataset.favId, 10));

    if(i === -1) //Se non lo trova allora si è veririficato un errore
    {
        console.log("Error: remFav --- Index=-1");
        return;
    }

    //Verifico se oltre ai preferiti visualizzati ne ho almeno un altro che posso visualizzare e se 
    //c'è lo visualizzo

    if(viewableFav.length > 3)
    {   //Ho almeno un preferito da visualizare, verifico se è adiacente al primo visualizzato
        if(favOffset>0) //Si, quindi lo rendo visibile 
        {
            favList.querySelector('[data-fav-id="' + viewableFav[--favOffset] + '"]')
                .classList.remove('hidden');
        }
        else //No, allora devo rendere visibile il preferito nascosto adiacente all'ultimo preferito di destra
        {
            favList.querySelector('[data-fav-id="' + viewableFav[favOffset+3] + '"]')
                .classList.remove('hidden');
        }
    }

    //Rimuovo dalla lista il preferito 
    viewableFav.splice(i, 1);

    //Rimuovo dai preferiti il contenuto
    event.currentTarget.parentNode.remove();

    //Verifico se ho ancora dei preferiti altrimenti nascondo la sezione
    if(viewableFav.length === 0)
        favSec.classList.add('hidden');
}

function addFav(event)
{
    //Cerco il contenuto avente tale ID nel file contents.js
    const cont= searchByID(event.currentTarget.parentNode.dataset.contentId); 

    if( cont === null)
    {
        console.log("Errore addFav");
        return;
    }

    if(favSec.classList.contains('hidden'))
        favSec.classList.remove('hidden');

    const favItem = document.createElement('div');
    favItem.classList.add('fav-item');
    if(viewableFav.length >= 3) //Se sto già mostrando 3 preferiti gli altri che aggiungo li rendo non visibili.
        favItem.classList.add('hidden');
    favItem.dataset.favId= cont.id; 
    favList.appendChild(favItem); //<div class="fav-item" data-fav-id="XXXX"></div>

    let elem = document.createElement('img');
    elem.src= cont.image; //<img src="XXXX">
    favItem.appendChild(elem);

    const divTagDate= document.createElement('div'); 
    favItem.appendChild(divTagDate);

    elem= document.createElement('span');
    elem.classList.add('content-tag');
    elem.textContent= cont.tags;
    divTagDate.appendChild(elem); //<span class="content-tag">TAG</span>

    elem= document.createElement('span');
    elem.textContent= cont.date;
    divTagDate.appendChild(elem); //<span>DD/MM/YYYY</span>

    elem= document.createElement('h4');
    elem.textContent= cont.title;
    favItem.appendChild(elem); //<h4>Titolo</h4>

    elem= document.createElement('div');
    elem.classList.add('btn-rem-fav');
    elem.addEventListener('click', remFav);
    favItem.appendChild(elem); //<div class="btn-rem-fav"></div>
    viewableFav.push(cont.id);
    
    event.currentTarget.removeEventListener('click', addFav);
}

//MAIN

//Carico i contenuti
for(let cont of contents)
{
    const divContent= document.createElement('div');
    divContent.classList.add('content-col'); //<div class="content-col">
    if(viewableContent.length >= 4) //Dato che voglio visualizzare massimo 4 elementi per volta
        divContent.classList.add('hidden'); //se ne ho già caricati almeno 4 gli altri li rendo invisibili
    divContent.dataset.contentId= cont.id; //data-content-id="XXXX"
    contentSec.appendChild(divContent);

    let elem= document.createElement('img');
    elem.src= cont.image; //<img src="XXXX">
    divContent.appendChild(elem);

    const divContentText= document.createElement('div');
    divContentText.classList.add('content-text'); //<div class="content-text">
    divContent.appendChild(divContentText);

    const divTagDate= document.createElement('div'); 
    divContentText.appendChild(divTagDate);

    elem= document.createElement('span');
    elem.classList.add('content-tag');
    elem.textContent= cont.tags;
    divTagDate.appendChild(elem); //<span class="content-tag">TAG</span>

    elem= document.createElement('span');
    elem.textContent= cont.date;
    divTagDate.appendChild(elem); //<span>DD/MM/YYYY</span>

    elem= document.createElement('h4');
    elem.textContent= cont.title;
    divContentText.appendChild(elem); //<h4>Titolo</h4>

    elem= document.createElement('p');
    elem.textContent= 'Clicca per mostrare la descrizione...';
    elem.addEventListener('click', showDescription);
    divContentText.appendChild(elem); //<p>Descrizione</p>

    elem= document.createElement('div');
    elem.classList.add('btn-add-fav');
    elem.addEventListener('click', addFav);
    divContent.appendChild(elem); //<div class="btn-add-fav"></div>
    viewableContent.push(cont.id);
}

//Aggiungo il listener alla search bar
document.querySelector('section[data-sec="search-sec"]')
        .querySelector('input[type=text]')
        .addEventListener('keyup', searchContents);

//Aggiungo i listener per i pulsati prossimo/precedente contenuto
document.querySelector('[data-btn="cont-next"]').addEventListener('click', onNextCont);
document.querySelector('[data-btn="cont-prev"]').addEventListener('click', onPrevCont);

//Aggiungo i listener per i pulsati prossimo/precedente preferito
document.querySelector('[data-btn="fav-next"]').addEventListener('click', onNextFav);
document.querySelector('[data-btn="fav-prev"]').addEventListener('click', onPrevFav);