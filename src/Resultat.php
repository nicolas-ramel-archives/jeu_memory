<?php

namespace App ;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity
 * @ORM\Table(name="resultats")
 */
class Resultat
{
    /**
     * @ORM\Id
     * @ORM\Column(type="integer")
     * @ORM\GeneratedValue
     */
    protected $id;
    
    /**
     * @ORM\Column(name="gagne", type="boolean", nullable=true)
     */
    protected $gagne;


    /**
     * @ORM\Column(name="temps", type="integer", nullable=true)
     */
    protected $temps;



    /**
     * @ORM\Column(name="date_add", type="datetime", nullable=true)
     */
    protected $dateAdd;


    public function getId()
    {
        return $this->id;
    }

    public function getGagne()
    {
        return $this->gagne;
    }

    public function setGagne($gagne)
    {
        $this->gagne = $gagne;
    }

    public function getTemps()
    {
        return $this->temps;
    }

    public function setTemps($temps)
    {
        $this->temps = $temps;
    }

    public function getDateAdd()
    {
        return $this->dateAdd;
    }

    public function setDateAdd($dateAdd)
    {
        $this->dateAdd = $dateAdd;
    }
}