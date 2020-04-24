import {FilmCardsCount} from "../const";
import {createElement} from "../util.js";

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
export default class FilmsBlock {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createFilmsBlockTemplate();
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }
    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
