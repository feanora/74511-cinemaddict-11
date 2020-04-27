import CommentComponent from "../components/comment.js";
import FilmCardComponent from "../components/film-card.js";
import FilmPopupComponent from "../components/film-popup.js";
import FilmsExtraBlockComponent from "../components/films-extra-block.js";
import ShowMoreButtonComponent from "../components/show-more-button.js";
import {generateComments} from "../mock/comment.js";
import {ExtraFilmsTitles, FilmCardsCount, RenderPosition} from "../const.js";
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

export default class PageController {
  constructor(container) {
    this._container = container;
    this._showMoreButtonComponent = new ShowMoreButtonComponent();
  }

  render(films) {
    const container = this._container.getElement();
    if (FilmCardsCount.ALL === 0) {
      return;
    }

    const renderFilmsList = (filmsCount, filmsContainer) => {
      films.slice(0, filmsCount).forEach((film) => {
        renderFilmCard(filmsContainer, film);
      });
    };

    const renderAllFilmsBlock = () => {
      const filmsListElement = container.querySelector(`.films-list`);
      const filmsListContainerElement = filmsListElement.querySelector(`.films-list__container`);
      let showingFilmCardsCount = FilmCardsCount.SHOWING;
      renderFilmsList(showingFilmCardsCount, filmsListContainerElement);
      render(filmsListElement, this._showMoreButtonComponent);

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

      this._showMoreButtonComponent.setClickHandler(showMoreButtonComponentClickHandler);
    };

    const renderFilmsExtraBlock = () => {
      render(container, new FilmsExtraBlockComponent(ExtraFilmsTitles.TOP_RATED));
      render(container, new FilmsExtraBlockComponent(ExtraFilmsTitles.MOST_COMMENTED));
      const extraFilmsElements = container.querySelectorAll(`.films-list--extra`);
      const topRatedFilmsListElement = extraFilmsElements[0].querySelector(`.films-list__container`);
      const mostCommentedFilmsListElement = extraFilmsElements[1].querySelector(`.films-list__container`);

      const filmsSortByRating = films.slice().sort((a, b) => b.totalRating - a.totalRating);
      const filmsSortByCommentsCount = films.slice().sort((a, b) => b.commentsCount - a.commentsCount);
      renderFilmsList(FilmCardsCount.TOP_RATED, topRatedFilmsListElement, filmsSortByRating);
      renderFilmsList(FilmCardsCount.MOST_COMMENTED, mostCommentedFilmsListElement, filmsSortByCommentsCount);
    };
    renderAllFilmsBlock();
    renderFilmsExtraBlock();
  }
}
