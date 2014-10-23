Développer sans réinstallation avec Greasemonkey / TamperMoneky
===============================================================

Il est possible de développer un userscript sans avoir besoin de réinstaller le script à chaque modification. Ce guide détaille les procédures à suivre pour Firefox et Chrome, sous Ubuntu.
Si vous voulez améliorer ce guide, n'hésitez pas à faire une `Pull Request` :)

Firefox
-------

Le principe est de remplacer les fichiers du script par des liens symboliques vers votre script en local.

### Sous Ubuntu

Pour cela, configurez le script bash en le copiant puis en remplaçant les variables du fichier (depuis la racine du script) :

```bash
cp other/local-dev-config.default.sh other/local-dev-config.sh
chmod u+x other/local-dev-config.sh
nano other/local-dev-config.sh
```

Le `repertoire_du_script` (`gm_script_path`) se trouve dans :

```
/home/<user>/.mozilla/firefox/<profile_name>/gm_scripts/<script_name>/
```

Le `repertoire_de_developpement` (`dev_script_path`) est le répertoire du
script que vous modifiez

Le `nom_du_fichier_principal` (`main_script_file`) est le chemin du fichier `.user.js` depuis la racine du script.

Par exemple, chez moi, le fichier donne ça :

```bash
#!/bin/bash
gm_script_path="/home/dorian/.mozilla/firefox/8ned6ue0.default/gm_scripts/JVC_SpawnKill/"
dev_script_path="/var/www/spawnkill/"
main_script_file="jvc-spawnkill.user.js"
```

Une fois cette configuration effectuée, il vous suffit d'installer SpawnKill sur Firefox et de lancer le script remplaçant les fichiers du scripts par vos fichiers de développement (depuis la racine du script) :

```
other/firefox-local-dev.sh
```

__Attention__, à chaque fois que le fichier principal est modifié, il faut relancer le script ci-dessus.

__Note :__ Parfois, le script s'installe plusieurs fois et la procédure ne fonctionne donc plus. Dans ce cas, allez dans le répertoire des scripts :

```
/home/<user>/.mozilla/firefox/<profile_name>/gm_scripts/
```

Et supprimez toutes les occurences du script concerné.

Chrome
------