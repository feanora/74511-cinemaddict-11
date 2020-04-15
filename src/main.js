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

const renderElementsList = (count, container, template, place = `beforeend`) => {
  for (let i = 0; i < count; i++) {
    render(container, template, place);
  }
};

renderElementsList(FilmCardsCount.ALL, filmsListContainerElement, createFilmCardTemplate());

render(filmsListElement, createShowMoreButtonTemplate());
render(filmsElement, createExtraFilmsTemplate());

const extraFilmsElements = filmsElement.querySelectorAll(`.films-list--extra`);
const topRatedFilmsListElement = extraFilmsElements[0].querySelector(`.films-list__container`);
const mostCommentedFilmsListElement = extraFilmsElements[1].querySelector(`.films-list__container`);

renderElementsList(FilmCardsCount.TOP_RATED, topRatedFilmsListElement, createFilmCardTemplate());
renderElementsList(FilmCardsCount.MOST_COMMENTED, mostCommentedFilmsListElement, createFilmCardTemplate());

const siteFooterElement = document.querySelector(`.footer`);
render(siteFooterElement, createFooterStatisticsTemplate());
render(siteFooterElement, createFilmDetailsTemplate(), `afterend`);

const filmDetailsElement = document.querySelector(`.film-details`);
const filmDetailsCloseElement = filmDetailsElement.querySelector(`.film-details__close-btn`);

filmDetailsCloseElement.addEventListener(`click`, () => {
  filmDetailsElement.remove();
});

