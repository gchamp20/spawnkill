Documentation - Liste déroulante (`DropdownList`)
========================================

*Dernière mise à jour : v1.13.1.2*

### SK.DropdownList
Permet de créer une liste déroulante de SpawnKill.

#### Paramètres 

Paramètres de la liste déroulante
* `options.value` (string) : Valeur par défaut
* `options.values` (object) : Liste de valeurs de la forme `{ "value" : "label", "value2" : "label2" }`
* `options.*` (string) : Tout autre attribut passé à la création d'un objet jQuery (`class`, `id`, `click`, ...)

Paramètres du `<select>`
* `options.select` (object) : Objet littéral contenant les différents paramètres
    * `options.select.*` (string) : Tout autre attribut passé à la création d'un objet jQuery (`class`, `id`, `click`, ...)
    

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
