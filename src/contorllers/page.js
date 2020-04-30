import CommentComponent from "../components/comment.js";
import FilmsBlockComponent from "../components/films-block.js";
import FilmCardComponent from "../components/film-card.js";
import FilmPopupComponent from "../components/film-popup.js";
import FilmsExtraBlockComponent from "../components/films-extra-block.js";
import SortComponent from "../components/sort.js";
import ShowMoreButtonComponent from "../components/show-more-button.js";
import {generateComments} from "../mock/comment.js";
import {ExtraFilmsTitles, FilmCardsCount, RenderPosition} from "../const.js";
import {getSortedFilms} from "../utils/common.js";
import {remove, removeElement, render} from "../utils/render.js";

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
    const siteFooterElement = document.querySelector(`.footer`);
    render(siteFooterElement, filmPopupComponent, RenderPosition.AFTEREND);
    const commentsContainerElement = filmPopupComponent.getElement().querySelector(`.film-details__comments-list`);
    renderComments(film, commentsContainerElement);
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
    filmPopupComponent.setPopupCloseElementClickHandler(() => {
      closePopup();
    });
    document.addEventListener(`keydown`, popupEscKeyDownHandler);
  };
  const closeIfPopupOpen = () => {
    const popupElement = document.querySelector(`.film-details`);
    if (popupElement) {
      removeElement(popupElement);
    }
  };

  filmCardComponent.setFilmCardElementsClickHandler((evt) => {
    const target = evt.target.closest(`.film-card__poster, .film-card__title, .film-card__comments`);
    if (target) {
      renderPopup();
    }
  });
};

const renderFilmsList = (filmsContainer, films) => {
  films.forEach((film) => {
    renderFilmCard(filmsContainer, film);
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

      const showMoreButtonComponentClickHandler = () => {
        const prevFilmCardCount = showingFilmCardsCount;
        showingFilmCardsCount += FilmCardsCount.BY_BUTTON;

        films.slice(prevFilmCardCount, showingFilmCardsCount).forEach((film) => {
          renderFilmCard(filmsListContainerElement, film);
        });
        if (showingFilmCardsCount >= films.length) {
          remove(this._showMoreButtonComponent);
        }
      };
      const renderShowMoreButton = (handler) => {
        if (showingFilmCardsCount >= films.length) {
          return;
        }
        if (this._showMoreButtonComponent) {
          remove(this._showMoreButtonComponent);
        }

        render(filmsListElement, this._showMoreButtonComponent);
        this._showMoreButtonComponent.setClickHandler(handler);
      };

      if (FilmCardsCount.ALL === 0) {
        return;
      }
      renderFilmsList(filmsListContainerElement, films.slice(0, showingFilmCardsCount));
      renderShowMoreButton(showMoreButtonComponentClickHandler);

      this._sortComponent.setSortTypeChangeHandler((sortType) => {
        showingFilmCardsCount = FilmCardsCount.BY_BUTTON;
        let sortedFilms = getSortedFilms(films, sortType, 0, showingFilmCardsCount);
        filmsListContainerElement.innerHTML = ``;
        renderFilmsList(filmsListContainerElement, sortedFilms);
        const showMoreButtonComponentIfSortedFilmsClickHandler = () => {
          const prevFilmCardCount = showingFilmCardsCount;
          showingFilmCardsCount += FilmCardsCount.BY_BUTTON;
          sortedFilms = getSortedFilms(films, sortType, prevFilmCardCount, showingFilmCardsCount);
          sortedFilms.forEach((film) => {
            renderFilmCard(filmsListContainerElement, film);
          });
          if (showingFilmCardsCount >= films.length) {
            remove(this._showMoreButtonComponent);
          }
        };
        renderShowMoreButton(showMoreButtonComponentIfSortedFilmsClickHandler);
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
