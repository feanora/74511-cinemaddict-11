import AbstractComponent from "./abstract-component.js";

const createFooterStatisticsTemplate = (allFilmCount) => {
  return (
    `<section class="footer__statistics">
        <p>${allFilmCount} movies inside</p>
    </section>`
  );
};

export default class FooterStatistics extends AbstractComponent {
  constructor(allFilmCount) {
    super();
    this._allFilmCount = allFilmCount;
  }

  getTemplate() {
    return createFooterStatisticsTemplate(this._allFilmCount);
  }
}

