import FilmsBlockComponent from "../components/films-block.js";
import FilmsExtraBlockComponent from "../components/films-extra-block.js";
import SortComponent from "../components/sort.js";
import ShowMoreButtonComponent from "../components/show-more-button.js";
import NoFilmsBlockComponent from "../components/no-films-block.js";
import {ExtraFilmsTitles, FilmCardsCount} from "../const.js";
import {getSortedFilms} from "../utils/common.js";
import {remove, render} from "../utils/render.js";
import FilmController from "./film.js";

const renderFilmsList = (filmsContainer, films, commentsModel, dataChangeHandler, viewChangeHandler) => {
  return films.map((film) => {
    const filmController = new FilmController(filmsContainer, commentsModel, dataChangeHandler, viewChangeHandler);
    filmController.render(film);
    return filmController;
  });
};

export default class PageController {
  constructor(container, filmsModel, commentsModel) {
    this._container = container;
    this._filmsModel = filmsModel;
    this._commentsModel = commentsModel;

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
    this._filterChangeHandler = this._filterChangeHandler.bind(this);
    this._showMoreButtonClickHandler = this._showMoreButtonClickHandler.bind(this);

    this._sortComponent.setSortTypeChangeHandler(this._sortTypeChangeHandler);
    this._filmsModel.setFilterChangeHandler(this._filterChangeHandler);
  }

  hide() {
    this._sortComponent.hide();
    this._filmsBlockComponent.hide();
  }

  show() {
    this._sortComponent.resetSortType();
    this._sortComponent.show();
    this._filmsBlockComponent.show();
  }

  render() {
    render(this._container, this._sortComponent);

    const films = this._filmsModel.getFilms();

    if (!films.length) {
      render(this._container, this._noFilmsBlockComponent);
      return;
    }

    render(this._container, this._filmsBlockComponent);
    const filmsBlockComponent = this._filmsBlockComponent.getElement();

    this._renderFilmsInAllBlock(films.slice(0, this._showingFilmCardsCount));
    this._renderShowMoreButton();

    this._renderExtraFilmsBlock(filmsBlockComponent);
  }

  _removeFilms() {
    this._showedFilmControllers.forEach((filmController) => filmController.destroy());
    this._showedFilmControllers = [];
  }

  _updateFilms(count) {
    this._removeFilms();
    this._sortComponent.resetSortType();
    this._renderFilmsInAllBlock(this._filmsModel.getFilms().slice(0, count));
    this._renderShowMoreButton();
  }

  _renderFilmsInAllBlock(films) {
    const filmsBlockComponent = this._filmsBlockComponent.getElement();
    const filmsListElement = filmsBlockComponent.querySelector(`.films-list`);
    const filmsListContainerElement = filmsListElement.querySelector(`.films-list__container`);

    const newFilmCards = renderFilmsList(filmsListContainerElement, films, this._commentsModel, this._dataChangeHandler, this._viewChangeHandler);

    this._showedFilmControllers = this._showedFilmControllers.concat(newFilmCards);
    this._showingFilmCardsCount = this._showedFilmControllers.length;
  }

  _renderShowMoreButton() {
    remove(this._showMoreButtonComponent);

    if (this._showingFilmCardsCount >= this._filmsModel.getFilms().length) {
      return;
    }

    const filmsBlockComponent = this._filmsBlockComponent.getElement();
    const filmsListElement = filmsBlockComponent.querySelector(`.films-list`);

    render(filmsListElement, this._showMoreButtonComponent);
    this._showMoreButtonComponent.setClickHandler(this._showMoreButtonClickHandler);
  }

  _showMoreButtonClickHandler() {
    const prevFilmCardCount = this._showingFilmCardsCount;
    const films = this._filmsModel.getFilms();
    this._showingFilmCardsCount += FilmCardsCount.BY_BUTTON;

    const sortedFilms = getSortedFilms(films, this._sortComponent.getSortType(), prevFilmCardCount, this._showingFilmCardsCount);
    this._renderFilmsInAllBlock(sortedFilms);

    if (this._showingFilmCardsCount >= films.length) {
      remove(this._showMoreButtonComponent);
    }
  }

  _sortTypeChangeHandler(sortType) {
    this._showingFilmCardsCount = FilmCardsCount.SHOWING;
    const sortedFilms = getSortedFilms(this._filmsModel.getFilms(), sortType, 0, this._showingFilmCardsCount);
    this._removeFilms();
    this._renderFilmsInAllBlock(sortedFilms);
    this._renderShowMoreButton();
  }

  _renderExtraFilmsBlock(filmsBlockComponent) {
    render(filmsBlockComponent, new FilmsExtraBlockComponent(ExtraFilmsTitles.TOP_RATED));
    render(filmsBlockComponent, new FilmsExtraBlockComponent(ExtraFilmsTitles.MOST_COMMENTED));

    const extraFilmsElements = Array.from(filmsBlockComponent.querySelectorAll(`.films-list--extra`));
    const [topRatedFilmsListContainer, mostCommentedFilmsListContainer] = extraFilmsElements;
    const topRatedFilmsListElement = topRatedFilmsListContainer.querySelector(`.films-list__container`);
    const mostCommentedFilmsListElement = mostCommentedFilmsListContainer.querySelector(`.films-list__container`);

    const sortByRatingFilms = this._filmsModel.getTopRatedFilms();
    const sortByCommentsCountFilms = this._filmsModel.getMostCommentedFilms();

    const newTopRatedFilmCards = renderFilmsList(topRatedFilmsListElement, sortByRatingFilms.slice(0, FilmCardsCount.TOP_RATED), this._commentsModel, this._dataChangeHandler, this._viewChangeHandler);
    const newMostCommentedFilmCards = renderFilmsList(mostCommentedFilmsListElement, sortByCommentsCountFilms.slice(0, FilmCardsCount.MOST_COMMENTED), this._commentsModel, this._dataChangeHandler, this._viewChangeHandler);
    this._showedExtraFilmControllers = [].concat(newTopRatedFilmCards, newMostCommentedFilmCards);
  }

  _dataChangeHandler(filmController, oldData, newData) {
    const isSuccess = this._filmsModel.updateFilm(oldData.id, newData);

    if (isSuccess) {
      filmController.render(newData);
    }
  }

  _viewChangeHandler() {
    this._showedFilmControllers.concat(this._showedExtraFilmControllers).forEach((film) => film.setDefaultView());
  }

  _filterChangeHandler() {
    this._updateFilms(FilmCardsCount.SHOWING);
  }
}
