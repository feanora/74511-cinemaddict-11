import AbstractSmartComponent from "./abstract-smart-component.js";
import {formatDate, getFilmDuration} from "../utils/common.js";
import {TimeFormat} from "../const.js";

const createGenresMarkup = (genres) => {
  return genres.map((genre) => {
    return (
      `<span class="film-details__genre">${genre}</span>`
    );
  }).join(`\n`);
};

const FilmPopupButtonName = {
  watchlist: `Add to watchlist`,
  watched: `Already watched`,
  favorite: `Add to favorites`
};

const createButtonMarkup = (name, isChecked) => {
  return (
    `<input type="checkbox" class="film-details__control-input visually-hidden" id="${name}" name="${name}" ${isChecked ? `checked` : ``}>
     <label for="${name}" class="film-details__control-label film-details__control-label--${name}">${FilmPopupButtonName[name]}</label>`
  );
};

const getGenreTitle = (genres) => genres.length > 1 ? `Genres` : `Genre`;

const createFilmPopupTemplate = (film) => {
  const {title, alternativeTitle, totalRating, poster, ageRating, director, writers, actors, releaseCountry, genres, description} = film;
  const genresMarkup = createGenresMarkup(genres);
  const genresTitle = getGenreTitle(genres);
  const addWatchListButton = createButtonMarkup(`watchlist`, film.watchlist);
  const watchedButton = createButtonMarkup(`watched`, film.alreadyWatched);
  const favoriteButton = createButtonMarkup(`favorite`, film.favorite);
  const popupReleaseDate = formatDate(film.releaseDate, TimeFormat.RELEASE_DATE);
  const filmRuntime = getFilmDuration(film.runtime);
  return (
    `<section class="film-details">
  <form class="film-details__inner" action="" method="get">
    <div class="form-details__top-container">
      <div class="film-details__close">
        <button class="film-details__close-btn" type="button">close</button>
      </div>
      <div class="film-details__info-wrap">
        <div class="film-details__poster">
          <img class="film-details__poster-img" src="${poster}" alt="">

          <p class="film-details__age">${ageRating}</p>
        </div>

        <div class="film-details__info">
          <div class="film-details__info-head">
            <div class="film-details__title-wrap">
              <h3 class="film-details__title">${title}</h3>
              <p class="film-details__title-original">Original: ${alternativeTitle}</p>
            </div>

            <div class="film-details__rating">
              <p class="film-details__total-rating">${totalRating}</p>
            </div>
          </div>

          <table class="film-details__table">
            <tr class="film-details__row">
              <td class="film-details__term">Director</td>
              <td class="film-details__cell">${director}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Writers</td>
              <td class="film-details__cell">${writers}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Actors</td>
              <td class="film-details__cell">${actors}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Release Date</td>
              <td class="film-details__cell">${popupReleaseDate}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Runtime</td>
              <td class="film-details__cell">${filmRuntime}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Country</td>
              <td class="film-details__cell">${releaseCountry}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">${genresTitle}</td>
              <td class="film-details__cell">
               ${genresMarkup}
            </tr>
          </table>

          <p class="film-details__film-description">
            ${description}
          </p>
        </div>
      </div>

      <section class="film-details__controls">
           ${addWatchListButton}
           ${watchedButton}
           ${favoriteButton}
      </section>
    </div>


  </form>
</section>`
  );
};

export default class FilmPopup extends AbstractSmartComponent {
  constructor(film) {
    super();
    this._film = film;
    this._closeClickHandler = null;
    this._addWatchListChangeHandler = null;
    this._WatchedChangeHandler = null;
    this._favoriteChangeHandler = null;
  }

  getTemplate() {
    return createFilmPopupTemplate(this._film, this._emotion);
  }

  recoveryListeners() {
    this.setPopupCloseElementClickHandler(this._closeClickHandler);
    this.setAddWatchListButtonChangeHandler(this._addWatchListChangeHandler);
    this.setWatchedButtonChangeHandler(this._WatchedChangeHandler);
    this.setFavoriteButtonChangeHandler(this._favoriteChangeHandler);
  }

  rerender() {
    super.rerender();
  }

  setPopupCloseElementClickHandler(handler) {
    this.getElement().querySelector(`.film-details__close-btn`).addEventListener(`click`, handler);
    this._closeClickHandler = handler;
  }

  setAddWatchListButtonChangeHandler(handler) {
    this.getElement().querySelector(`#watchlist`).addEventListener(`change`, handler);
    this._addWatchListChangeHandler = handler;
  }

  setWatchedButtonChangeHandler(handler) {
    this.getElement().querySelector(`#watched`).addEventListener(`change`, handler);
    this._WatchedChangeHandler = handler;
  }

  setFavoriteButtonChangeHandler(handler) {
    this.getElement().querySelector(`#favorite`).addEventListener(`change`, handler);
    this._favoriteChangeHandler = handler;
  }
}
