Documentation - Liste déroulante (`DropdownList`)
========================================

### SK.DropdownList
Permet de créer une liste déroulante de SpawnKill.

#### Paramètres 

Paramètres de la liste déroulante
* `options.value` (string) : Valeur par défaut
* `options.values` (object) : Liste de valeurs

Paramètres du `<select>`
* `options.select` (object) : Objet qui contient les options du `<select>`

#### Remarques

Les objets `options`, et `options.select` peuvent contenir d'autres clés/valeurs qui seront respectivement associées à la liste déroulante et au `<select>`, et se comporteront tel le système HTML "attribut" => "valeur".

#### Utilisation

```javascript
var options = {
    class : "je-suis-une-liste-deroulante",
    values : {
        label1 : "Label 1",
        label2 : "Label 2",
        label3 : "Label 3"
    },
    value : "label2"

    select : {
        class : "je-suis-un-select"
    }
};

// On crée la liste déroulante
var $dropdownList = new SK.DropdownList(options);
```
