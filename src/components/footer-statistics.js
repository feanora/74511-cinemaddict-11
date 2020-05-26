import AbstractComponent from "./abstract-component.js";

const createFooterStatisticsTemplate = (allFilmCount) => {
  return (
    `<section class="footer__statistics">
        <p>${allFilmCount} movies inside</p>
    </section>`
  );
};

export default class FooterStatistics extends AbstractComponent {
  constructor(filmsModel) {
    super();
    this._filmsModel = filmsModel;
  }

  getTemplate() {
    return createFooterStatisticsTemplate(this._filmsModel.getFilmsAll().length);
  }
}

