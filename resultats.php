<?php

require 'bootstrap.php';

use App\Resultat ;

if (isset($_POST["action"]) && $_POST["action"] == "send") {
    $resultat = new Resultat();
    $resultat->setGagne($_POST["resultat"] == "gagne" ? true:false);
    $resultat->setTemps((int) $_POST["duree"]);
    $resultat->setNiveau($_POST["niveau"]);
    $resultat->setDateAdd(new Datetime());

    $entityManager->persist($resultat);
    $entityManager->flush();
}

// recherche le meilleur score par niveau  et la moyenne
$dql = "SELECT min(r.temps) as meilleurScore, avg(r.temps) as moyenne, r.niveau FROM App\Resultat r WHERE r.gagne = true GROUP BY r.niveau";
$query = $entityManager->createQuery($dql);

// retourne le resultat en JSON
echo json_encode($query->getResult());