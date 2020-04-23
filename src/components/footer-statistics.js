import {createElement} from "../util.js";

const createFooterStatisticsTemplate = (allFilmCount) => {
  return (
    `<section class="footer__statistics">
        <p>${allFilmCount} movies inside</p>
    </section>`
  );
};

export default class FooterStatistics {
  constructor(allFilmCount) {
    this._allFilmCount = allFilmCount;
    this._element = null;
  }

  getTemplate() {
    return createFooterStatisticsTemplate(this._allFilmCount);
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

