// console.log(localStorage);
// récupérer le token
const recupererToken = window.localStorage.getItem("token");
// console.log(recupererToken);

// se déconnecter :
function seDeconnecter(e) {
    e.preventDefault();
    // vider le localStorage
    localStorage.clear();
    // retourner à la page d'accueil
    window.location.href = "index.html";
};

// afficher les éléments du mode admin :
if (recupererToken !== null) {

    // modifier "login" en "logout"
    let loginAdmin = document.querySelector(".connexion-admin");
    loginAdmin.innerHTML = " "
    loginAdmin.innerText = "logout";
    // retourner page d'accueil
    loginAdmin.addEventListener('click', seDeconnecter);
    // afficher les éléments de la page admin :
    // afficher la barre :
    const barreNoire = document.querySelector(".barre-modification");
    barreNoire.style.display = null;

    // afficher les boutons de modification :
    const modificationPhoto = document.querySelector(".modification-photo");
    modificationPhoto.style.display = null;
    const modificationTexte = document.querySelector(".modification-texte");
    modificationTexte.style.display = null;
    const modificationProjets = document.querySelector(".modification-projets");
    modificationProjets.style.display = null;

    // disparaître les filtre :
    const boutonsFiltres = document.querySelector(".boutons");
    boutonsFiltres.innerHTML = "";
};




// modale

let modal = null;

const ouvrirModale = function(e) {
    e.preventDefault();
    const target = document.querySelector(e.target.getAttribute('href'));
    target.style.display = null;
    target.removeAttribute('aria-hidden');
    target.setAttribute('aria-modal', 'true');
    modal = target;

    const fermer = document.querySelector(".x-close");
    fermer.addEventListener('click', fermerModale);
    modal.querySelector('.modale-supprimer-btn').addEventListener('click', fermerModale);

    const fermerModaleExterieur = document.querySelector('.modal-wrapper');
    fermerModaleExterieur.addEventListener('click', Propagation);
    document.querySelector('#modal1').addEventListener('click', fermerModale);
};

async function afficherImageModale() {
    const response = await fetch("http://localhost:5678/api/works");
    const json = await response.json();

    json.forEach(projets => {
        const sectionProjets = document.querySelector(".galerie-photo");
        const baliseFigure = document.createElement("figure");
        baliseFigure.classList.add("figure-modale");
        const imageFigure = document.createElement("img");
        imageFigure.src = projets.imageUrl;
        imageFigure.setAttribute("crossorigin", 'anonymous');
        const texteFigure = document.createElement("figcaption");
        texteFigure.innerHTML = `<p>éditer</p>
        <i class="fa-solid fa-trash-can poubelle-icone id="trash" "></i>`;
        baliseFigure.appendChild(imageFigure);
        baliseFigure.appendChild(texteFigure);
        sectionProjets.appendChild(baliseFigure);
    })
};

const fermerModale = function(e) {
    if (modal === null) return
    e.preventDefault();
    const fond = document.querySelector('html');
    fond.style.background = "white";
    modal.style.display = "none";
    modal.setAttribute('aria-hidden', 'true');
    modal.removeAttribute('aria-modal');
    modal.removeEventListener('click', fermerModale);
    modal.querySelector('.modale-supprimer-btn').addEventListener('click', fermerModale);
    modal = null;
}

document.querySelectorAll('.open-modal1').forEach(a => {
    a.addEventListener('click', ouvrirModale)
    afficherImageModale();
});

function Propagation(e) {
    e.stopPropagation()
};
