Documentation - Fenêtre modale (`Modal`)
========================================

### SK.Modal
Permet de créer une fenêtre modale de SpawnKill.

#### Paramètres 

* `options.title` (string) : Titre de la fenêtre modale, si vide, il ne peut pas avoir de bouton **fermer**
* `options.content` (string | élément jQuery) : Contenu HTML de la fenêtre modale
* `options.buttons` (array<SK.Button>) : Tableau de boutons à ajouter à la fenêtre modale
* `options.location` (string) : Position de la fenêtre modale. Valeurs : **top** (défaut), **center**, et **notification**
* `hasCloseButton` (bool) : Si un bouton pour fermer la fenêtre modale doit être affiché, alors la valeur doit être à **true** (defaut), sinon à **false**
* `closeButtonAction` (function) : Fonction appelée quand on clique sur le bouton fermer. Par défaut, la fenêtre modale se ferme.

#### Remarques

L'objet `options` peut contenir d'autres clés/valeurs qui seront associées à la fenêtre modale, et se comporteront tel le système HTML "attribut" => "valeur".

#### Utilisation

```javascript
var options = {
    title : "Mon titre",
    content : "Je suis une superbe fenêtre modale",
    buttons : [],
    closeButtonAction : function() {
        console.log("Vous allez fermer la fenêtre modale.");
        
        SK.Util.hideModal();
    }
};

// On crée la fenêtre modale
var $modal = new SK.Modal(options);

// On affiche la fenêtre modale
SK.Util.showModal($modal);
```
