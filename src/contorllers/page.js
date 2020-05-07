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
    this._sortComponent = new SortComponent();
    this._filmsBlockComponent = new FilmsBlockComponent();
    this._showMoreButtonComponent = new ShowMoreButtonComponent();
  }
  render(films) {
    const siteMainElement = this._container;
    render(siteMainElement, this._sortComponent);
    render(siteMainElement, this._filmsBlockComponent);
    const filmsBlockComponent = this._filmsBlockComponent.getElement();

    const renderAllFilmsBlock = () => {
      const filmsListElement = filmsBlockComponent.querySelector(`.films-list`);
      const filmsListContainerElement = filmsListElement.querySelector(`.films-list__container`);
      let showingFilmCardsCount = FilmCardsCount.SHOWING;

      const renderShowMoreButton = () => {
        if (showingFilmCardsCount >= films.length) {
          return;
        }
        render(filmsListElement, this._showMoreButtonComponent);
        this._showMoreButtonComponent.setClickHandler(() => {
          const prevFilmCardCount = showingFilmCardsCount;
          showingFilmCardsCount += FilmCardsCount.BY_BUTTON;

          const sortedFilms = getSortedFilms(films, this._sortComponent.getSortType(), prevFilmCardCount, showingFilmCardsCount);
          renderFilmsList(filmsListContainerElement, sortedFilms);
          if (showingFilmCardsCount >= films.length) {
            remove(this._showMoreButtonComponent);
          }
        });
      };

      if (FilmCardsCount.ALL === 0) {
        return;
      }
      renderFilmsList(filmsListContainerElement, films.slice(0, showingFilmCardsCount));
      renderShowMoreButton();

      this._sortComponent.setSortTypeChangeHandler((sortType) => {
        showingFilmCardsCount = FilmCardsCount.SHOWING;
        let sortedFilms = getSortedFilms(films, sortType, 0, showingFilmCardsCount);
        filmsListContainerElement.innerHTML = ``;
        renderFilmsList(filmsListContainerElement, sortedFilms);
        renderShowMoreButton();
      });
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
}
