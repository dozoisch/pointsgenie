import React, { Component } from "react";

class FAQPage extends Component {
  static displayName = "FAQPage";

  render() {
    return (
      <div className="faq">
        <h3>Foire aux questions</h3>

        <h4>À quoi servent les Points Génie?</h4>
        <blockquote>Les Points Génie permettront, en bonne partie, de payer les différents frais reliés au bal pour la promotion finissante (Photo des finissants, album, voyage de la finissante, Jonc, etc.)</blockquote>

        <h4>Combien vaut un Point Génie ?</h4>
        <blockquote>La valeur d’un Point Génie sera seulement connue au mois de novembre 2015, car la valeur du Point Génie est calculée en fonction du montant total accumulé par la promotion finissante.</blockquote>

        <h4>Comment les personnes travaillant pour un évènement sont-elles choisies ?</h4>
        <blockquote>Sur toutes les personnes ayant appliquées, ce sont les personnes ayant le moins de Points Génie qui seront priorisées. Le choix se fera aussi en fonction des tâches préférées.</blockquote>

        <h4>Sortie de l’horaire d’un évènement?</h4>
        <blockquote>Tous les horaires des évènements seront envoyés, 24 heures à l’avance, par courriel USherbrooke à toutes les personnes travaillant à l’évènement.</blockquote>

        <h4>À partir de quand est-il possible de postuler pour un évènement?</h4>
        <blockquote>Pour les 5@8, la phase de postulation débutera le lundi matin 8h00 jusqu’au mercredi 12h00 (midi) la semaine courante de l’évènement.
        Pour les autres évènements, la phase débutera 1 semaine avant l’évènement.</blockquote>
      </div>
    );
  }
};

export default FAQPage;
