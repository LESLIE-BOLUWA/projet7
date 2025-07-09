//On récupère les works pour les afficher dans la galerie
fetch("http://localhost:5678/api/works")
  .then((response) => {
    return response.json();
  }) // on transforme la réponse en JSON
  .then((works) => {
    // on recupère la div pour afficher les projets
    const divGallery = document.querySelector(".gallery");
    divGallery.innerHTML = ""; // on vide la div pour éviter les doublons

    // on boucle sur les projets
    for (let i = 0; i < works.length; i++) {
      const work = works[i];

      // on crée un élément figure
      const figureWork = document.createElement("figure");

      // on crée un élément img
      const imgWork = document.createElement("img");
      imgWork.src = work.imageUrl;
      imgWork.alt = work.title;
      figureWork.appendChild(imgWork);

      // on crée un élément figcaption
      const figcaptionWork = document.createElement("figcaption");
      figcaptionWork.textContent = work.title;
      figureWork.appendChild(figcaptionWork);

      // ajout du figureWork à la divGallery

      divGallery.appendChild(figureWork);
    }
  })
  .catch((error) => {
    console.error("Erreur lors de la récupération des projets :", error);
  });
// on récupère les catégories

fetch("http://localhost:5678/api/categories").then((response) => {
  return response.json();
}); // on transforme la réponse en JSON
