import {getFilmsByFilter} from "../utils/filter.js";
import {FilterType} from "../const.js";

export default class Films {
  constructor() {
    this._films = [];
    this._activeFilterType = FilterType.ALL_MOVIES;

    this._dataChangeHandlers = [];
    this._filterChangeHandlers = [];
  }

  getFilmsAll() {
    return this._films;
  }

  getFilms() {
    return getFilmsByFilter(this._films, this._activeFilterType);
  }

  getTopRatedFilms() {
    const films = this.getFilmsAll();
    return films.slice().sort((a, b) => b.totalRating - a.totalRating);
  }

  getMostCommentedFilms() {
    const films = this.getFilmsAll();
    return films.slice().sort((a, b) => b.comments.length - a.comments.length);
  }

  setFilms(films) {
    this._films = Array.from(films);
    this._callHandlers(this._dataChangeHandlers);
  }

  setFilter(filterType) {
    this._activeFilterType = filterType;
    this._callHandlers(this._filterChangeHandlers);
  }

  updateFilm(id, film) {
    const index = this._films.findIndex((it) => it.id === id);

    if (index === -1) {
      return false;
    }

    this._films = [].concat(this._films.slice(0, index), film, this._films.slice(index + 1));
    this._callHandlers(this._dataChangeHandlers);

    return true;
  }

  setFilterChangeHandler(handler) {
    this._filterChangeHandlers.push(handler);
  }

  setDataChangeHandler(handler) {
    this._dataChangeHandlers.push(handler);
  }

  _callHandlers(handlers) {
    handlers.forEach((handler) => handler());
  }
}
