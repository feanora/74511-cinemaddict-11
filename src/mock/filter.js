import {FilterType, FilmCardsCount} from "../const.js";
import {getRandomNumber} from "../utils/common.js";

const MAX_FILTER_FILM_COUNT = FilmCardsCount.ALL;

const generateFilters = () => {
  return Object.values(FilterType).map((filterType) => {
    return {
      name: filterType,
      count: getRandomNumber(MAX_FILTER_FILM_COUNT)
    };
  });
};

export {generateFilters};
