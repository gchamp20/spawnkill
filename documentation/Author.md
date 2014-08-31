Documentation - Auteur (`Author`)
=================================

*Dernière mise à jour : v1.13.1.2*

### SK.Author 
Permet de représenter un auteur de JVC.

#### Paramètres
* `pseudo` (string) : Pseudo de l'auteur

#### Utilisation
Il n'est pas utile d'utiliser cette classe sans avoir appelé la méthode `SK.Author.initFromData`, ou la méthode `SK.Author.initFromCdv`.

----

### SK.Author.initFromData
Permet d'initialiser les données relatives à un auteur à partir d'un objet `data`.

#### Paramètres
* `data.version` (string) : Version du modèle. Permet de déprecier le cache si la structure change
* `data.pseudo` (string) : Son pseudo  
* `data.rank` (string) : Son rang. Valeurs : **carton** ou **bronze** ou **argent** ou **or** ou **rubis** ou **saphir** ou **emeraude** ou **diamant**
* `data.messageCount` (int) : Nombre de message  
* `data.avatar` (string) : Adresse URL de l'avatar version petit 
* `data.fullSizeAvatar` (string) : Adresse URL de l'avatar version taille entière  
* `data.gender` (string) :  Sexe de l'auteur. Valeurs **male** ou **female**  
* `data.profileLink` (string) : Adresse URL de la CDV de l'auteur  
* `data.profileUnavailable` (bool) : Vrai si le profil est banni/supprimé. Valeurs : **true** ou **false**  
* `data.errorType` (string) : Si `pseudo.profileUnavailable` a la valeur **true**, alors ``pseudo.errorType`` peut prendre la valeur suivante : **ban tempo** ou **ban def** ou **error** ou **removed**

#### Utilisation
```javascript
// On initialise notre objet SK.Author
var author = new SK.Author("UnPseudo");
// On cherche dans le localStorage si des données relatives à l'auteur sont présentes
var data = SK.Util.getValue("authors." + author.pseudo);

// Si les données ne sont pas dépréciées
if(SK.Author.isDataValid(data)) {
    // Alors on initialise les données relatives à l'auteur
    author.initFromData(data);
}
```

----

### SK.Author.initFromCdv
Permet d'initialiser les données relatives à un auteur à partir d'un objet jQuery $cdv.

#### Paramètres
* `$cdv` (jQuery object) : Objet jQuery qui contient des données issues d'une requête à l'API JVC (voir les fonctions `Util.jvc` et `Util.api`)

#### Utilisation

```javascript
var pseudo = "UnPseudo";
var author = new SK.Author(pseudo);

// Requête à l'API JVC
SK.Util.api("pseudos", [ "UnPseudo", "un_autre_pseudo" ], function($api) {
    // On boucle sur chaque pseudo trouvé
    $api.find("author").each(function() {
        var $cdv = $(this).find("cdv");
        
        // On initialise les informations de la CDV
        author.initFromCdv($cdv);
    });
});
```

----

### SK.Author.saveLocalData
Enregistre les données relatives à l'auteur dans le localStorage.

#### Paramètres
Aucun.

#### Utilisation
```javascript
// On estime qu'on a déjà un "author" avec ses données

author.saveLocalData();
```

----

### SK.Author.loadLocalData
Récupère les données relatives à l'auteur dans le localStorage.

#### Paramètres
Aucun.

#### Utilisation
```javascript
var pseudo = "UnPseudo";
var author = new SK.Author(pseudo); 

var data = author.loadLocalData();
// On affiche les données de l'auteur
console.log(data);
```

----

### SK.Author.getRankFromColor
Retourne le nom du rang en fonction de la couleur donnée en paramètre.

#### Paramètres
* `hexString` (string) : Couleur sous le format hexadécimal. Valeurs : **#CDAF69** (carton) ou **#E7AD87** (bronze) ou **#CCCCCC** (argent) ou **#F3D15C** (or) ou **#E5727A** (rubis) ou **#3C54C6** (saphir) ou **#3D9F6A** (emeraude) ou **#C7EBF9** (diamant).

#### Utilisation
```javascript
var color = "#C7EBF9";
var rank = SK.Author.getRankFromColor(color);

// Affiche "diamant"
console.log(rank);
```
