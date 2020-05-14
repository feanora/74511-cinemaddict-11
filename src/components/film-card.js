import AbstractComponent from "./abstract-component.js";
import {MAX_SHORT_DESCRIPTION_LENGTH} from "../const";

const getShortDescriptionFilm = (description) => {
  return description.length > MAX_SHORT_DESCRIPTION_LENGTH ? description.slice(0, MAX_SHORT_DESCRIPTION_LENGTH - 1) + `...` : description;
};

const FilmCardButtonName = {
  "add-to-watchlist": `Add to watchlist`,
  "mark-as-watched": `Mark as watched`,
  "favorite": `Mark as favorite`
};

const createButtonMarkup = (name, isActive = true) => {
  return (
    `<button class="film-card__controls-item button film-card__controls-item--${name} ${isActive ? `` : `film-card__controls-item--active`}">${FilmCardButtonName[name]}</button>`
  );
};

const createFilmCardTemplate = (film) => {
  const {title, totalRating, poster, releaseDate, runtime, genres, description, commentsCount} = film;
  const genre = genres[0];
  const releaseYear = releaseDate.slice(-4);
  const descriptionFilm = getShortDescriptionFilm(description);
  const addWatchListButton = createButtonMarkup(`add-to-watchlist`, !film.watchlist);
  const watchedButton = createButtonMarkup(`mark-as-watched`, !film.alreadyWatched);
  const favoriteButton = createButtonMarkup(`favorite`, !film.favorite);
  return (
    `<article class="film-card">
          <h3 class="film-card__title">${title}</h3>
          <p class="film-card__rating">${totalRating}</p>
          <p class="film-card__info">
            <span class="film-card__year">${releaseYear}</span>
            <span class="film-card__duration">${runtime}</span>
            <span class="film-card__genre">${genre}</span>
          </p>
          <img src="${poster}" alt="" class="film-card__poster">
          <p class="film-card__description">${descriptionFilm}</p>
          <a class="film-card__comments">${commentsCount} comments</a>
          <form class="film-card__controls">
           ${addWatchListButton}
           ${watchedButton}
           ${favoriteButton}
          </form>
        </article>`
  );
};

export default class FilmCard extends AbstractComponent {
  constructor(film) {
    super();
    this._film = film;
  }

  getTemplate() {
    return createFilmCardTemplate(this._film);
  }

  setFilmCardElementsClickHandler(handler) {
    this.getElement().addEventListener(`click`, handler);
  }

  setAddWatchListButtonClickHandler(handler) {
    this.getElement().querySelector(`.film-card__controls-item--add-to-watchlist`).addEventListener(`click`, handler);
  }

  setWatchedButtonClickHandler(handler) {
    this.getElement().querySelector(`.film-card__controls-item--mark-as-watched`).addEventListener(`click`, handler);
  }

  setFavoriteButtonClickHandler(handler) {
    this.getElement().querySelector(`.film-card__controls-item--favorite`).addEventListener(`click`, handler);
  }
}
