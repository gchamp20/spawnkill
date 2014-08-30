Documentation - Toggle ON/OFF (`SlideToggle`)
========================================

### SK.SlideToggle
Permet de créer un toggle ON/OFF de SpawnKill.

#### Paramètres 

Paramètre du toggle ON/OFF
* `options.value` (bool) : Valeur par défaut **true** pour "ON", ou **false** (défaut) pour "OFF"

Paramètres du checkbox
* `options.checkbox.disabled` (string) : Permet de désactiver le toggle ON/OFF si la valeur est **disabled**

#### Remarques

Les objets `options`, et `options.checkbox` peuvent contenir d'autres clés/valeurs qui seront respectivement associées au toggle ON/OFF et au checkbox, et se comporteront tel le système HTML "attribut" => "valeur".

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
