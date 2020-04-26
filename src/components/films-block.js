import AbstractComponent from "./abstract-component.js";
import {FilmCardsCount} from "../const";

const createNoFilmsMarkup = () => {
  return (
    FilmCardsCount.ALL ?
      `<h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
      <div class="films-list__container">
      </div>`
      : `<h2 class="films-list__title">There are no movies in our database</h2>`
  );
};

const createFilmsBlockTemplate = () => {
  return (
    `<section class="films">
        <section class="films-list">
        ${createNoFilmsMarkup()}
        </section>
    </section>`
  );
};

export default class FilmsBlock extends AbstractComponent {
  getTemplate() {
    return createFilmsBlockTemplate();
  }
}
