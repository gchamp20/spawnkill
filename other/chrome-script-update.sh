#!/bin/bash

# Prérequis :
# -----------
# Droits d'écriture sur /tmp
# Google Chrome installé avec l'extension Tampermonkey
# Droits d'ouvrir des urls locales à Tampermonkey
# Possibilité de lancer Chrome via la commande "google-chrome" dans le terminal

CURRENT_DIR="$( cd "$( dirname "$0" )" && pwd )"
source "${CURRENT_DIR}/update-plugin-config.sh"

tmp_dir_name="chrome-script-update"
tmp_script_name="script.user.js"

# On crée un répertoire temporaire pour placer le script test
mkdir "/tmp/$tmp_dir_name" &> /dev/null

# On vide le script de dev
> "/tmp/$tmp_dir_name/$tmp_script_name"


# On parcours le fichier principal pour produire un script temporaire
# regex="^\/\/ @(require[[:space:]]*|resource[[:space:]]+[^[:space:]]+[[:space:]]+)([^[:space:]\?]*)(\?.*)?$"

# while read line; do

#     if [[ $line =~ $regex ]]; then
#         file="${BASH_REMATCH[2]}"
#         echo "Copie du fichier $file."
#         ln -sv "${dev_script_path}${file}" "$gm_script_path"
#     fi

# done < ${dev_script_path}${main_script_file}
	# On converti les chemins vers des chemins locaux

# On ouvre le script dans chrome (avec une chaîne aléatoire pour éviter le cache)
google-chrome --enable-easy-off-store-extension-install "file:///tmp/$tmp_dir_name/$tmp_script_name"