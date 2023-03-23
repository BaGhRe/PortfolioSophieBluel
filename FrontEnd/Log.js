/* Connexion */

/*  fonction pour rediriger sur la page HTML (si la connexion est réussie) */

function connexionReussie() {
    window.location.href = "./index.html";
};

/* fonction appelée plus tard :
générer un message d'erreur si la connexion échoue */

function connexionEchouee() {
    const divErreur = document.querySelector(".erreur");
    const afficherErreur = document.createElement("p");
    afficherErreur.innerText = "Erreur dans l’identifiant ou le mot de passe";
    divErreur.appendChild(afficherErreur);
}

/* fonction pour se connecter (+ appel des fonctions précédentes) */

function fonctionConnexion() {
    const formulaire = document.querySelector(".formulaire-connexion");

    formulaire.addEventListener("submit", async function(event) {
        event.preventDefault(); // pour que le clique fonctionne seulement après l'exécution du code ci-dessous

        // accès aux inputs du <form> dans le HTML grâce à getElementById
        const emailFormulaire = document.getElementById("email").value;
        const passwordFormulaire = document.getElementById("password").value;

        // constante qui sera utile pour l'appel à fetch
        const elementsFormulaire = {
            email: emailFormulaire,
            password: passwordFormulaire,
        };

        // appel à fetch
        let response = await fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(elementsFormulaire) // on passe les éléments du formulaire au format JSON pour obtenir le token
        });

        // on récupère le token dans la réponse du fetch
        let reponseFetch = await response.json();
        let token = reponseFetch.token; // pour récupérer le "token" dans l'API
        // console.log(token);

        // on appelle les fonctions créées précédemment :

        // si la connexion est réussie : 
        if (response.status === 200) {
            // on stocke le token dans le sessionStorage pour le récupérer plus tard
            window.sessionStorage.setItem("token", token);
            connexionReussie();
            //console.log(token);
        } // si la connexion échoue : */
        else if (response.status === 401 || 404) {
            connexionEchouee();
        }
    });
};



fonctionConnexion();