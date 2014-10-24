SpawnKill - Serveur
===================

> Serveur utilisé par SpawnKill pour mettre en cache certaines données
> et accéder à différentes API et fonctionnalités optimisées pour
> l'userscript.

Installation
------------

Certaines dépendances (librairies PHP) sont requises pour le bon
fonctionnement du serveur. Elles sont gérées avec [composer]. Pour les
installer, après avoir [installé composer][install-composer], lancez la
commande `composer install`.

[composer]: https://getcomposer.org/
[install-composer]: https://getcomposer.org/doc/00-intro.md#downloading-the-composer-executable

Tâches
------

Un [makefile] est présent pour gérer certaines tâches, comme la
correction automatique du code PHP pour [respecter][php-cs-fixer]
[certaines][psr-1] [conventions][psr-2].

Pour exécuter une tâche, il faut lancer la commande `make <nom-tâche>`
sur un système [*POSIX-compliant*][what-is-posix].

[makefile]: http://pubs.opengroup.org/onlinepubs/007904975/utilities/make.html
[php-cs-fixer]: https://github.com/fabpot/PHP-CS-Fixer
[psr-1]: http://www.php-fig.org/psr/psr-1/
[psr-2]: http://www.php-fig.org/psr/psr-2/
[what-is-posix]: http://stackoverflow.com/questions/1780599/i-never-really-understood-what-is-posix

### `fix`

Exécute [`php-cs-fixer`][php-cs-fixer] sur ce dossier pour corriger
automatiquement le code qui ne respecte pas les conventions évoquées
plus haut.

### `fix-diff`

Affiche les modifications à apporter au code pour le corriger sans les
appliquer directement.
