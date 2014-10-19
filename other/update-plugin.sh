#!/bin/bash
CURRENT_DIR="$( cd "$( dirname "$0" )" && pwd )"
source "${CURRENT_DIR}/update-plugin-config.sh"

# On supprime tout ce qui se trouve dans le répertoire
if [ ! -z "${gm_script_path}" ]; then

	rm -rfv ${gm_script_path}*

	# On importe le script principal
	ln -sv "${dev_script_path}${main_script_file}" "$gm_script_path"

	# Et on importe les scripts et les ressources nécessaires au script
	regex="^\/\/ @(require[[:space:]]*|resource[[:space:]]+[^[:space:]]+[[:space:]]+)([^[:space:]\?]*)(\?.*)?$"

	while read line; do

	    if [[ $line =~ $regex ]]; then
	        file="${BASH_REMATCH[2]}"
	        echo "Copie du fichier $file."
	        ln -sv "${dev_script_path}${file}" "$gm_script_path"
	    fi

	done < ${dev_script_path}${main_script_file}
fi