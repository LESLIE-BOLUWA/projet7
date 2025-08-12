// On sélectionne le formulaire
const form = document.querySelector("form");

// On ajoute un écouteur d'événement lors de la soumission du formulaire
form.addEventListener("submit", async function (event) {
  event.preventDefault(); // Empêche le rechargement automatique de la page

  // On récupère les valeurs saisies par l'utilisateur
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  // On envoie une requête POST à l'API avec fetch (les informations de conexion )
  try {
    const response = await fetch("http://localhost:5678/api/users/login", {
      method: "POST", // Type de requête
      headers: {
        "Content-Type": "application/json", // On envoie des données JSON
      },
      body: JSON.stringify({ email, password }), // On convertit les infos en JSON
    });

    const data = await response.json(); // On transforme la réponse en objet utilisable

    // 🔹 4. Si la réponse est correcte (code 200), on stocke le token et on redirige
    if (response.ok) {
      localStorage.setItem("token", data.token); // Stockage du token
      window.location.href = "index.html"; // Redirection vers la page d'accueil
    } else if (response.status === 500) {
      // 🔹 Message spécifique si le serveur renvoie une erreur
      const errorMessage = document.getElementById("error-message");
      errorMessage.textContent =
        "Erreur du serveur. Veuillez réessayer plus tard.";
    } else {
      // 🔹 5. Si l’identifiant ou le mot de passe est incorrect, on affiche un message
      const errorMessage = document.getElementById("error-message");
      errorMessage.textContent =
        "Email ou mot de passe incorrect. Veuillez réessayer.";
    }
  } catch (error) {
    // 🔹 Si la requête n’aboutit pas (ex : serveur éteint, erreur réseau)
    const errorMessage = document.getElementById("error-message");
    errorMessage.textContent =
      "Impossible de se connecter. Veuillez vérifier votre connexion.";
  }
});
