let text_tokens = [];
let text_lines = [];


window.onload = function() {
    let fileInput = document.getElementById('fileInput');
    let fileDisplayArea = document.getElementById('fileDisplayArea');

   
    fileInput.addEventListener('change', function(e) {
       
        let file = fileInput.files[0];
        
        let textType = new RegExp("text.*");

        if (file.type.match(textType)) { 
            
            var reader = new FileReader();

           
      
            reader.onload = function(e) {
                fileDisplayArea.innerText = reader.result;
                segmentation();

                if (text_tokens.length != 0) {
                    document.getElementById("logger").innerHTML = '<span class="infolog">Fichier chargé avec succès, ' + text_tokens.length + ' tokens dans le texte et ' + text_lines.length + ' lignes non vides.</span>';
                }
            }

            
            reader.readAsText(file);
        } else { 
            fileDisplayArea.innerText = "";
            text_tokens = [];
            text_lines = [];
            document.getElementById("logger").innerHTML = '<span class="errorlog">Type de fichier non supporté !</span>';
        }
    });
}


function afficheCacheAide() {
    let aide = document.getElementById("aide");
    let boutonAide = document.getElementById("boutonAide");
    let display = aide.style.display;
    
    if (display === "none") {
        aide.style.display = "block";
        boutonAide.innerText = "Cacher l'aide";
    } else {
        aide.style.display = "none";
        boutonAide.innerText = "Afficher l'aide";
    }
}


function segmentation() {
    let text = document.getElementById("fileDisplayArea").innerText;
    let delim = document.getElementById("delimID").value;
    
    if (delim === "") {
        document.getElementById("logger").innerHTML = '<span class="errorlog">Aucun délimiteur donné !</span>'
        return;
    }

    let regex_delim = new RegExp(
        "["
        + delim
            .replace("-", "\\-") 
            .replace("[", "\\[").replace("]", "\\]") 
        + "\\s" 
        + "]+" 
    );

    let tokens_tmp = text.split(regex_delim);
    text_tokens = tokens_tmp.filter(x => x.trim() != ''); 
    
    text_lines = text.split(new RegExp("[\\r\\n]+")).filter(x => x.trim() != '');

    
   
}


function dictionnaire() {
    let comptes = new Map();
    let display = document.getElementById("page-analysis");

    if (text_tokens.length === 0) {
        document.getElementById("logger").innerHTML = '<span class="errorlog">Il faut d\'abord charger un fichier !</span>';
        return;
    }

    for (let token of text_tokens) {
        comptes.set(token, (comptes.get(token) ?? 0) + 1);
    }
    
    let comptes_liste = Array.from(comptes);
    comptes_liste = comptes_liste.sort(function(a, b) {
        
        return b[1] - a[1]; 

    });

    let table = document.createElement("table");
    table.style.margin = "auto";
    let entete = table.appendChild(document.createElement("tr"));
    entete.innerHTML = "<th>mot</th><th>compte</th>";
    
    for (let [mot, compte] of comptes_liste) {
        let ligne_element = table.appendChild(document.createElement("tr"));
        let cellule_mot = ligne_element.appendChild(document.createElement("td"));
        let cellule_compte = ligne_element.appendChild(document.createElement("td"));
        cellule_mot.innerHTML = mot;
        cellule_compte.innerHTML = compte;
    }

    display.innerHTML = "";
    display.appendChild(table);
    document.getElementById("logger").innerHTML = '';
}


function grep() {
    let pole = document.getElementById("poleID").value.trim();
    let display = document.getElementById("page-analysis");
    
    if (text_lines.length === 0) {
     
        document.getElementById("logger").innerHTML = '<span class="errorlog">Il faut d\'abord charger un fichier !</span>';
        return;
    }

    if (pole === '') {
       
        document.getElementById("logger").innerHTML = '<span class="errorlog">Le pôle n\'est pas renseigné !</span>';
        return;
    }
    let pole_regex = new RegExp('(' + pole + ')', "g");

    display.innerHTML = "";
    for (let line of text_lines) {
        if (line.search(pole_regex) != -1) {
            let paragraph = document.createElement("p");
            paragraph.innerHTML = line.replaceAll(pole_regex, '<span style="color:red;">$1</span>')
            display.appendChild(paragraph);
        }
    }
}

function concordancier() {
    let pole = document.getElementById("poleID").value.trim();
    let display = document.getElementById("page-analysis");
    
    if (text_tokens.length === 0) {
       
        document.getElementById("logger").innerHTML = '<span class="errorlog">Il faut d\'abord charger un fichier !</span>';
        return;
    }

    if (pole === '') {
        
        document.getElementById("logger").innerHTML = '<span class="errorlog">Le pôle n\'est pas renseigné !</span>';
        return;
    }

    let pole_regex = new RegExp("^" + pole + "$", "g");
    let tailleContexte = Number(document.getElementById('lgID').value ?? "10");

    let table = document.createElement("table");
    table.style.margin = "auto";
    let entete = table.appendChild(document.createElement("tr"));
    entete.innerHTML = "<th>contexte gauche</th><th>pôle</th><th>contexte droit</th>";

    display.innerHTML = "";
    for (let i=0; i < text_tokens.length; i++) {
        if (text_tokens[i].search(pole_regex) != -1) {
            let start = Math.max(i - tailleContexte, 0);
            let end = Math.min(i + tailleContexte, text_tokens.length);
            let lc = text_tokens.slice(start, i);
            let rc = text_tokens.slice(i+1, end+1);
            let row = document.createElement("tr");

           
            row.appendChild(document.createElement("td"));
            row.childNodes[row.childNodes.length - 1].innerHTML = lc.join(' ');
            row.appendChild(document.createElement("td"));
            row.childNodes[row.childNodes.length - 1].innerHTML = text_tokens[i];
            row.appendChild(document.createElement("td"));
            row.childNodes[row.childNodes.length - 1].innerHTML = rc.join(' ');
            table.appendChild(row);
        }
    }
    
    display.innerHTML = "";
    display.appendChild(table);
}

function long() {
	// Chargé le texte 
    let text = document.getElementById("fileDisplayArea").innerText;
    let texteoriginal = text.split(/[\n\s,.;']+/);
    let motlong="";
        for (i=0; i<texteoriginal.length;i++) {
            if (texteoriginal[i].length>motlong.length)
            {motlong=texteoriginal[i]} }
        // On affiche le résultat
        document.getElementById('page-analysis').innerHTML = "Le mot le plus long est « <u>"+motlong+"</u> ».";
        
}

function majuscule(){
    // On vide la zone d'affichage d'analyse
    document.getElementById('page-analysis').innerHTML ="";
    // On récupère le texte à transformer
    var allLines = document.getElementById('fileDisplayArea').innerText; 
    //On segmente en ligne selon les retour à la ligne
    allLines=allLines.split("\n");
    var resultat="";
    //On met chaque ligne segmentée en majuscule puis on conserve la mise en forme d'origine en créant des retour à la ligne avec <br> à la fin de chaque ligne
    for (var nb=0;nb<allLines.length;nb++) {
        var ligne=allLines[nb];
        var result = ligne.toUpperCase();
        resultat += result+"<br/>";
    }
    //On affiche le résultat
    document.getElementById('page-analysis').innerHTML+=resultat;
 }
 
 function minuscule(){
    // On vide la zone d'affichage d'analyse
    document.getElementById('page-analysis').innerHTML ="";
    // On récupère le texte à transformer
    var allLines = document.getElementById('fileDisplayArea').innerText; 
    //On segmente en ligne selon les retour à la ligne
    allLines=allLines.split("\n");
    var resultat="";
    //On met chaque ligne segmentée en minuscule puis on conserve la mise en forme d'origine en créant des retours à la ligne avec <br> à la fin de chaque ligne
    for (var nb=0;nb<allLines.length;nb++) {
        var ligne=allLines[nb];
        var result = ligne.toLowerCase();
        resultat += result+"<br/>";
    }
    //On affiche le résultat
    document.getElementById('page-analysis').innerHTML+=resultat;
 }
