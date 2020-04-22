import FilmCardComponent from "./components/film-card.js";
import FilmsBlockComponent from "./components/films-block.js";
import FilmsExtraBlockComponent from "./components/films-extra-block.js";
import FilterComponent from "./components/filter.js";
import FooterStatisticsComponent from "./components/footer-statistics.js";
import MainMenuComponent from "./components/main-menu.js";
import ShowMoreButtonComponent from "./components/show-more-button.js";
import SortComponent from "./components/sort.js";
import UserProfileComponent from "./components/user-profile.js";
import {generateFilmCards} from "./mock/film.js";
import {generateFilters} from "./mock/filter";
import {generateUserProfile} from "./mock/user-profile.js";
import {FilmCardsCount, RenderPosition, ExtraFilmsTitles} from "./const.js";
import {render} from "./util.js";

const renderMainMenu = (mainMenuComponent, filters) => {
  render(mainMenuComponent.getElement(), new FilterComponent(filters).getElement(), RenderPosition.AFTERBEGIN);
  render(siteMainElement, new SortComponent().getElement());
};

const renderFilmCard = (filmsListElement, film) => {
  const filmCardComponent = new FilmCardComponent(film);
  render(filmsListElement, filmCardComponent.getElement());
};

const renderFilmsList = (filmsCount, filmsContainer) => {
  films.slice(0, filmsCount).forEach((film) => {
    renderFilmCard(filmsContainer, film);
  });
};

const renderAllFilmsBlock = (filmsBlockComponent, films) => {
  render(siteMainElement, filmsBlockComponent.getElement());
  const filmsListElement = filmsBlockComponent.getElement().querySelector(`.films-list`);
  const filmsListContainerElement = filmsListElement.querySelector(`.films-list__container`);
  let showingFilmCardsCount = FilmCardsCount.SHOWING;
  renderFilmsList(showingFilmCardsCount, filmsListContainerElement);
  const showMoreButtonComponent = new ShowMoreButtonComponent();
  render(filmsListElement, showMoreButtonComponent.getElement());

  const showMoreButtonComponentClickHandler = () => {
    const prevFilmCardCount = showingFilmCardsCount;
    showingFilmCardsCount += FilmCardsCount.BY_BUTTON;

    films.slice(prevFilmCardCount, showingFilmCardsCount).forEach((film) => {
      renderFilmCard(filmsListContainerElement, film);
    });
    if (showingFilmCardsCount >= films.length) {
      showMoreButtonComponent.getElement().remove();
      showMoreButtonComponent.removeElement();
    }
  };

  showMoreButtonComponent.getElement().addEventListener(`click`, showMoreButtonComponentClickHandler);
};

const renderFilmsExtraBlock = (filmsBlockComponent) => {
  render(filmsBlockComponent.getElement(), new FilmsExtraBlockComponent(ExtraFilmsTitles.TOP_RATED).getElement());
  render(filmsBlockComponent.getElement(), new FilmsExtraBlockComponent(ExtraFilmsTitles.MOST_COMMENTED).getElement());
  const extraFilmsElements = filmsBlockComponent.getElement().querySelectorAll(`.films-list--extra`);
  const topRatedFilmsListElement = extraFilmsElements[0].querySelector(`.films-list__container`);
  const mostCommentedFilmsListElement = extraFilmsElements[1].querySelector(`.films-list__container`);
  renderFilmsList(FilmCardsCount.TOP_RATED, topRatedFilmsListElement);
  renderFilmsList(FilmCardsCount.MOST_COMMENTED, mostCommentedFilmsListElement);
};

const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector((`.main`));
const user = generateUserProfile();
render(siteHeaderElement, new UserProfileComponent(user).getElement());

const mainMenuComponent = new MainMenuComponent();
render(siteMainElement, mainMenuComponent.getElement());
const filters = generateFilters();
renderMainMenu(mainMenuComponent, filters);

const filmsBlockComponent = new FilmsBlockComponent();
const films = generateFilmCards(FilmCardsCount.ALL);
renderAllFilmsBlock(filmsBlockComponent, films);
renderFilmsExtraBlock(filmsBlockComponent, films);

const siteFooterElement = document.querySelector(`.footer`);
render(siteFooterElement, new FooterStatisticsComponent(FilmCardsCount.ALL).getElement());
