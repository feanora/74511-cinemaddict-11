import CommentsModel from "../models/comments.js";
import FilmController from "./film.js";
import FilmsBlockComponent from "../components/films-block.js";
import Load from "../components/load.js";
import MostCommentedFilmsBlockComponent from "../components/most-commented-block.js";
import NoFilmsBlockComponent from "../components/no-films-block.js";
import ShowMoreButtonComponent from "../components/show-more-button.js";
import SortComponent from "../components/sort.js";
import TopRatingFilmsBlockComponent from "../components/top-rating-block.js";
import {getSortedFilms} from "../utils/common.js";
import {remove, render} from "../utils/render.js";
import {ExtraFilmsBlockPosition, FilmCardsCount} from "../const.js";

const renderFilmsList = (filmsContainer, films, commentsModel, dataChangeHandler, viewChangeHandler, api, filmsModel) => {
  return films.map((film) => {
    const filmController = new FilmController(filmsContainer, commentsModel, dataChangeHandler, viewChangeHandler, api, filmsModel);
    filmController.render(film);
    return filmController;
  });
};

export default class PageController {
  constructor(container, filmsModel, api) {
    this._container = container;
    this._filmsModel = filmsModel;
    this._api = api;

    this._commentsModel = null;

    this._showedFilmControllers = [];
    this._showedMostCommentedFilmControllers = [];
    this._showedTopRatedFilmControllers = [];
    this._showingFilmCardsCount = FilmCardsCount.SHOWING;

    this._sortComponent = new SortComponent();
    this._filmsBlockComponent = new FilmsBlockComponent();
    this._loadingFilmsComponent = new Load();
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
    render(this._container, this._loadingFilmsComponent);

    const films = this._filmsModel.getFilms();

    if (films) {
      this._loadingFilmsComponent.getElement().remove();
    }

    if (!films.length) {
      render(this._container, this._noFilmsBlockComponent);
      return;
    }

    this._commentsModel = new CommentsModel();
    this._getFilmComments(films);

    render(this._container, this._filmsBlockComponent);
    const filmsBlockComponent = this._filmsBlockComponent.getElement();

    this._renderFilmsInAllBlock(films.slice(0, this._showingFilmCardsCount));
    this._renderShowMoreButton();

    this._renderTopRatedFilmsBlock(filmsBlockComponent);
    this._renderMostCommentedFilmsBlock(filmsBlockComponent);
  }

  _getFilmComments(films) {
    films.forEach((film) => {
      this._api.getComments(film.id)
        .then((comments) => {
          this._commentsModel.setComments(comments);
        });
    });
  }

  _removeFilms() {
    this._showedFilmControllers.forEach((filmController) => filmController.destroy());
    this._showedFilmControllers = [];
  }

  _updateSortedFilms(count) {
    this._removeFilms();
    this._renderFilmsInAllBlock(this._filmsModel.getFilms().slice(0, count));
    this._renderShowMoreButton();
  }

  _updateFilms(count) {
    this._sortComponent.resetSortType();
    this._updateSortedFilms(count);
  }

  _renderFilmsInAllBlock(films) {
    const filmsBlockComponent = this._filmsBlockComponent.getElement();
    const filmsListElement = filmsBlockComponent.querySelector(`.films-list`);
    const filmsListContainerElement = filmsListElement.querySelector(`.films-list__container`);

    const newFilmCards = renderFilmsList(filmsListContainerElement, films, this._commentsModel, this._dataChangeHandler, this._viewChangeHandler, this._api, this._filmsModel);

    this._showedFilmControllers = this._showedFilmControllers.concat(newFilmCards);
    this._showingFilmCardsCount = this._showedFilmControllers.length;
  }

  _renderTopRatedFilmsBlock(filmsBlockComponent) {
    const sortByRatingFilms = this._filmsModel.getTopRatedFilms();
    const firstTopRatingFilm = sortByRatingFilms[0];

    if (firstTopRatingFilm.totalRating > 0) {
      this._topRatingFilmsBlockComponent = new TopRatingFilmsBlockComponent();
      render(filmsBlockComponent, this._topRatingFilmsBlockComponent);

      const topRatedFilmsListContainer = filmsBlockComponent.querySelectorAll(`.films-list--extra`)[ExtraFilmsBlockPosition.TOP_RATED];
      const topRatedFilmsListElement = topRatedFilmsListContainer.querySelector(`.films-list__container`);

      const newTopRatedFilmCards = renderFilmsList(topRatedFilmsListElement, sortByRatingFilms.slice(0, FilmCardsCount.TOP_RATED), this._commentsModel, this._dataChangeHandler, this._viewChangeHandler, this._api, this._filmsModel);
      this._showedTopRatedFilmControllers = this._showedTopRatedFilmControllers.concat(newTopRatedFilmCards);
    }
  }

  _renderMostCommentedFilmsBlock(filmsBlockComponent) {
    const sortByCommentsCountFilms = this._filmsModel.getMostCommentedFilms();

    if (sortByCommentsCountFilms.length === 0) {
      return;
    }

    this._mostCommentedFilmsBlockComponent = new MostCommentedFilmsBlockComponent();
    render(filmsBlockComponent, this._mostCommentedFilmsBlockComponent);

    const mostCommentedFilmsListContainer = filmsBlockComponent.querySelectorAll(`.films-list--extra`)[filmsBlockComponent.querySelectorAll(`.films-list--extra`).length - 1];
    const mostCommentedFilmsListElement = mostCommentedFilmsListContainer.querySelector(`.films-list__container`);

    const newMostCommentedFilmCards = renderFilmsList(mostCommentedFilmsListElement, sortByCommentsCountFilms.slice(0, FilmCardsCount.MOST_COMMENTED), this._commentsModel, this._dataChangeHandler, this._viewChangeHandler, this._api, this._filmsModel);
    this._showedMostCommentedFilmControllers = this._showedMostCommentedFilmControllers.concat(newMostCommentedFilmCards);
  }

  _removeExtraFilms() {
    remove(this._mostCommentedFilmsBlockComponent);
    remove(this._topRatingFilmsBlockComponent);
    this._showedMostCommentedFilmControllers.forEach((filmController) => filmController.destroy());
    this._showedTopRatedFilmControllers.forEach((filmController) => filmController.destroy());
    this._showedMostCommentedFilmControllers = [];
    this._showedTopRatedFilmControllers = [];
  }

  _updateExtraFilms() {
    this._removeExtraFilms();
    this._renderTopRatedFilmsBlock(this._filmsBlockComponent.getElement());
    this._renderMostCommentedFilmsBlock(this._filmsBlockComponent.getElement());
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

  _dataChangeHandler(filmController, oldData, newData) {
    this._api.updateFilm(oldData.id, newData)
      .then((filmModel) => {
        const isSuccess = this._filmsModel.updateFilm(oldData.id, filmModel);

        if (isSuccess) {
          filmController.render(filmModel);
          this._updateSortedFilms(this._showingFilmCardsCount);
          this._updateExtraFilms();
        }
      });
  }

  _viewChangeHandler() {
    this._showedFilmControllers.concat(this._showedTopRatedFilmControllers).concat(this._showedMostCommentedFilmControllers).forEach((film) => film.setDefaultView());
  }

  _filterChangeHandler() {
    this._updateFilms(FilmCardsCount.SHOWING);
  }
}
