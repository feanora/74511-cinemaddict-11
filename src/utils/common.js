import {SortType, TimeFormat, UserRating, WatchedFilmsCount} from "../const.js";
import moment from "moment";
import momentDurationFormatSetup from "moment-duration-format";

export const formatDate = (date, timeFormat) => {
  return moment(date).format(timeFormat);
};

export const getFilmDuration = (runtime) => {
  momentDurationFormatSetup(moment);
  return moment.duration(runtime, `minutes`).format(TimeFormat.RUNTIME);
};

export const getUserRating = (watchedFilmsCount) => {
  switch (true) {
    case (watchedFilmsCount >= WatchedFilmsCount.START && watchedFilmsCount <= WatchedFilmsCount.NOVICE_MAX):
      return UserRating.NOVICE;
    case (watchedFilmsCount > WatchedFilmsCount.NOVICE_MAX && watchedFilmsCount <= WatchedFilmsCount.FAN_MAX):
      return UserRating.FAN;
    case (watchedFilmsCount > WatchedFilmsCount.FAN_MAX):
      return UserRating.MOVIE_BUFF;
    default:
      return ``;
  }
};

export const getSortedFilms = (films, sortType, from, to) => {
  let sortedFilms = [];
  const showingFilms = films.slice();

  switch (sortType) {
    case SortType.DATE:
      sortedFilms = showingFilms.sort((a, b) => formatDate(b.releaseDate, TimeFormat.RELEASE_YEAR) - formatDate(a.releaseDate, TimeFormat.RELEASE_YEAR));
      break;
    case SortType.RATING:
      sortedFilms = showingFilms.sort((a, b) => b.totalRating - a.totalRating);
      break;
    case SortType.DEFAULT:
      sortedFilms = showingFilms;
      break;
  }

  return sortedFilms.slice(from, to);
};

export const shake = (element, timeout) => {
  element.style.animation = `shake ${timeout / 1000}s`;

  setTimeout(() => {
    element.style.animation = ``;
  }, timeout);
};

