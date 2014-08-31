Documentation - Bouton (`Button`)
========================================

*Dernière mise à jour : v1.13.1.2*

### SK.Button
Permet de créer un bouton de SpawnKill.

#### Paramètres 

Paramètres pour le bouton :
* `options.class` (string) : Attribut "class" pour le bouton
* `options.text` (string) : Texte du bouton 
* `options.href` (string) : Lien vers lequel le bouton pointe
* `options.*` (string) : Tout autre attribut passé à la création d'un objet jQuery (`class`, `id`, `click`, ...)

Paramètres pour l'infobulle :
* `options.toolip` (object) : Objet littéral contenant les différents paramètres
    * `options.tooltip.position` (string) : Position de l'infobulle. Valeurs : **top** (défaut) ou **bottom** ou **right**
    * `options.tooltip.*` (string) : Tout autre attribut passé à la création d'un objet jQuery (`class`, `id`, `click`, ...)

Paramètres pour le wrapper 
* `options.wrapper` (object) : Objet littéral contenant les différents paramètres
    * `options.wrapper.*` (string) : Tout attribut passé à la création d'un objet jQuery (`class`, `id`, `click`, ...)


#### Utilisation

```javascript
var options = {
    class : "mon-bouton-il-est-cool large",
    text : "Mon bouton c'est le meilleur",
    href : "http://www.spawnkill.fr",

    tooltip : {
        class: "large",
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

Html du bouton créé  :

```html
<div class="le-wrapper sk-button" data-foo="bar" >
    <a href="http://www.spawnkill.fr" class="mon-bouton-il-est-cool sk-button-content large">
        Mon bouton c'est le meilleur
    </a>
    <div style="width: 240px;" class="tooltip right large">
        Je t'ai dit que mon bouton c'était le meilleur ?
    </div>
</div>
```
