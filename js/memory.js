class memory {
    lastPositionClick = -1;
    pretCarteSuivante = true;
    jeuTermine = false;

    // constructeur de la class permettant d'initiliser les valeurs et construire l'interface de jeu
    constructor(niveauDifficulte, dureeJeu, zoneJeu, idProgressBarTimer, afficherJeu, afficheGagne, affichePerdu) {
        this.nbSymboles = this.getNiveauDifficulte(niveauDifficulte);
        this.idProgressBarTimer = idProgressBarTimer;
        this.zoneJeu = zoneJeu;
        this.dureeJeu = dureeJeu;
        this.afficheGagne = afficheGagne;
        this.affichePerdu = affichePerdu;
        this.afficherJeu = afficherJeu;

        // définit la position des cartes
        this.definitPositionCarte();

        // dessine la zone de jeu dans la div "zoneJeu"
        this.dessineZoneJeu();

        // lance le timer du jeu
        this.dateLancement = new Date();
        this.suiviTemps();

        // affiche le jeu
        this.afficherJeu();
    }

    // retourne le nombre de symboles liés au niveau de dificulté choisi
    getNiveauDifficulte(niveau) {
        switch (niveau) {
            case 'facile':
                return 6;
                break;
            case 'normal':
                return 12;
                break;
            case 'dificile':
                return 18;
                break;
            default:
                return 12;
        }
    }

    // effectue le tirage aléatoire des positions des symboles
    definitPositionCarte() {
        this.positionCarte = []; //  tableau permettant de stocker la position des symboles

        // boucle sur le nombre de symboles à inclure dans le tableau
        for (let nSymbole = 0; nSymbole < this.nbSymboles; nSymbole++) {
            // on doit affecter le symbole sur 2 positions différentes
            for (let nbAffectation = 1; nbAffectation <= 2; nbAffectation++) {
                // tirage aléatoire d'une position
                var position = this.getRandomInt(0, this.nbSymboles * 2);

                // boucle permettant de rechercher une position libre
                while (this.positionCarte[position] !== undefined) {
                    position = this.getRandomInt(0, this.nbSymboles * 2);
                }

                // affecte un numero de symbole sur la position libre
                this.positionCarte[position] = nSymbole;
            }
        }
    }

    // méthode pour le traitement après un click sur une carte
    clickCarte(position) {
        // un blocage est prévu pendant le temps d'attente avant un nouveau clic
        // et le jeu ne doit pas être terminé
        if (this.pretCarteSuivante && !this.jeuTermine) {
            let estLePremierElement = true;
            if (this.lastPositionClick == -1) {
                this.lastPositionClick = position;
            } else {
                estLePremierElement = false;
            }

            // ajoute la class afficheSymbole sur la div pour afficher l'image de background
            $("#" + this.zoneJeu + " .carte[data-position=" + position + "]").addClass("afficheSymbole");

            // test si le clic correspond à l'affichage du 2e symbole
            if (estLePremierElement == false) {
                // les 2 cartes sont identiques
                if (this.positionCarte[position] == this.positionCarte[this.lastPositionClick]) {
                    $("#" + this.zoneJeu + " .carte[data-position=" + position + "]").addClass("trouve");
                    $("#" + this.zoneJeu + " .carte[data-position=" + this.lastPositionClick + "]").addClass("trouve");
                    // Pour vérifier si toutes les cartes ont été retournées 
                    this.verifSiGagne();
                } else {
                    this.pretCarteSuivante = false;
                    let anciennePositionAMasquer = this.lastPositionClick;

                    // attendre 1 seconde avant de masquer les cartes
                    setTimeout(() => {
                        $("#" + this.zoneJeu + " .carte[data-position=" + position + "]").removeClass("afficheSymbole");
                        $("#" + this.zoneJeu + " .carte[data-position=" + anciennePositionAMasquer + "]").removeClass("afficheSymbole");
                        this.pretCarteSuivante = true;
                    }, 1000);
                }

                this.lastPositionClick = -1;
            }
        }
    }

    // desine les éléments HTML dans la zone de jeu
    dessineZoneJeu() {
        // vide la zone de jeu
        $("#" + this.zoneJeu).html('');

        // création de toutes les div pour symboliser les cartes
        for (let nCaseJeu = 0; nCaseJeu < this.nbSymboles * 2; nCaseJeu++) {
            $("#" + this.zoneJeu).append("<div class='carte' data-position='" + nCaseJeu + "' style='background-position-y:" + this.positionCarte[nCaseJeu] * 100 + "px'></div>");
        }
    }

    // fonction de tirage alétoire avec des bornes mini et maxi
    getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    }

    // fonction pour controller si toutes les cartes ont été retournées
    verifSiGagne() {
        var perdu = false;

        // verifie si l'une des positions ne contient pas la class "trouve"
        $("#" + this.zoneJeu + " .carte").each(function () {
            if (!$(this).hasClass("trouve")) {
                perdu = true;
            }
        });

        // le joueur a gagné, il faut terminer le jeu
        if (!perdu) {
            this.finDuJeu(true);
        }

        return perdu;
    }

    // fin du jeu et affichage suivant si le joueur a gagné ou perdu
    finDuJeu(gagne) {
        if (!this.jeuTermine) {
            this.jeuTermine = true;
            gagne ? this.afficheGagne() : this.affichePerdu();
        }
    }

    // methode pour assurer le timer et l'avancement de la barre de progression
    suiviTemps() {
        if (this.jeuTermine == false) {
            let heureActuelle = new Date();
            let dureeExecution = (heureActuelle - this.dateLancement) / 1000;

            // si le temps n'a pas expiré
            if (dureeExecution < this.dureeJeu) {
                // actualise la progress bar
                let pcAvancement = (dureeExecution / this.dureeJeu) * 100;
                $("#" + this.idProgressBarTimer).css("width", pcAvancement + "%");

                // affichage du temps restant sous forme numérique
                let txtSeconde = " seconde" + (parseInt(this.dureeJeu - dureeExecution) > 1 ? "s" : "");
                $("#tempsRestant").html(parseInt(this.dureeJeu - dureeExecution) + txtSeconde);

                // timer de 200ms pour recalculer la barre de progression
                let selfClass = this;
                setTimeout(() => selfClass.suiviTemps(), 200);
            } else {
                // fin du temps, le jeu est terminé
                $("#" + this.idProgressBarTimer).css("width", "100%");
                $("#tempsRestant").html("0 seconde");
                this.finDuJeu(!this.verifSiGagne());
            }
        }
    }
}

$(document).ready(function () {
    let jeu;

    // masque les éléments quand le jeu n'est pas lancé
    let masquerJeu = function () {
        $("#zoneJeu").hide();
        $("#zoneProgressBar").hide();
        $("#explication").show();
        $("#btnLancmentJeu").show();
        $("#gagne").hide();
        $("#perdu").hide();
        $("#statistiques").hide();
    };
    masquerJeu();

    // affiche le jeu et masque les explications
    let afficherJeu = function () {
        $("#zoneJeu").show();
        $("#zoneProgressBar").show();
        $("#explication").hide();
        $("#btnLancmentJeu").hide();
        $("#gagne").hide();
        $("#perdu").hide();
        $("#statistiques").hide();
    };

    let afficheGagne = function () {
        masquerJeu();
        $("#gagne").show();
    };

    let affichePerdu = function () {
        masquerJeu();
        $("#perdu").show();
    };

    $(".btnLancerJeu").click(function () {
        let niveau = $(this).data("niveau");

        // initialise le jeu
        jeu = new memory(niveau, 60, "zoneJeu", "progressBarTimer", afficherJeu, afficheGagne, affichePerdu);

        // supprime l'évenement sur le click des cartes (pour les lancements de jeu multiple)
        $("#zoneJeu .carte").unbind("click");

        // clique sur une carte
        $("#zoneJeu .carte").click(function () {
            if (!$(this).hasClass("afficheSymbole")) {
                let position = $(this).data("position");
                jeu.clickCarte(position);
            }
        });
    });
});