import {getRandomArrayItem, getRandomFloatNumber, getBooleanValue, getRandomNumber, getNewLengthShuffleArray} from "../utils/common.js";

const FILM_TITLES = [
  `The Dance of Life`,
  `Sagebrush Trail`,
  `The Man with the Golden Arm`,
  `Santa Claus Conquers the Martians`,
  `Popeye the Sailor Meets Sindbad the Sailor`,
  `The Great Flamarion`,
  `Made for Each Other`
];

const ALTERNATIVE_TITLES = [
  `Burlesque`,
  `An Innocent Man`,
  `Laziness In Us`,
  `A Shark Who Sold The Floor`,
  `Popeye Color Feature`,
  `The Great Flamarion`,
  `Made for Each Other`
];
const POSTERS_PATH = `./images/posters/`;

const POSTER_IMAGES = [
  `the-dance-of-life.jpg`,
  `sagebrush-trail.jpg`,
  `the-man-with-the-golden-arm.jpg`,
  `santa-claus-conquers-the-martians.jpg`,
  `popeye-meets-sinbad.png`,
  `the-great-flamarion.jpg`,
  `made-for-each-other.png`
];

const AGE_RATINGS = [
  `0+`,
  `6+`,
  `12+`,
  `16+`,
  `18+`
];

const DIRECTORS = [
  `John Cromwell`,
  `Armand Schaefer`,
  `Otto Preminger`,
  `Nicholas Webster`,
  `Dave Fleischer`,
  `Anthony Mann`,
  `John Cromwell`
];

const WRITERS = [
  `Benjamin Glazer`,
  `Julian Johnson`,
  `Lindsley Parsons`,
  `Will Beale`,
  `Nelson Algren`,
  `Glenville Mareth`,
  `Vicki Baum`,
  `Rose Franken`,
  `Jo Swerling`,
  `Frank Ryan`
];

const ACTORS = [
  `Hal Skelly`,
  `Nancy Carroll`,
  `John Wayne`,
  `Nancy Shubert`,
  `Lane Chandler`,
  `Frank Sinatra`,
  `Eleanor Parker`,
  `Kim Novak`,
  `John Call`,
  `Leonard Hicks`,
  `Jack Mercer`,
  `Erich von Stroheim`,
  `Mary Beth Hughes`,
  `Dan Duryea`,
  `Carole Lombard`
];

const MOCK_DATES = [
  `1960-04-08T08:28:00.929Z`,
  `2017-12-05T14:44:55.559Z`,
  `2020-02-28T08:28:00.929Z`,
  `2019-12-24T08:28:00.930Z`,
  `2003-11-19T02:09:13.015Z`,
];

const MOCK_WATCHING_DATES = [
  `2020-05-15T01:16:00`,
  `2020-04-15T23:55:00.930Z`,
  `2019-05-12T00:43:00.930Z`,
  `2020-03-15T08:28:00.930Z`
];

const RELEASE_COUNTRIES = [
  `USA`,
  `Italy`,
  `France`,
  `Spain`,
  `China`,
  `Finland`,
  `Russia`
];

const GENRES = [
  `Action`,
  `Adventure`,
  `Animation`,
  `Comedy`,
  `Detective`,
  `Drama`,
  `Fantasy`,
  `Horror`,
  `Musical`,
  `Sci-Fi`,
  `Thriller`
];

const DESCRIPTION_TEXT = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`;
const ROUND_DIGIT_COUNT = 1;
const FilmRatingValue = {
  MIN: 1,
  MAX: 10
};

const WritersCount = {
  MIN: 2,
  MAX: 3
};

const ActorsCount = {
  MIN: 2,
  MAX: 6
};

const SentencesCount = {
  MIN: 1,
  MAX: 5
};

const MAX_GENRES_COUNT = 3;

const generatePosterTitle = (path, images) => {
  return path + getRandomArrayItem(images);
};

const generateFilmDescription = () => {
  const descriptionItems = DESCRIPTION_TEXT.slice(0, DESCRIPTION_TEXT.length - 1).split(`. `);
  const descriptionNewText = getNewLengthShuffleArray(descriptionItems, SentencesCount.MAX, SentencesCount.MIN).join(`. `);
  return descriptionNewText + `.`;
};

const generateRuntime = () => {
  return getRandomNumber(240, 9);
};

const generateId = () => {
  return String(new Date() + Math.random());
};

const generateCommentsId = () => {
  return new Array(getRandomNumber(5)).fill(``).map(() => getRandomNumber(100, 1));
};

export const generateFilmCard = () => {
  return {
    id: generateId(),
    title: getRandomArrayItem(FILM_TITLES),
    alternativeTitle: getRandomArrayItem(ALTERNATIVE_TITLES),
    totalRating: getRandomFloatNumber(ROUND_DIGIT_COUNT, FilmRatingValue.MAX, FilmRatingValue.MIN),
    poster: generatePosterTitle(POSTERS_PATH, POSTER_IMAGES),
    ageRating: getRandomArrayItem(AGE_RATINGS),
    director: getRandomArrayItem(DIRECTORS),
    writers: getNewLengthShuffleArray(WRITERS, WritersCount.MAX, WritersCount.MIN).join(`, `),
    actors: getNewLengthShuffleArray(ACTORS, ActorsCount.MAX, ActorsCount.MIN).join(`, `),
    releaseDate: getRandomArrayItem(MOCK_DATES),
    releaseCountry: getRandomArrayItem(RELEASE_COUNTRIES),
    runtime: generateRuntime(),
    genres: getNewLengthShuffleArray(GENRES, MAX_GENRES_COUNT),
    description: generateFilmDescription(),
    watchlist: getBooleanValue(),
    alreadyWatched: getBooleanValue(),
    watchingDate: getRandomArrayItem(MOCK_WATCHING_DATES),
    favorite: getBooleanValue(),
    comments: generateCommentsId()
  };
};

export const generateFilmCards = (count) => {
  return new Array(count).fill(``).map(generateFilmCard);
};
