import {FILTER_NAMES} from "../const.js";
import {getRandomNumber} from "../util.js";
import {FilmCardsCount} from "../const.js";

const MAX_FILTER_FILM_COUNT = FilmCardsCount.ALL;

const generateFilters = () => {
  return FILTER_NAMES.map((it) => {
    return {
      name: it,
      count: getRandomNumber(MAX_FILTER_FILM_COUNT)
    };
  });
};

export {generateFilters};
