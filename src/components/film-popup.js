import AbstractSmartComponent from "./abstract-smart-component.js";
import {getCheckedValue} from "../utils/common.js";
import {EMOJIS} from "../const.js";


const createGenresMarkup = (genres) => {
  return genres.map((genre) => {
    return (
      `<span class="film-details__genre">${genre}</span>`
    );
  }).join(`\n`);
};

const createAddEmojiMarkup = (emotion) => {
  return emotion ? `<img src="images/emoji/${emotion}.png" width="55" height="55" alt="emoji-${emotion}">` : ``;
};

const createEmojiListMarkup = () => {
  return EMOJIS.map((emotion) => {
    return (
      `<input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-${emotion}" value="${emotion}">
        <label class="film-details__emoji-label" for="emoji-${emotion}">
          <img src="./images/emoji/${emotion}.png" width="30" height="30" alt="emoji">
        </label>`
    );
  }).join(`\n`);
};

const getGenreTitle = (genres) => genres.length > 1 ? `Genres` : `Genre`;
const getCommentsTitle = (commentsCount) => commentsCount > 1 ? `Comments` : `Comment`;

const createFilmPopupTemplate = (film, emotion) => {
  const {title, alternativeTitle, totalRating, poster, ageRating, director, writers, actors, releaseDate, releaseCountry, runtime, genres, description, watchlist, alreadyWatched, favorite, commentsCount} = film;
  const genresMarkup = createGenresMarkup(genres);
  const genresTitle = getGenreTitle(genres);
  const commentsTitle = getCommentsTitle(commentsCount);
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
              <td class="film-details__cell">${releaseDate}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Runtime</td>
              <td class="film-details__cell">${runtime}</td>
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
        <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist" ${getCheckedValue(watchlist)}>
        <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>

        <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched" ${getCheckedValue(alreadyWatched)}>
        <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>

        <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite" ${getCheckedValue(favorite)}>
        <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
      </section>
    </div>

    <div class="form-details__bottom-container">
      <section class="film-details__comments-wrap">
        <h3 class="film-details__comments-title">${commentsTitle} <span class="film-details__comments-count">${commentsCount}</span></h3>

        <ul class="film-details__comments-list">
        </ul>

        <div class="film-details__new-comment">
          <div for="add-emoji" class="film-details__add-emoji-label">
            ${createAddEmojiMarkup(emotion)}
           </div>

          <label class="film-details__comment-label">
            <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
          </label>

          <div class="film-details__emoji-list">
            ${createEmojiListMarkup()}
          </div>
        </div>
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
    this._emotion = ``;
    this._subscribeOnEvents();
  }

  getTemplate() {
    return createFilmPopupTemplate(this._film, this._emotion);
  }

  recoveryListeners() {
    this.setPopupCloseElementClickHandler(this._closeClickHandler);
    this.setAddWatchListButtonChangeHandler(this._addWatchListChangeHandler);
    this.setWatchedButtonChangeHandler(this._WatchedChangeHandler);
    this.setFavoriteButtonChangeHandler(this._favoriteChangeHandler);
    this._subscribeOnEvents();
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

  _subscribeOnEvents() {
    const element = this.getElement();
    element.querySelector(`.film-details__emoji-list`).addEventListener(`change`, (evt) => {
      this._emotion = evt.target.value;
      this.rerender();
    });
  }

  reset() {
    this._emotion = ``;
    this.rerender();
  }
}
