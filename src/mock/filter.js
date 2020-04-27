import {FILTER_NAMES, FilmCardsCount} from "../const.js";
import {getRandomNumber} from "../utils/common.js";

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
