Développer sans réinstallation avec Greasemonkey / TamperMoneky
===============================================================

Il est possible de développer un userscript sans avoir besoin de réinstaller le script à chaque modification. Ce guide détaille les procédures à suivre pour Firefox et Chrome, sous Windows et Ubuntu.
La solution que je propose n'est pas optimale, on peut sans doute faire plus propre et plus "automatique", mais elle permet déjà d'améliorer le confort de développement.
Si vous voulez améliorer ce guide, n'hésitez pas à faire une `Pull Request` :)

Firefox
-------

Le principe est de remplacer les fichiers du script par des liens symboliques vers votre script en local.

### Sous Ubuntu

Pour cela, configurez le script bash en le copiant puis en remplaçant les variables du fichier (depuis la racine du script) :

```
cp other/update-plugin-config.default.sh other/update-plugin-config.sh
chmod u+x other/update-plugin-config.sh
nano other/update-plugin-config.sh
```

Le `repertoire_du_script` (`gm_script_path`) se trouve dans :

```
/home/<user>/.mozilla/firefox/<profile_name>/gm_scripts/<script_name>/
```

Le `repertoire_de_developpement` (`dev_script_path`) est le répertoire du
script que vous modifiez

Le `nom_du_fichier_principal` (`main_script_file`) est le chemin du fichier `.user.js` depuis la racine du script.

Par exemple, chez moi, le fichier donne ça :

```
#!/bin/bash
gm_script_path="/home/dorian/.mozilla/firefox/8ned6ue0.default/gm_scripts/JVC_SpawnKill/"
dev_script_path="/var/www/spawnkill/"
main_script_file="jvc-spawnkill.user.js"
```

### Sous Windows

Le plus simple est de lancer le script du dessus depuis `git bash`.
Si vous avez une solution plus "windowsienne" de prête à l'emploi, merci de m'en faire part :smile:

Le `repertoire_du_script` se trouve dans :

```
c/Users/<user>/AppData/Roaming/Mozilla/Firefox/Profiles/<profile_name>/gm_scripts/<script_name>/
```

Chrome
------