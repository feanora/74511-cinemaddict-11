import FilmsBlockComponent from "../components/films-block.js";
import FilmsExtraBlockComponent from "../components/films-extra-block.js";
import SortComponent from "../components/sort.js";
import ShowMoreButtonComponent from "../components/show-more-button.js";
import {ExtraFilmsTitles, FilmCardsCount} from "../const.js";
import {getSortedFilms} from "../utils/common.js";
import {remove, render} from "../utils/render.js";
import FilmController from "./film.js";

const renderFilmsList = (filmsContainer, films) => {
  return films.map((film) => {
    const filmController = new FilmController(filmsContainer);
    filmController.render(film);
    return filmController;
  });
};

export default class PageController {
  constructor(container) {
    this._container = container;
    this._films = [];
    this._showingFilmCardsCount = FilmCardsCount.SHOWING;
    this._sortComponent = new SortComponent();
    this._filmsBlockComponent = new FilmsBlockComponent();
    this._showMoreButtonComponent = new ShowMoreButtonComponent();
    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
    this._sortComponent.setSortTypeChangeHandler(this._sortTypeChangeHandler);
  }
  render(films) {
    this._films = films;
    render(this._container, this._sortComponent);
    render(this._container, this._filmsBlockComponent);
    const filmsBlockComponent = this._filmsBlockComponent.getElement();

    const renderAllFilmsBlock = () => {
      const filmsListElement = filmsBlockComponent.querySelector(`.films-list`);
      const filmsListContainerElement = filmsListElement.querySelector(`.films-list__container`);

      if (FilmCardsCount.ALL === 0) {
        return;
      }
      renderFilmsList(filmsListContainerElement, films.slice(0, this._showingFilmCardsCount));
      this._renderShowMoreButton();
    };

    const renderFilmsExtraBlock = () => {
      render(filmsBlockComponent, new FilmsExtraBlockComponent(ExtraFilmsTitles.TOP_RATED));
      render(filmsBlockComponent, new FilmsExtraBlockComponent(ExtraFilmsTitles.MOST_COMMENTED));
      const extraFilmsElements = filmsBlockComponent.querySelectorAll(`.films-list--extra`);
      const topRatedFilmsListElement = extraFilmsElements[0].querySelector(`.films-list__container`);
      const mostCommentedFilmsListElement = extraFilmsElements[1].querySelector(`.films-list__container`);

      const filmsSortByRating = films.slice().sort((a, b) => b.totalRating - a.totalRating);
      const filmsSortByCommentsCount = films.slice().sort((a, b) => b.commentsCount - a.commentsCount);
      renderFilmsList(topRatedFilmsListElement, filmsSortByRating.slice(0, FilmCardsCount.TOP_RATED));
      renderFilmsList(mostCommentedFilmsListElement, filmsSortByCommentsCount.slice(0, FilmCardsCount.MOST_COMMENTED));
    };
    renderAllFilmsBlock();
    renderFilmsExtraBlock();
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
      renderFilmsList(filmsListContainerElement, sortedFilms);
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
    let sortedFilms = getSortedFilms(this._films, sortType, 0, this._showingFilmCardsCount);
    filmsListContainerElement.innerHTML = ``;
    renderFilmsList(filmsListContainerElement, sortedFilms);
    this._renderShowMoreButton();
  }
}
