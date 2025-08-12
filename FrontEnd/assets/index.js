// 🔹 1. Déclare une variable globale pour stocker tous les projets
let allProjects = [];

// 🔹 2. Fonction qui affiche une liste de projets dans la galerie
function displayProjects(projects) {
  // On cible la div qui contient la galerie
  const gallery = document.querySelector(".gallery");

  // On vide son contenu pour éviter les doublons
  gallery.innerHTML = "";

  // Pour chaque projet, on crée les éléments HTML et on les insère
  for (let i = 0; i < projects.length; i++) {
    const work = projects[i];

    const figure = document.createElement("figure");

    const img = document.createElement("img");
    img.src = work.imageUrl;
    img.alt = work.title;

    const figcaption = document.createElement("figcaption");
    figcaption.textContent = work.title;

    figure.appendChild(img);
    figure.appendChild(figcaption);
    gallery.appendChild(figure);
  }
}

// 🔹 3. Récupère les projets depuis l'API
fetch("http://localhost:5678/api/works")
  // On attend la réponse, et on la transforme en JSON
  .then((response) => response.json())

  // On traite les données une fois reçues
  .then((works) => {
    // On stocke tous les projets dans la variable globale
    allProjects = works;

    // On affiche tous les projets dans la galerie
    displayProjects(allProjects);
  })

  // 🔴 Si une erreur survient (ex : serveur éteint), on l’affiche dans la console
  .catch((error) => {
    console.error("Erreur lors de la récupération des projets :", error);
  });

// on récupère les catégories

fetch("http://localhost:5678/api/categories")
  .then((response) => response.json())
  .then((categories) => {
    const filtersContainer = document.querySelector(".filters");

    // 1. Créer le bouton "Tous"
    const allButton = document.createElement("button");
    allButton.textContent = "Tous";
    allButton.classList.add("filter-btn", "active");
    filtersContainer.appendChild(allButton);

    allButton.addEventListener("click", () => {
      displayProjects(allProjects);
      setActiveButton(allButton);
    });

    // 2. Créer un bouton pour chaque catégorie avec une boucle for
    for (let i = 0; i < categories.length; i++) {
      const category = categories[i];
      const button = document.createElement("button");
      button.textContent = category.name;
      button.classList.add("filter-btn");
      filtersContainer.appendChild(button);

      // Ajout du gestionnaire de clic pour chaque bouton
      button.addEventListener("click", () => {
        const filtered = allProjects.filter(
          (work) => work.categoryId === category.id
        );
        displayProjects(filtered);
        setActiveButton(button);
      });
    }
  });

function setActiveButton(activeButton) {
  const buttons = document.querySelectorAll(".filter-btn");
  buttons.forEach((btn) => btn.classList.remove("active")); // retire la classe à tous
  activeButton.classList.add("active"); // ajoute au bouton cliqué
}
// ====================
// Vérifie si un utilisateur est connecté
// ====================
function checkLoginStatus() {
  const token = localStorage.getItem("token");

  if (token !== null) {
    editionMode(); // Met à jour l'interface en mode édition
    modal(); // Gère l'ouverture et la fermeture de la modale
    setupLogout(); // Prépare le bouton de déconnexion
  }
}

// ====================
// Active le mode édition (UI pour utilisateur connecté)
// ====================
function editionMode() {
  // Changer "login" → "logout"
  const loginLogoutLink = document.getElementById("login-link");
  loginLogoutLink.href = "#";
  loginLogoutLink.textContent = "logout";

  // Masquer les filtres
  const filters = document.querySelector(".filters");
  if (filters) filters.classList.add("hidden");

  // Afficher le bouton "Modifier"
  const editButton = document.querySelector(".button-edit");
  if (editButton) editButton.classList.remove("hidden");

  // Afficher le bandeau noir "mode édition"
  const editionBanner = document.querySelector(".edition-banner");
  if (editionBanner) editionBanner.classList.remove("hidden");
}

// ====================
// Gère l'ouverture et la fermeture de la modale
// ====================
function modal() {
  const modalebtn = document.querySelector(".button-edit"); // bouton Modifier
  const modal = document.getElementById("modal"); // boîte modale
  const overlay = document.getElementById("modalOverlay"); // fond gris
  const modaleclose = document.getElementById("closeModalBtn"); // croix

  // Ouvre la modale au clic sur "Modifier"
  modalebtn.addEventListener("click", () => {
    modal.classList.remove("hidden");
    overlay.classList.remove("hidden");
    displayWorksInModal();
  });

  // Ferme la modale (croix et overlay)
  modaleclose.addEventListener("click", closeModal);
  overlay.addEventListener("click", closeModal);

  function closeModal() {
    modal.classList.add("hidden");
    overlay.classList.add("hidden");
  }
}

// ====================
// Affiche tous les travaux dans la modale
// ====================
function displayWorksInModal() {
  const modalGallery = document.querySelector(".modal-gallery");
  modalGallery.innerHTML = ""; // Vide avant de remplir

  console.log("Contenu de allProjects :", allProjects);

  for (let i = 0; i < allProjects.length; i++) {
    const work = allProjects[i];

    // Conteneur figure
    const figure = document.createElement("figure");
    figure.classList.add("gallery-item");

    // Image
    const img = document.createElement("img");
    img.src = work.imageUrl;
    img.alt = work.title;

    // Bouton poubelle
    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("delete-btn");
    deleteBtn.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
    deleteBtn.addEventListener("click", () => {
      console.log("Suppression du projet :", work.id);
      // Ici → Fetch DELETE + mise à jour
    });

    // Ajout dans figure
    figure.appendChild(img);
    figure.appendChild(deleteBtn);

    // Ajout dans la galerie
    modalGallery.appendChild(figure);
  }
}

// ====================
// Gère le bouton de déconnexion
// ====================
function setupLogout() {
  const loginLogoutLink = document.getElementById("login-link");
  loginLogoutLink.addEventListener("click", (event) => {
    event.preventDefault(); // Empêche le lien normal
    localStorage.removeItem("token"); // Supprime le token
    window.location.href = "index.html"; // Retour à l'accueil
  });
}

// ====================
// Lancement au chargement de la page
// ====================
checkLoginStatus();
