Développer sans réinstallation avec Greasemonkey / TamperMoneky
===============================================================

Il est possible de développer un userscript sans avoir besoin de réinstaller le script à chaque modification. Ce guide détaille les procédures à suivre pour Firefox et Chrome, sous Windows et Ubuntu.
La solution que je propose n'est pas optimale, on peut sans doute faire plus propre et plus "automatique", mais elle permet déjà d'améliorer le confort de développement.
Si vous voulez améliorer ce guide, n'hésitez pas à faire une `Pull Request` :)

Firefox
-------

Le principe est de remplacer les fichiers du scripts par des liens symboliques vers votre script en local.

### Sous Ubuntu

Le `repertoire_du_script` se trouve dans :

```
/home/<user>/.mozilla/firefox/<profile_name>/gm_scripts/<script_name>/
```

Par exemple, chez moi, le répertoire de SpawnKill se trouve dans :

```
/home/dorian/.mozilla/firefox/8ned6ue0.default/gm_scripts/JVC_SpawnKill/
```

### Sous Windows

Le `repertoire_du_script` se trouve dans :

```
C:\Users\<user>\AppData\Roaming\Mozilla\Firefox\Profiles\<profile_name>\gm_scripts\<script_name>\
```

Par exemple, chez moi, le répertoire de SpawnKill se trouve dans :

```
C:\Users\Dorian\AppData\Roaming\Mozilla\Firefox\Profiles\z8o408dk.default\gm_scripts\JVC_SpawnKill\
```

Chrome
------


Pistes :
- Concaténation Script Shell : http://forum.hardware.fr/hfr/OSAlternatifs/shell-concatenation-string-sujet_38505_1.htm1
- Concaténation batch : http://www.clubic.com/forum/microsoft-windows/batch-concatener-deux-variables-id498832-page1.html
