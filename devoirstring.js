function prenom() {
  // on récupère le prénom et on le met dans l'élément avec id holder1
  let prenom = document.getElementById("prenom").value;
  document.getElementById("holder1").innerHTML = prenom;
}

function nomdefamille() {
  // on récupère le nom de famille et on le met dans l'élément avec id holder1
  let nom = document.getElementById("nomdefamille").value;
  document.getElementById("holder1").innerHTML = nom;
}

function nomcomplet() {
  // on concatène prénom et nom pour afficher le nom entier et on met le résultat dans l'élément avec id holder1
  let prenom = document.getElementById("prenom").value;
  let nom = document.getElementById("nomdefamille").value;
  let nomComplet = prenom + " " + nom;
  document.getElementById("holder1").innerHTML = nomComplet;
}

function segmentText() {
  // on récupère le texte de l'élément d'id texte, on le découpe et on le place dans l'élément avec id holder2
  let texte = document.getElementById("texte").value;
  let mots = texte.match(/\b\w+\b/g);
  let resultat = "";

  for (let i = 0; i < mots.length; i++) {
    resultat += mots[i] + "<br>";
  }

  document.getElementById("holder2").innerHTML = resultat;
}




