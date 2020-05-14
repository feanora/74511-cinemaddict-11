import AbstractComponent from "./abstract-component.js";

const ACTIVE_FILTER_INDEX = 0;

const createFilterMarkup = (filter, isActive) => {
  const {name, count} = filter;
  return (
    `<a href="#${isActive ? `all` : name.toLowerCase()}" class="main-navigation__item ${isActive ? `main-navigation__item--active` : ``}">${name } ${isActive ? `` : `<span class="main-navigation__item-count">${count}</span>`}</a>`
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
}


