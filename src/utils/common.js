import {MONTH_NAMES, WatchedFilmsCount, SortType, UserRating} from "../const.js";

export const getRandomNumber = (max, min = 0) => {
  return Math.round(Math.random() * (max - min) + min);
};

export const getRandomFloatNumber = (digit, max, min = 0) => {
  return Number((Math.random() * (max - min) + min).toFixed(digit));
};

export const getRandomArrayItem = (array) => {
  const randomIndex = getRandomNumber(array.length - 1, 0);
  return array[randomIndex];
};

export const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

export const getNewLengthArray = (array, maxArrayLength, minArrayLength = 1) => {
  let newArray = [];
  let newArrayLength = getRandomNumber(maxArrayLength, minArrayLength);
  for (let i = 0; i < newArrayLength; i++) {
    newArray[i] = array[i];
  }
  return newArray;
};

export const getNewLengthShuffleArray = (array, maxArrayLength, minArrayLength = 1) => {
  return getNewLengthArray(shuffleArray(array), maxArrayLength, minArrayLength);
};

export const getBooleanValue = () => Math.random() > 0.5;

export const formatDate = (date) => {
  const dateMs = Date.parse(date);
  const convertedDate = new Date(dateMs);
  const year = convertedDate.getFullYear();
  const month = MONTH_NAMES[convertedDate.getMonth()];
  const day = convertedDate.getDate();
  return `${day} ${month} ${year}`;
};

const castTimeFormat = (value) => {
  return value < 10 ? `0${value}` : String(value);
};

export const formatCommentDate = (date) => {
  const dateMs = Date.parse(date);
  const convertedDate = new Date(dateMs);
  const period = Math.floor((new Date() - dateMs) / 1000);
  const periodInMinutes = Math.floor(period / 60);
  const periodInHours = Math.floor(period / 3600);
  const year = convertedDate.getFullYear();
  const month = castTimeFormat(convertedDate.getMonth() + 1);
  const day = convertedDate.getDate();
  const hours = castTimeFormat(convertedDate.getHours() % 12);
  const minutes = castTimeFormat(convertedDate.getMinutes());
  const secInMin = 60;
  const secInHour = 3600;
  const secInDay = 86400;

  switch (true) {
    case (period < secInMin):
      return `now`;
    case (period < secInHour):
      return `${periodInMinutes} minutes ago`;
    case (period > secInHour && period <= secInHour * 12):
      return `${periodInHours} hours ago`;
    case (period > secInHour * 12 && period < secInDay):
      return `Today`;
    case (period >= secInDay && period < secInDay * 2):
      return `Yesterday`;
    case (period >= secInDay * 2 && period < secInDay * 3):
      return `2 days ago`;
    default:
      return `${year}/${month}/${day} ${hours}:${minutes}`;
  }
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
      sortedFilms = showingFilms.sort((a, b) => b.releaseDate.slice(-4) - a.releaseDate.slice(-4));
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

