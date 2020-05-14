import FilmsBlockComponent from "../components/films-block.js";
import FilmsExtraBlockComponent from "../components/films-extra-block.js";
import SortComponent from "../components/sort.js";
import ShowMoreButtonComponent from "../components/show-more-button.js";
import NoFilmsBlockComponent from "../components/no-films-block.js";
import {ExtraFilmsTitles, FilmCardsCount} from "../const.js";
import {getSortedFilms} from "../utils/common.js";
import {remove, render} from "../utils/render.js";
import FilmController from "./film.js";

const renderFilmsList = (filmsContainer, films, dataChangeHandler, viewChangeHandler) => {
  return films.map((film) => {
    const filmController = new FilmController(filmsContainer, dataChangeHandler, viewChangeHandler);
    filmController.render(film);
    return filmController;
  });
};

export default class PageController {
  constructor(container) {
    this._container = container;
    this._films = [];
    this._showedFilmControllers = [];
    this._showedExtraFilmControllers = [];
    this._showingFilmCardsCount = FilmCardsCount.SHOWING;
    this._sortComponent = new SortComponent();
    this._filmsBlockComponent = new FilmsBlockComponent();
    this._noFilmsBlockComponent = new NoFilmsBlockComponent();
    this._showMoreButtonComponent = new ShowMoreButtonComponent();
    this._dataChangeHandler = this._dataChangeHandler.bind(this);
    this._viewChangeHandler = this._viewChangeHandler.bind(this);
    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
    this._sortComponent.setSortTypeChangeHandler(this._sortTypeChangeHandler);
  }
  render(films) {
    this._films = films;

    render(this._container, this._sortComponent);

    if (!films.length) {
      render(this._container, this._noFilmsBlockComponent);
      return;
    }

    render(this._container, this._filmsBlockComponent);
    const filmsBlockComponent = this._filmsBlockComponent.getElement();

    this._renderAllFilmsBlock(filmsBlockComponent);
    this._renderExtraFilmsBlock(filmsBlockComponent);
  }

  _renderShowMoreButton() {
    if (this._showingFilmCardsCount >= this._films.length) {
      return;
    }

    const filmsBlockComponent = this._filmsBlockComponent.getElement();
    const filmsListElement = filmsBlockComponent.querySelector(`.films-list`);
    const filmsListContainerElement = filmsListElement.querySelector(`.films-list__container`);

    render(filmsListElement, this._showMoreButtonComponent);

    this._showMoreButtonComponent.setClickHandler(() => {
      const prevFilmCardCount = this._showingFilmCardsCount;
      this._showingFilmCardsCount += FilmCardsCount.BY_BUTTON;

      const sortedFilms = getSortedFilms(this._films, this._sortComponent.getSortType(), prevFilmCardCount, this._showingFilmCardsCount);
      const newFilmCards = renderFilmsList(filmsListContainerElement, sortedFilms, this._dataChangeHandler, this._viewChangeHandler);

      this._showedFilmControllers = this._showedFilmControllers.concat(newFilmCards);

      if (this._showingFilmCardsCount >= this._films.length) {
        remove(this._showMoreButtonComponent);
      }
    });
  }

  _sortTypeChangeHandler(sortType) {
    this._showingFilmCardsCount = FilmCardsCount.SHOWING;

    const filmsBlockComponent = this._filmsBlockComponent.getElement();
    const filmsListElement = filmsBlockComponent.querySelector(`.films-list`);
    const filmsListContainerElement = filmsListElement.querySelector(`.films-list__container`);

    const sortedFilms = getSortedFilms(this._films, sortType, 0, this._showingFilmCardsCount);

    filmsListContainerElement.innerHTML = ``;
    this._showedFilmControllers = renderFilmsList(filmsListContainerElement, sortedFilms, this._dataChangeHandler, this._viewChangeHandler);

    this._renderShowMoreButton();
  }

  _renderAllFilmsBlock(filmsBlockComponent) {
    const filmsListElement = filmsBlockComponent.querySelector(`.films-list`);
    const filmsListContainerElement = filmsListElement.querySelector(`.films-list__container`);

    const newFilmCards = renderFilmsList(filmsListContainerElement, this._films.slice(0, this._showingFilmCardsCount), this._dataChangeHandler, this._viewChangeHandler);
    this._showedFilmControllers = this._showedFilmControllers.concat(newFilmCards);
    this._renderShowMoreButton();
  }

  _renderExtraFilmsBlock(filmsBlockComponent) {
    render(filmsBlockComponent, new FilmsExtraBlockComponent(ExtraFilmsTitles.TOP_RATED));
    render(filmsBlockComponent, new FilmsExtraBlockComponent(ExtraFilmsTitles.MOST_COMMENTED));

    const extraFilmsElements = Array.from(filmsBlockComponent.querySelectorAll(`.films-list--extra`));
    const [topRatedFilmsListContainer, mostCommentedFilmsListContainer] = extraFilmsElements;
    const topRatedFilmsListElement = topRatedFilmsListContainer.querySelector(`.films-list__container`);
    const mostCommentedFilmsListElement = mostCommentedFilmsListContainer.querySelector(`.films-list__container`);

    const sortByRatingFilms = this._films.slice().sort((a, b) => b.totalRating - a.totalRating);
    const sortByCommentsCountFilms = this._films.slice().sort((a, b) => b.commentsCount - a.commentsCount);

    const newTopRatedFilmCards = renderFilmsList(topRatedFilmsListElement, sortByRatingFilms.slice(0, FilmCardsCount.TOP_RATED), this._dataChangeHandler, this._viewChangeHandler);
    const newMostCommentedFilmCards = renderFilmsList(mostCommentedFilmsListElement, sortByCommentsCountFilms.slice(0, FilmCardsCount.MOST_COMMENTED), this._dataChangeHandler, this._viewChangeHandler);
    this._showedExtraFilmControllers = [].concat(newTopRatedFilmCards, newMostCommentedFilmCards);
  }

  _dataChangeHandler(filmController, oldData, newData) {
    const index = this._films.findIndex((film) => film === oldData);

    if (index === -1) {
      return;
    }

    this._films = [].concat(this._films.slice(0, index), newData, this._films.slice(index + 1));
    filmController.render(this._films[index]);
  }

  _viewChangeHandler() {
    this._showedFilmControllers.concat(this._showedExtraFilmControllers).forEach((film) => film.setDefaultView());
  }
}
