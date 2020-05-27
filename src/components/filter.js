import AbstractComponent from "./abstract-component.js";
import {ACTIVE_FILTER_INDEX, FILTER_HREF_PREFIX, MenuItem} from "../const.js";

const createFilterMarkup = (filter, isAllFilms) => {
  const {type, name, count, isActive} = filter;
  return (
    `<a href="#${type}" data-menu="${MenuItem.FILMS}" class="main-navigation__item${isActive ? ` main-navigation__item--active` : ``}">${name} ${isAllFilms ? `` : `<span class="main-navigation__item-count">${count}</span>`}</a>`
  );
};

const createFilterTemplate = (filters) => {
  const filterMarkup = filters.map((it, i) => createFilterMarkup(it, i === ACTIVE_FILTER_INDEX)).join(`\n`);
  return (
    `<div class="main-navigation__items">
      ${filterMarkup}
      </div>`
  );
};

export default class Filter extends AbstractComponent {
  constructor(filter) {
    super();
    this._filter = filter;
  }

  getTemplate() {
    return createFilterTemplate(this._filter);
  }

  setFilterChangeHandler(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      if (evt.target.tagName === `A` || evt.target.parentElement.tagName === `A`) {
        evt.preventDefault();
        const activeFilter = evt.target.tagName === `A` ? evt.target.getAttribute(`href`).substring(FILTER_HREF_PREFIX.length) : evt.target.parentElement.getAttribute(`href`).substring(FILTER_HREF_PREFIX.length);
        handler(activeFilter);
      }
    });
  }
}

