import AbstractComponent from "./abstract-component.js";
import {SortType} from "../const.js";

const createSortTemplate = () => {
  return (
    `<ul class="sort">
    <li><a href="#" data-sort-type="${SortType.DEFAULT}" class="sort__button sort__button--active">Sort by default</a></li>
    <li><a href="#" data-sort-type="${SortType.DATE}" class="sort__button">Sort by date</a></li>
    <li><a href="#" data-sort-type="${SortType.RATING}" class="sort__button">Sort by rating</a></li>
  </ul>`
  );
};

export default class Sort extends AbstractComponent {
  constructor() {
    super();
    this._currentSortType = SortType.DEFAULT;
  }

  getTemplate() {
    return createSortTemplate();
  }

  getSortType() {
    return this._currentSortType;
  }

  resetSortType() {
    this._currentSortType = SortType.DEFAULT;
    const activeSort = this.getElement().querySelector(`.sort__button--active`);
    activeSort.classList.remove(`sort__button--active`);
    const defaultSortTypeElement = this.getElement().querySelector(`[data-sort-type=${SortType.DEFAULT}]`);
    defaultSortTypeElement.classList.add(`sort__button--active`);
  }

  setSortTypeChangeHandler(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      evt.preventDefault();

      if (evt.target.tagName !== `A`) {
        return;
      }
      const sortType = evt.target.dataset.sortType;

      if (this._currentSortType === sortType) {
        return;
      }

      const activeSort = this.getElement().querySelector(`.sort__button--active`);
      activeSort.classList.remove(`sort__button--active`);
      evt.target.classList.add(`sort__button--active`);

      this._currentSortType = sortType;
      handler(this._currentSortType);
    });
  }
}
