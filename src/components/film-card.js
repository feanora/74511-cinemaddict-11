import {getMarkupClass} from "../util.js";

const getDescriptionFilm = (description) => {
  return description.length >= 140 ? description.slice(0, 139) + `...` : description;
};
export const createFilmCardTemplate = (film) => {
  const {title, totalRating, poster, releaseDate, runtime, genres, description, watchlist, alreadyWatched, favorite, commentsCount} = film;
  const genre = genres[0];
  const releaseYear = releaseDate.slice(-4);
  const descriptionFilm = getDescriptionFilm(description);
  const isAddWatchList = getMarkupClass(watchlist, `--active`);
  const isWatched = getMarkupClass(alreadyWatched, `--active`);
  const isFavorite = getMarkupClass(favorite, `--active`);
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
            <button class="film-card__controls-item${isAddWatchList} button film-card__controls-item--add-to-watchlist">Add to watchlist</button>
            <button class="film-card__controls-item${isWatched} button film-card__controls-item--mark-as-watched">Mark as watched</button>
            <button class="film-card__controls-item${isFavorite} button film-card__controls-item--favorite">Mark as favorite</button>
          </form>
        </article>`
  );
};
