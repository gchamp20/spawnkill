Développer sans réinstallation avec Greasemonkey / TamperMonkey
===============================================================

Il est possible de développer un userscript sans avoir besoin de réinstaller le script à chaque modification. Ce guide détaille les procédures à suivre pour Firefox et Chrome, sous Ubuntu en prenant pour exemple le script SpawnKill. La procédure est la même pour tout autre script.
Si vous voulez améliorer ce guide, notamment avec un guide pour Windows, n'hésitez pas à faire une `Pull Request` :)

Configuration commune à Firefox et Chrome
-----------------------------------------

### Sous Ubuntu

Configurez le script bash en le copiant puis en remplaçant les variables du fichier (depuis la racine du script) :

```bash
cp other/local-dev/local-dev-config.default.sh other/local-dev/local-dev-config.sh
nano other/local-dev/local-dev-config.sh
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

Firefox
-------

Le principe est de remplacer les fichiers du script par des liens symboliques vers votre script en local.

### Sous Ubuntu

__Prérequis :__
- Votre distribution doit disposer de `/bin/bash`
- Firefox doit être installé avec l'extension Greasemonkey
- La [configuration](#configuration-commune-à-firefox-et-chrome) doit être effectuée

Une fois la configuration effectuée, il vous suffit d'installer SpawnKill sur Firefox et de lancer le script remplaçant les fichiers du scripts par vos fichiers de développement (depuis la racine du script) :

```
other/local-dev/firefox-local-dev
```

__Attention__, à chaque fois que le fichier principal est modifié, il faut relancer le script ci-dessus.

__Note :__ Parfois, le script s'installe plusieurs fois et la procédure ne fonctionne donc plus. Dans ce cas, allez dans le répertoire des scripts :

```
/home/<user>/.mozilla/firefox/<profile_name>/gm_scripts/
```

Et supprimez toutes les occurences du script concerné.

Chrome
------

Le principe est d'indiquer au script qu'il doit utiliser des fichiers locaux plutôt que les fichiers en ligne.

### Sous Ubuntu

__Prérequis :__
- Le script doit avoir les droits d'écriture sur `/tmp`
- Votre distribution doit disposer de `/bin/bash`
- Chrome doit être installé avec l'extension Tampermonkey
- Chrome doit pouvoir être lancé depuis la ligne de commande en tapant `google-chrome`
- Tampermonkey doit pouvoir ouvrir des url du type `file://...` (voir plus bas)
- La [configuration](#configuration-commune-à-firefox-et-chrome) doit être effectuée

Tout d'abord, configurer Tampermonkey pour accepter les urls du type `file://...`. Pour cela, faites `Clic Droit > Gérer` sur l'icône de Tampermonkey et cocher la case `Autoriser l'accès aux URL de fichier `.

Une fois la configuration effectuée, il vous suffit de désinstaller SpawnKill de Chrome et de lancer le script chargé de le remplacer par vos fichiers de développement (depuis la racine du script) :

```
other/local-dev/chrome-local-dev
```
__Attention__, à chaque fois que le fichier principal est modifié, il faut relancer le script ci-dessus.