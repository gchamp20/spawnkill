<?php
namespace SpawnKill;

/**
 * Configuration du serveur
 */
class Config {
    public static $DEBUG = false; // À passer à false en production
    public static $LOG_LEVEL = 1; //Niveau de log, de 0 à 3, 3 étant le maximum de messages loggés
    public static $COLOR_SHELL = false; // Couleur dans les logs
    public static $SERVER_IP = '127.0.0.1'; // Adresse IP du serveur
    public static $SERVER_PORT = 8080; // Adresse IP du serveur
    public static $SERVER_UPDATE_PORT = 8081; // Adresse IP du serveur

    public static $CURL_TIMEOUT_MS = 1500;
}