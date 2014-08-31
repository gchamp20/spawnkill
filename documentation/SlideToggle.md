Documentation - Toggle ON/OFF (`SlideToggle`)
========================================

*Dernière mise à jour : v1.13.1.2*

### SK.SlideToggle
Permet de créer un toggle ON/OFF de SpawnKill.

#### Paramètres 

Paramètre du toggle ON/OFF
* `options.value` (bool) : Valeur par défaut **true** pour "ON", ou **false** (défaut) pour "OFF"
* `options.*` (string) : Tout autre attribut passé à la création d'un objet jQuery (`class`, `id`, `click`, ...)

Paramètres de la checkbox
* `options.checkbox` (object) : Objet littéral contenant les différents paramètres
    * `options.checkbox.disabled` (string) : Permet de désactiver le toggle ON/OFF si la valeur est **disabled**
    * `options.checkbox.*` (string) : Tout autre attribut passé à la création d'un objet jQuery (`class`, `id`, `click`, ...)

#### Utilisation

```javascript
var options = {
    text : "Je suis un label",
    value : true,
    title : "Tu ne peux pas me désactiver",

    checkbox : {
        disabled : "disabled"
    }
};

// On crée le Toggle ON/OFF
var $toggle = new SK.SlideToggle(options);
```
