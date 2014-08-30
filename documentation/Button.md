Documentation - Bouton (`Button`)
========================================

### SK.Button
Permet de créer un bouton de SpawnKill.

#### Paramètres 

Paramètres pour le bouton :
* `options.class` (string) : Attribut "class" pour le bouton
* `options.text` (string) : Texte du bouton 
* `options.href` (string) : Lien vers lequel le bouton pointe

Paramètres pour l'infobulle :
* `options.tooltip.text` (string) : Texte de l'infobulle 
* `options.tooltip.class` (string) : Classe de l'infobulle 
* `options.tooltip.position` (string) : Position de l'infobulle. Valeurs : **top** (défaut) ou **bottom** ou **right**

Paramètres pour le wrapper 
* `options.wrapper` (object) : Objet qui contient des attributs/valeurs pour le code HTML du wrapper

#### Remarques

L'objet `options` et `options.wrapper` peuvent contenir d'autres clés/valeurs qui seront respectivement associées au bouton et au wrapper, et se comporteront tel le système HTML "attribut" => "valeur".

#### Utilisation

```javascript
var options = {
    class : "spawnkill-button mon-bouton-il-est-cool",
    text : "Mon bouton c'est le meilleur",
    href : "http://www.spawnkill.fr",

    tooltip : {
        text : "Je t'ai dit que mon bouton c'était le meilleur ?",
        position : "right"
    },

    wrapper : {
        class : "le-wrapper",
        "data-foo" : "bar"
    }
};

// On crée le bouton
var $button = new SK.Button(options);

// On accroche le bouton au premier post 
$(".msg").first().append($button);
```
