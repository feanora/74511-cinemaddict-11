import {getRandomArrayItem, getRandomFloatNumber} from "../util.js";
import {getBooleanValue, getNewLengthArray, getRandomNumber, shuffleArray} from "../util";

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
  `the-dance-of-life.png`,
  `sagebrush-trail.png`,
  `the-man-with-the-golden-arm.png`,
  `santa-claus-conquers-the-martians.png`,
  `popeye-meets-sinbad.png`,
  `the-great-flamarion.png`,
  `made-for-each-other.png`
];
const AGE_RATINGS = [
  `0`,
  `6`,
  `12`,
  `16`,
  `18`
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
const DESCRIPTION_ITEMS = [
  `Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
  `Cras aliquet varius magna, non porta ligula feugiat eget.`,
  `Fusce tristique felis at fermentum pharetra.`,
  `Aliquam id orci ut lectus varius viverra.`,
  `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.`,
  `Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.`,
  `Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.`,
  `Sed sed nisi sed augue convallis suscipit in sed felis.`,
  `Aliquam erat volutpat.`,
  `Nunc fermentum tortor ac porta dapibus.`,
  `In rutrum ac purus sit amet tempus.`
];

const MIN_FILM_RATING = 1;
const ROUND_DIGIT_NUMBER = 1;
const MAX_VALUE_RATING = 10;
const MAX_WRITERS_ARRAY = 3;
const MAX_ACTORS_ARRAY = 6;
const MAX_GENRES_ARRAY = 3;
const MAX_SENTENCES_COUNT = 5;
const MIN_SENTENCES_COUNT = 1;

const generatePosterTitle = (path, images) => {
  return path + getRandomArrayItem(images);
};

const generateFilmDescription = () => {
  const descriptionSentences = getNewLengthArray(shuffleArray(DESCRIPTION_ITEMS, MAX_SENTENCES_COUNT, MIN_SENTENCES_COUNT));
  const descriptionStr = descriptionSentences.reduce((accumulator, sentence) => {
    return accumulator + sentence;
  });
  return descriptionStr;
};

export const generateFilmCard = () => {
  return {
    title: getRandomArrayItem(FILM_TITLES),
    alternativeTitle: getRandomArrayItem(ALTERNATIVE_TITLES),
    totalRating: getRandomFloatNumber(ROUND_DIGIT_NUMBER, MAX_VALUE_RATING, MIN_FILM_RATING),
    poster: generatePosterTitle(POSTERS_PATH, POSTER_IMAGES),
    ageRating: getRandomArrayItem(AGE_RATINGS),
    director: getRandomArrayItem(DIRECTORS),
    writers: getNewLengthArray(shuffleArray(WRITERS, MAX_WRITERS_ARRAY)),
    actors: getNewLengthArray(shuffleArray(ACTORS, MAX_ACTORS_ARRAY)),
    releaseDate: getRandomArrayItem(MOCK_DATES),
    releaseCountry: getRandomArrayItem(RELEASE_COUNTRIES),
    runtime: getRandomNumber(240),
    genre: getNewLengthArray(shuffleArray(GENRES, MAX_GENRES_ARRAY)),
    description: generateFilmDescription(),
    watchlist: getBooleanValue(),
    alreadyWatched: getBooleanValue(),
    favorite: getBooleanValue(),
    commentsCount: getRandomNumber(5, 1)
  };
};

export const generateFilmCards = (count) => {
  return new Array(count).fill(``).map(generateFilmCard);
};
