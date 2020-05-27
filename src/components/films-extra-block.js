import AbstractComponent from "./abstract-component.js";

const createFilmsExtraBlockTemplate = (filmsExtraBlockTitle) => {
  return (
    `<section class="films-list--extra">
      <h2 class="films-list__title">${filmsExtraBlockTitle}</h2>

      <div class="films-list__container">
      </div>
    </section>`
  );
};

export default class FilmsExtraBlock extends AbstractComponent {
  constructor(blockTitle) {
    super();

    this._blockTitle = blockTitle;
  }

  getTemplate() {
    return createFilmsExtraBlockTemplate(this._blockTitle);
  }
}

