import {createElement} from "../util.js";

const createFilmsExtraBlockTemplate = (filmsExtraBlockTitle) => {
  return (
    `<section class="films-list--extra">
      <h2 class="films-list__title">${filmsExtraBlockTitle}</h2>

      <div class="films-list__container">
      </div>
    </section>`
  );
};

export default class FilmsExtraBlock {
  constructor(blockTitle) {
    this._blockTitle = blockTitle;
    this._element = null;
  }

  getTemplate() {
    return createFilmsExtraBlockTemplate(this._blockTitle);
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

