<?php

require 'bootstrap.php';

use App\Resultat ;


$resultat = new Resultat();
$resultat->setGagne(true);
$resultat->setTemps(45);
$resultat->setDateAdd(new Datetime());

$entityManager->persist($resultat);
$entityManager->flush();