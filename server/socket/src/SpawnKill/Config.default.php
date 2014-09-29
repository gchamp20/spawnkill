<?php
namespace SpawnKill;

/**
 * Configuration du serveur
 */
class Config {
    public static $DEBUG = true;
    public static $LOG_LEVEL = 3; //Niveau de log, de 0 à 3, 3 étant le maximum de messages loggés
    public static $COLOR_SHELL = true;
    public static $SERVER_IP = '127.0.0.1';

    public static $CURL_TIMEOUT_MS = 1500;
}