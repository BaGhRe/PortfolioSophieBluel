// récupérer le token
const getToken = window.sessionStorage.getItem("token");

// se déconnecter :
function logout() {
    // vider le sessionStorage
    sessionStorage.clear();
    // retourner à la page d'accueil
    window.location.href = "./index.html";
};

// afficher les éléments du mode admin :
if (getToken !== null) {

    // modifier "login" en "logout"
    let loginNavName = document.querySelector(".connexion-admin");
    loginNavName.innerText = "logout";
    loginNavName.removeAttribute('href');
    loginNavName.style.cursor = "pointer";
    // retourner page d'accueil
    loginNavName.addEventListener('click', logout);
    // afficher les éléments de la page admin :
    // afficher la barre :
    const elementBanner = document.querySelector(".barre-modification");
    elementBanner.style.display = null;

    // afficher les boutons de modification :
    const buttonImageModification = document.querySelector(".modification-photo");
    buttonImageModification.style.display = null;
    const buttonTexteModification = document.querySelector(".modification-texte");
    buttonTexteModification.style.display = null;
    const buttonProjectsModification = document.querySelector(".modification-projets");
    buttonProjectsModification.style.display = null;

    // disparaître les filtre :
    const deleteFilterButton = document.querySelector(".boutons");
    deleteFilterButton.innerHTML = "";
};


// modale

// 1ere modale

let modal = null;

// arrêter la propagation
function stopPropagation(e) {
    e.stopPropagation()
};

// fonction pour faire apparaître les projets dans la modale
function createWorksModal(work) {
    const divProjects = document.querySelector(".galerie-photo");
    const figureElement = document.createElement("figure");
    figureElement.classList.add("figure-modale");
    figureElement.setAttribute("id", "projets " + work.id); // on donne comme id son id dans l'API (1, 2, 3,...)
    const imageElement = document.createElement("img");
    imageElement.src = work.imageUrl;
    imageElement.setAttribute("crossorigin", 'anonymous');
    const figcaptionElement = document.createElement("figcaption");
    figcaptionElement.innerText = 'éditer';
    // bouton et icône
    const deleteButton = document.createElement("button");
    // on lui donne comme id, celui dans l'API
    deleteButton.setAttribute("id", work.id);
    // au clic, on exécute la fonction (sur la figure avec l'id correspondant)
    deleteButton.setAttribute("onclick", "deleteProject(this.id);");
    deleteButton.classList.add("bouton-modale-delete");
    const icone = document.createElement('span');
    icone.innerHTML = '<i class="fa-solid fa-trash-can icone-modale-delete"></i>';
    const moveIcone = document.createElement('span');
    moveIcone.innerHTML = '<i class="fa-solid fa-arrows-up-down-left-right move-icone"></i>';

    divProjects.appendChild(figureElement);
    figureElement.appendChild(imageElement);
    figureElement.appendChild(figcaptionElement);
    figureElement.appendChild(deleteButton);
    deleteButton.appendChild(icone);
    figureElement.appendChild(moveIcone);
}

async function showProjectsModal() {
    const response = await fetch("http://localhost:5678/api/works");
    const json = await response.json();

    json.forEach(work => {
        // appelle fonction qui permet afficher des projets en petit format
        createWorksModal(work);
    });
};

// ouvrir la modale
function openModal(modal, button, cross, wrapper) { // paramètres utiles pour choisir quelle modale on souhaite ouvrir
    const chooseModal = document.getElementById(modal);
    const chooseButton = document.getElementById(button);
    if (chooseButton !== null) {
        chooseButton.addEventListener("click", function() {
            chooseModal.style.display = 'flex';
        });
        chooseModal.addEventListener("click", closeModal)
            // fermer modale au clic sur la croix
        chooseModal.querySelector(cross).addEventListener('click', closeModal)
            // fermer modale au clic à l'extérieur de la modale
        chooseModal.querySelector(wrapper).addEventListener('click', stopPropagation)
    }
}


// fermer la modale
function closeModal() {
    const chooseModal = document.getElementById('modal1');
    chooseModal.style.display = 'none';
    formEmpty(); // fonction créée plus bas, pour vider le formulaire d'ajout si modale fermée
}

// ouvrir et fermer modale
function openFirstModal() {
    document.querySelectorAll('.open-modal1').forEach(call => {
        call.addEventListener('click', openModal('modal1', 'open-modal-wrapper', '.icone', '.modal-wrapper'))
        showProjectsModal();
    });
}

openFirstModal();

// suprimer projet

async function deleteProject(clicked_id) {
    const response = await fetch(`http://localhost:5678/api/works/${clicked_id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "authorization": `Bearer ${getToken}`
        }
    });

    // ne pas rafraîchir la page quand on supprime un projet
    const deleteModalProjectsNoRefresh = document.getElementById("projets " + clicked_id);
    deleteModalProjectsNoRefresh.remove();

    const deleteProjectsNoRefresh = document.getElementById("galery " + clicked_id);
    deleteProjectsNoRefresh.remove();
};


// 2eme modale

// vider le formulaire si on quitte la modale
function formEmpty() {
    const addingWorksForm = document.querySelector('.form-upload');
    addingWorksForm.reset();
    // message d'erreur' d'envoi de projet
    const errorMessage = document.getElementById('error-message-work');
    errorMessage.style.display = 'none';
    // message de validation d'envoi de projet
    const validationMessage = document.getElementById('validation-message-work');
    validationMessage.style.display = 'none';
};

// fonction choisir la modale à afficher
function changeModal(modal1, modalDirection, modal2) {
    document.querySelector('.modal-wrapper').style.display = modal1;
    // change direction de la modale, redonner son état d'origine (colonne)
    document.querySelector('.modal-wrapper').style.flexDirection = modalDirection;
    document.querySelector('.modale-upload').style.display = modal2;
}

// fonction ouvrir la 2e modale
function openSecondModal() {
    document.querySelectorAll('.open-modal-upload').forEach(call => {
        call.addEventListener('click', () => {
            changeModal('none', '', 'flex');
            openModal('modal1', 'open-second-modal', '.cross-upload', '.modale-upload')
        })
    })
}

openSecondModal();

// utiliser la flèche de la 2e modale afin de revenir en arrière
let returnFirstModale = document.querySelector('.arrow');
returnFirstModale.addEventListener('click', () => {
    changeModal('flex', 'column', 'none');
    formEmpty();
});


// ajout projet

// afficher l'image choisie
// 1 - récupère l'input pour ajouter une image
let imageForm = document.getElementById('upload-image');
// 2 - applique un listener pour changer son style
imageForm.addEventListener('change', function(event) {
    let newReader = new FileReader(); // permet de lire le fichier choisi
    // 3 - vise le 1er document (et unique ici)
    let file = event.target.files[0];
    newReader.onload = function(event) {
        let imageUpload = document.createElement("img");
        imageUpload.classList.add('image-load');
        // 4 - récupérer la source image sur le pc
        imageUpload.src = event.target.result;
        let divImageForm = document.getElementById("change-image");
        // 5 - vider la div de l'input
        divImageForm.innerHTML = '';
        // 6 lier l'image à la div pour remplacer son ancien contenu
        divImageForm.appendChild(imageUpload);
    };
    // 7 - cette méthode sert à lire le contenu du fichier choisi (file)
    newReader.readAsDataURL(file);
});

// fonction pour ajouter un projet :
async function AddWorksFetch() {

    // récupération des valeurs renseignées dans le formulaire
    const addPicture = document.getElementById('upload-image');
    const addTitle = document.getElementById('title-project');
    const addCategory = document.getElementById('categorie-projet');

    // récupération du formulaire (+ ajout d'un EventListener)
    const addingWorksForm = document.querySelector('.form-upload');
    addingWorksForm.addEventListener('submit', (event) => {
        event.preventDefault();

        // condition pour que le formulaire s'envoie
        if (!addPicture.files[0] || !addTitle.value || !addCategory.value) {
            // message d'erreur :
            const errorMessage = document.getElementById('error-message-work');
            errorMessage.style.display = 'flex';
            // message de validation d'envoi
            const validationMessage = document.getElementById('validation-message-work');
            validationMessage.style.display = 'none';
            return;
        };
        // permet de cacher le message s'il y a eu une erreur auparavant
        const errorMessage = document.getElementById('error-message-work');
        errorMessage.style.display = 'none';

        // formData utile pour l'appel à fetch (POST)
        let formData = new FormData();
        formData.append('title', addTitle.value);
        formData.append('image', addPicture.files[0]);
        formData.append('category', addCategory.value);

        // appel fetch (si le formulaire rempli entièrement)
        fetch('http://localhost:5678/api/works', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${getToken}` },
            body: formData
        })

        // rend le résultat au format json, pour l'afficher
        .then(resultat => {
            return resultat.json();
        })

        // éviter de refresh la page
        .then(work => {
            // appelle la méthode pour afficher les projets sur la page
            createWork(work);
            // appelle la méthode pour afficher les projets sur la modale
            createWorksModal(work);
        });

         // condition exécutée si le projet a été ajouté avec succès
         if (addPicture.files[0] || addTitle.value || addCategory.value) {
            // message de validation :
            const validationMessage = document.getElementById('validation-message-work');
            validationMessage.style.display = 'flex';
        };
    })
};

AddWorksFetch();