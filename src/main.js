import {createUserRatingTemplate} from "./components/user-rating.js";
import {createMainMenuTemplate} from "./components/main-menu.js";
import {createSortingTemplate} from "./components/sorting.js";
import {createFilmsTemplate} from "./components/films-block.js";
import {createFilmCardTemplate} from "./components/film-card.js";
import {createShowMoreButtonTemplate} from "./components/show-more-button.js";
import {createExtraFilmsTemplate} from "./components/films-extra.js";
import {createFooterStatisticsTemplate} from "./components/footer-statistic.js";
import {createFilmDetailsTemplate} from "./components/film-details.js";
import {FilmCardsCount} from "./const.js";
import {generateFilmCards} from "./mock/film.js";

const render = (container, template, place = `beforeend`) => {
  container.insertAdjacentHTML(place, template);
};

const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector((`.main`));

render(siteHeaderElement, createUserRatingTemplate());
render(siteMainElement, createMainMenuTemplate());
render(siteMainElement, createSortingTemplate());
render(siteMainElement, createFilmsTemplate());

const filmsElement = siteMainElement.querySelector(`.films`);
const filmsListElement = filmsElement.querySelector(`.films-list`);
const filmsListContainerElement = filmsElement.querySelector(`.films-list__container`);
const films = generateFilmCards(FilmCardsCount.ALL);

const renderFilmsList = (filmsCount, container) => {
  films.slice(1, filmsCount).forEach((film) => {
    render(container, createFilmCardTemplate(film));
  });
};

renderFilmsList(FilmCardsCount.ALL, filmsListContainerElement);
render(filmsListElement, createShowMoreButtonTemplate());
render(filmsElement, createExtraFilmsTemplate());

const extraFilmsElements = filmsElement.querySelectorAll(`.films-list--extra`);
const topRatedFilmsListElement = extraFilmsElements[0].querySelector(`.films-list__container`);
const mostCommentedFilmsListElement = extraFilmsElements[1].querySelector(`.films-list__container`);

renderFilmsList(FilmCardsCount.TOP_RATED, topRatedFilmsListElement);
renderFilmsList(FilmCardsCount.MOST_COMMENTED, mostCommentedFilmsListElement);

const siteFooterElement = document.querySelector(`.footer`);
render(siteFooterElement, createFooterStatisticsTemplate());
render(siteFooterElement, createFilmDetailsTemplate(films[0]), `afterend`);

const filmDetailsElement = document.querySelector(`.film-details`);
const filmDetailsCloseElement = filmDetailsElement.querySelector(`.film-details__close-btn`);

filmDetailsCloseElement.addEventListener(`click`, () => {
  filmDetailsElement.remove();
});

