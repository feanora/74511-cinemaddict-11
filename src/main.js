import CommentComponent from "./components/comment.js";
import FilmCardComponent from "./components/film-card.js";
import FilmPopupComponent from "./components/film-popup.js";
import FilmsBlockComponent from "./components/films-block.js";
import FilmsExtraBlockComponent from "./components/films-extra-block.js";
import FilterComponent from "./components/filter.js";
import FooterStatisticsComponent from "./components/footer-statistics.js";
import MainMenuComponent from "./components/main-menu.js";
import ShowMoreButtonComponent from "./components/show-more-button.js";
import SortComponent from "./components/sort.js";
import UserProfileComponent from "./components/user-profile.js";
import {generateComments} from "./mock/comment.js";
import {generateFilmCards} from "./mock/film.js";
import {generateFilters} from "./mock/filter";
import {generateUserProfile} from "./mock/user-profile.js";
import {FilmCardsCount, RenderPosition, ExtraFilmsTitles} from "./const.js";
import {render, remove, removeElement} from "./utils/render.js";

const renderMainMenu = (mainMenuComponent, filters) => {
  render(mainMenuComponent.getElement(), new FilterComponent(filters), RenderPosition.AFTERBEGIN);
  render(siteMainElement, new SortComponent());
};

const renderComments = (film, commentsContainer) => {
  const comments = generateComments(film.commentsCount);
  comments.slice(0, comments.length).forEach((comment) => {
    render(commentsContainer, new CommentComponent(comment));
  });
};

const renderFilmCard = (filmsListElement, film) => {
  const filmCardComponent = new FilmCardComponent(film);
  render(filmsListElement, filmCardComponent);
  const renderPopup = () => {
    closeIfPopupOpen();
    const filmPopupComponent = new FilmPopupComponent(film);
    render(siteFooterElement, filmPopupComponent, RenderPosition.AFTEREND);
    const commentsContainerElement = filmPopupComponent.getElement().querySelector(`.film-details__comments-list`);
    renderComments(film, commentsContainerElement);

    const popupCloseElement = filmPopupComponent.getElement().querySelector(`.film-details__close-btn`);
    const popupEscKeyDownHandler = (evt) => {
      const isEscKey = evt.key === `Escape` || evt.key === `Esc`;
      if (isEscKey) {
        closePopup();
      }
    };
    const closePopup = () => {
      document.removeEventListener(`keydown`, popupEscKeyDownHandler);
      remove(filmPopupComponent);
    };
    popupCloseElement.addEventListener(`click`, () => {
      closePopup();
    }
    );
    document.addEventListener(`keydown`, popupEscKeyDownHandler);
  };
  const closeIfPopupOpen = () => {
    const popupElement = document.querySelector(`.film-details`);
    if (popupElement) {
      removeElement(popupElement);
    }
  };

  filmCardComponent.getElement().addEventListener(`click`, (evt) => {
    const target = evt.target.closest(`.film-card__poster, .film-card__title, .film-card__comments`);
    if (target) {
      renderPopup();
    }
  });
};

const renderFilmsList = (filmsCount, filmsContainer, films) => {
  films.slice(0, filmsCount).forEach((film) => {
    renderFilmCard(filmsContainer, film);
  });
};

const renderAllFilmsBlock = (filmsBlockComponent, films) => {

  const filmsListElement = filmsBlockComponent.getElement().querySelector(`.films-list`);
  const filmsListContainerElement = filmsListElement.querySelector(`.films-list__container`);
  let showingFilmCardsCount = FilmCardsCount.SHOWING;
  renderFilmsList(showingFilmCardsCount, filmsListContainerElement, films);
  const showMoreButtonComponent = new ShowMoreButtonComponent();
  render(filmsListElement, showMoreButtonComponent);

  const showMoreButtonComponentClickHandler = () => {
    const prevFilmCardCount = showingFilmCardsCount;
    showingFilmCardsCount += FilmCardsCount.BY_BUTTON;

    films.slice(prevFilmCardCount, showingFilmCardsCount).forEach((film) => {
      renderFilmCard(filmsListContainerElement, film);
    });
    if (showingFilmCardsCount >= films.length) {
      remove(showMoreButtonComponent);
    }
  };

  showMoreButtonComponent.getElement().addEventListener(`click`, showMoreButtonComponentClickHandler);
};

const renderFilmsExtraBlock = (filmsBlockComponent, films) => {
  render(filmsBlockComponent.getElement(), new FilmsExtraBlockComponent(ExtraFilmsTitles.TOP_RATED));
  render(filmsBlockComponent.getElement(), new FilmsExtraBlockComponent(ExtraFilmsTitles.MOST_COMMENTED));
  const extraFilmsElements = filmsBlockComponent.getElement().querySelectorAll(`.films-list--extra`);
  const topRatedFilmsListElement = extraFilmsElements[0].querySelector(`.films-list__container`);
  const mostCommentedFilmsListElement = extraFilmsElements[1].querySelector(`.films-list__container`);

  const filmsSortByRating = films.slice().sort((a, b) => b.totalRating - a.totalRating);
  const filmsSortByCommentsCount = films.slice().sort((a, b) => b.commentsCount - a.commentsCount);
  renderFilmsList(FilmCardsCount.TOP_RATED, topRatedFilmsListElement, filmsSortByRating);
  renderFilmsList(FilmCardsCount.MOST_COMMENTED, mostCommentedFilmsListElement, filmsSortByCommentsCount);
};

const renderFilmsBlock = () => {
  const filmsBlockComponent = new FilmsBlockComponent();
  render(siteMainElement, filmsBlockComponent);
  if (FilmCardsCount.ALL === 0) {
    return;
  }

  const films = generateFilmCards(FilmCardsCount.ALL);
  renderAllFilmsBlock(filmsBlockComponent, films);
  renderFilmsExtraBlock(filmsBlockComponent, films);
};

const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector((`.main`));
const siteFooterElement = document.querySelector(`.footer`);
const user = generateUserProfile();
render(siteHeaderElement, new UserProfileComponent(user));

const mainMenuComponent = new MainMenuComponent();
render(siteMainElement, mainMenuComponent);

const filters = generateFilters();
renderMainMenu(mainMenuComponent, filters);
renderFilmsBlock();
render(siteFooterElement, new FooterStatisticsComponent(FilmCardsCount.ALL));
