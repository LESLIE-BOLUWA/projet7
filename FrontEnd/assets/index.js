let categoriesGlobal = [];

// Fonction qui récupère les projets depuis l'API
async function getWorks() {
  try {
    // On attend la réponse de l'API
    const response = await fetch("http://localhost:5678/api/works");
    // On transforme la réponse en JSON
    const works = await response.json();

    // on retourne les projets
    return works;
  } catch (error) {
    console.error("Erreur lors de la récupération des projets :", error);
    return [];
  }
}

// Récupère les catégories depuis l'API
async function getCategories() {
  try {
    const response = await fetch("http://localhost:5678/api/categories");
    const categories = await response.json();
    return categories;
  } catch (error) {
    console.error("Erreur lors de la récupération des catégories :", error);
    return [];
  }
}

//  Fonction qui affiche une liste de projets dans la galerie
function displayWorks(works) {
  // On cible la div qui contient la galerie
  const gallery = document.querySelector(".gallery");

  // On vide son contenu pour éviter les doublons
  gallery.innerHTML = "";

  // Pour chaque projet, on crée les éléments HTML et on les insère
  for (let i = 0; i < works.length; i++) {
    const work = works[i];

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

// Affiche les filtres de catégories
function displayFilters(works) {
  const filtersContainer = document.querySelector(".filters");

  // 1. Créer le bouton "Tous"
  const allButton = document.createElement("button");
  allButton.textContent = "Tous";
  allButton.classList.add("filter-btn", "active");
  filtersContainer.appendChild(allButton);

  allButton.addEventListener("click", () => {
    displayWorks(works);
    setActiveButton(allButton);
  });

  // 2. Créer un bouton pour chaque catégorie avec une boucle for
  for (let i = 0; i < categoriesGlobal.length; i++) {
    const category = categoriesGlobal[i];
    const button = document.createElement("button");
    button.textContent = category.name;
    button.classList.add("filter-btn");
    filtersContainer.appendChild(button);

    // Ajout du gestionnaire de clic pour chaque bouton
    button.addEventListener("click", () => {
      const filtered = works.filter((work) => work.categoryId === category.id);
      displayWorks(filtered);
      setActiveButton(button);
    });
  }
}

// créer les options du select dans le formulaire
async function createCategoriesSelectOptions() {
  const select = document.getElementById("category");
  if (select) {
    categoriesGlobal.forEach((category) => {
      const option = document.createElement("option");
      option.value = category.id;
      option.textContent = category.name;
      select.appendChild(option);
    });
  }
}

//  Gère l'état actif des boutons de filtre
function setActiveButton(activeButton) {
  const buttons = document.querySelectorAll(".filter-btn");
  buttons.forEach((btn) => btn.classList.remove("active")); // retire la classe à tous
  activeButton.classList.add("active"); // ajoute au bouton cliqué
}

// Changer "login" → "logout"
function setupLogout() {
  const loginLogoutLink = document.getElementById("login-link");
  loginLogoutLink.href = "#";
  loginLogoutLink.textContent = "logout";

  loginLogoutLink.addEventListener("click", (event) => {
    event.preventDefault(); // Empêche le lien normal
    localStorage.removeItem("token"); // Supprime le token
    window.location.href = "index.html"; // Retour à l'accueil
  });
}

// Afficher le bandeau noir "mode édition"
function showEditBanner() {
  const editionBanner = document.querySelector(".edition-banner");
  if (editionBanner) editionBanner.classList.remove("hidden");
}

function hideFilters() {
  // Masquer les filtres
  const filters = document.querySelector(".filters");
  if (filters) filters.classList.add("hidden");
}

// Afficher la gallery ou le formulaire
async function showModalView(view) {
  const galleryView = document.getElementById("modalGalleryView");
  const formView = document.getElementById("modalFormView");

  if (view === "gallery") {
    galleryView.classList.remove("hidden");
    formView.classList.add("hidden");
  }
  if (view === "form") {
    galleryView.classList.add("hidden");
    formView.classList.remove("hidden");
  }
}

function showEditButton() {
  // Afficher le bouton "Modifier"
  const editButton = document.querySelector(".button-edit");
  if (editButton) editButton.classList.remove("hidden");
  editButton.addEventListener("click", () => {
    const modal = document.getElementById("modal"); // boîte modale
    const overlay = document.getElementById("modalOverlay"); // fond gris
    modal.classList.remove("hidden");
    overlay.classList.remove("hidden");
    showModalView("gallery");
  });
}

function setModalEvents() {
  const overlay = document.getElementById("modalOverlay");
  const modalClose = document.getElementById("closeModalBtn"); // croix
  const openFormBtn = document.getElementById("openAddPhotoForm");
  const backBtn = document.getElementById("backToGallery");

  modalClose.addEventListener("click", closeModal); // Fermer avec croix
  overlay.addEventListener("click", closeModal); // Fermer en cliquant sur fond

  openFormBtn.addEventListener("click", (event) => {
    showModalView("form");
  });
  backBtn.addEventListener("click", (event) => {
    showModalView("gallery");
  });
}

function displayWorksInModal(works) {
  const modalGallery = document.querySelector(".modal-gallery");
  modalGallery.innerHTML = ""; // Vide avant de remplir

  for (let i = 0; i < works.length; i++) {
    const work = works[i];

    // creer le conteneur figure
    const figure = document.createElement("figure");
    figure.classList.add("gallery-item");

    // créer l'image
    const img = document.createElement("img");
    img.src = work.imageUrl;
    img.alt = work.title;

    // créer Bouton poubelle
    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("delete-btn");
    deleteBtn.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
    // Suppression au clic
    deleteBtn.addEventListener("click", async () => {
      const token = localStorage.getItem("token"); // Récupère le token

      try {
        const response = await fetch(
          `http://localhost:5678/api/works/${work.id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          console.log(`Projet ${work.id} supprimé`);
          figure.remove();
          const works = await getWorks(); // Récupère les projets
          displayWorks(works); // Met à jour la galerie principale
        } else {
          console.error("Erreur lors de la suppression");
        }
      } catch (error) {
        console.error("Erreur réseau :", error);
      }
    });

    // Ajout dans figure
    figure.appendChild(img);
    figure.appendChild(deleteBtn);
    // Ajout dans la galerie
    modalGallery.appendChild(figure);
  }
}

// Ferme la modale
function closeModal() {
  const modal = document.getElementById("modal"); // boîte modale
  const overlay = document.getElementById("modalOverlay"); // fond gris
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
}

// Crée un nouveau projet
async function createWork(title, file, categoryId) {
  try {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("image", file); // file = objet File (image choisie)
    formData.append("category", categoryId); // categoryId = ID de la catégorie

    const token = localStorage.getItem("token"); // Récupère le token

    const response = await fetch("http://localhost:5678/api/works", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Erreur API : ${response.status}`);
    }

    const data = await response.json();
    console.log("Projet créé :", data);

    // Met à jour la galerie et retourne sur la vue galerie
    const works = await getWorks();
    displayWorks(works);
    displayWorksInModal(works);

    let addPhotoForm = document.getElementById("addPhotoForm");
    addPhotoForm.reset(); // Réinitialise le formulaire

    showModalView("gallery");
  } catch (error) {
    alert("Erreur lors de la création du projet");
    console.error("Erreur lors de la création du projet :", error);
  }
}

function setPreviewButtonEvent() {
  const previewBtn = document.getElementById("previewBtn");
  if (previewBtn) {
    previewBtn.addEventListener("click", (event) => {
      event.preventDefault();
      const fileInput = document.getElementById("photo"); // Sélecteur de fichier
      const img = document.getElementById("previewImage"); // Image de prévisualisation
      const previewContent = document.querySelector(".preview-content");
      if (fileInput) {
        fileInput.click(); // Ouvre le sélecteur de fichiers

        fileInput.addEventListener("change", () => {
          const file = fileInput.files[0]; // Récupère le premier fichier sélectionné

          if (file) {
            const url = URL.createObjectURL(file); // Crée une URL temporaire pour l'image
            img.src = url;
            img.classList.remove("hidden");
            previewContent.classList.add("hidden"); // Affiche la prévisualisation
          }
        });
      }
    });
  }
}

function setAddPhotoFormEvent() {
  const addPhotoForm = document.getElementById("addPhotoForm");
  if (addPhotoForm) {
    addPhotoForm.addEventListener("submit", (event) => {
      event.preventDefault(); // Empêche le rechargement de la page

      const title = document.getElementById("title").value; // Récupère le titre
      const fileInput = document.getElementById("photo"); // Sélecteur de fichier
      const categorySelect = document.getElementById("category"); // Sélecteur de catégorie

      if (fileInput.files.length > 0 && categorySelect.value) {
        const file = fileInput.files[0]; // Récupère le premier fichier sélectionné
        const categoryId = parseInt(categorySelect.value, 10); // Récupère l'ID de la catégorie

        createWork(title, file, categoryId); // Crée le projet
        addPhotoForm.reset(); // Réinitialise le formulaire
      }
    });

    addPhotoForm.addEventListener("reset", () => {
      const img = document.getElementById("previewImage"); // Image de prévisualisation
      const previewContent = document.querySelector(".preview-content");
      img.src = "";
      img.classList.add("hidden");
      previewContent.classList.remove("hidden"); // Affiche le contenu initial
    });
  }
}

// Initialisation de la page
async function initializePage() {
  categoriesGlobal = await getCategories();
  const works = await getWorks(); // Récupère les projets
  displayWorks(works); // Affiche tous les projets
  displayFilters(works); // Affiche tous les filtres
  const token = localStorage.getItem("token");

  // Vérifie si un utilisateur est connecté
  if (token !== null) {
    showEditBanner();
    setupLogout();
    hideFilters();
    displayWorksInModal(works); // Affiche les travaux dans la modale
    createCategoriesSelectOptions();
    showEditButton();
    setModalEvents();
    setPreviewButtonEvent();
    setAddPhotoFormEvent();
  }
}

// Lancement au chargement de la page
initializePage();
