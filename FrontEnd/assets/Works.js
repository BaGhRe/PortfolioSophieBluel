// appel l'API pour récuperer les projets

function createWork(work) {
    const sectionElement = document.querySelector(".gallery");
    const figureElement = document.createElement("figure");
    figureElement.classList.add("filterDiv", work.categoryId, "show"); // une classe pour les filtres
    figureElement.setAttribute("id", "galery " + work.id);
    const imageElement = document.createElement("img");
    imageElement.src = work.imageUrl;
    imageElement.setAttribute("crossorigin", 'anonymous');
    const figcaptionElement = document.createElement("figcaption");
    figcaptionElement.innerText = work.title;
    figureElement.appendChild(imageElement);
    figureElement.appendChild(figcaptionElement);
    sectionElement.appendChild(figureElement);
}

async function postWork() {
    const response = await fetch("http://localhost:5678/api/works");
    const json = await response.json();
    json.forEach(work => { // une boucle qui parcours les travaux tant qu'il y en a dans l'API
        createWork(work);
    })
};

postWork();

// filtres

  filterSelection("all");

function filterSelection(c) {
    let x, i;
    x = document.getElementsByClassName("filterDiv");
    if (c == "all") c = "";
    // ajoute classe "show" aux éléments filtrés, l'enlève à ceux non sélectionnés
    for (i = 0; i < x.length; i++) {
        enleverClasseShow(x[i], "show");
        if (x[i].className.indexOf(c) > -1) ajouterClasseShow(x[i], "show");
    }
};

// afficher les éléments filtrés
function ajouterClasseShow(element, name) {
    let i, arr1, arr2;
    arr1 = element.className.split(" ");
    arr2 = name.split(" ");
    for (i = 0; i < arr2.length; i++) {
        if (arr1.indexOf(arr2[i]) == -1) {
            element.className += " " + arr2[i];
        }
    }
};

// cacher les éléments non filtrés
function enleverClasseShow(element, name) {
    let i, arr1, arr2;
    arr1 = element.className.split(" ");
    arr2 = name.split(" ");
    for (i = 0; i < arr2.length; i++) {
        while (arr1.indexOf(arr2[i]) > -1) {
            arr1.splice(arr1.indexOf(arr2[i]), 1);
        }
    }
    element.className = arr1.join(" ");
};

// ajouter la classe "show" au bouton actif
let btnContainer = document.getElementById("btnFilters");
let btns = btnContainer.getElementsByClassName("btn");
console.log(btns);
for (let i = 0; i < btns.length; i++) {
    btns[i].addEventListener("click", function() {
        let current = document.getElementsByClassName("active");
        current[0].className = current[0].className.replace(" active", "");
        this.className += " active";
    });
};