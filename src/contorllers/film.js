import {generateComments} from "../mock/comment.js";
import {remove, render, replace} from "../utils/render.js";
import CommentComponent from "../components/comment.js";
import FilmCardComponent from "../components/film-card.js";
import FilmPopupComponent from "../components/film-popup.js";
import {RenderPosition, Mode} from "../const.js";

const renderComments = (film, commentsContainer) => {
  const comments = generateComments(film.commentsCount);
  comments.slice(0, comments.length).forEach((comment) => {
    render(commentsContainer, new CommentComponent(comment));
  });
};

export default class FilmController {
  constructor(container, dataChangeHandler, viewChangeHandler) {
    this._container = container;
    this._mode = Mode.DEFAULT;
    this._dataChangeHandler = dataChangeHandler;
    this._viewChangeHandler = viewChangeHandler;
    this._filmCardComponent = null;
    this._filmPopupComponent = null;
    this._popupEscKeyDownHandler = this._popupEscKeyDownHandler.bind(this);
  }

  render(film) {
    const oldFilmCardComponent = this._filmCardComponent;
    const oldFilmPopupComponent = this._filmPopupComponent;
    this._filmCardComponent = new FilmCardComponent(film);
    this._filmPopupComponent = new FilmPopupComponent(film);

    this._filmCardComponent.setFilmCardElementsClickHandler((evt) => {
      const target = evt.target.closest(`.film-card__poster, .film-card__title, .film-card__comments`);
      if (target) {
        this._renderPopup(film);
      }
    });

    this._filmCardComponent.setAddWatchListButtonClickHandler(() => {
      this._dataChangeHandler(this, film, Object.assign({}, film, {
        watchlist: !film.watchlist,
      }));
    });
    this._filmCardComponent.setWatchedButtonClickHandler(() => {
      this._dataChangeHandler(this, film, Object.assign({}, film, {
        alreadyWatched: !film.alreadyWatched,
      }));
    });
    this._filmCardComponent.setFavoriteButtonClickHandler(() => {
      this._dataChangeHandler(this, film, Object.assign({}, film, {
        favorite: !film.favorite,
      }));
    });

    if (oldFilmCardComponent && oldFilmPopupComponent) {
      replace(this._filmCardComponent, oldFilmCardComponent);
      replace(this._filmPopupComponent, oldFilmPopupComponent);

    } else {
      render(this._container, this._filmCardComponent);
    }
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._closePopup();
    }
  }

  _renderPopup(film) {
    this._viewChangeHandler();
    const siteFooterElement = document.querySelector(`.footer`);
    render(siteFooterElement, this._filmPopupComponent, RenderPosition.AFTEREND);
    this._mode = Mode.POPUP;
    const commentsContainerElement = this._filmPopupComponent.getElement().querySelector(`.film-details__comments-list`);
    renderComments(film, commentsContainerElement);
    this._filmPopupComponent.setPopupCloseElementClickHandler(() => {
      this._closePopup();
    });

    this._setPopupChangeHandlers(film);
    document.addEventListener(`keydown`, this._popupEscKeyDownHandler);
  }

  _closePopup() {
    document.removeEventListener(`keydown`, this._popupEscKeyDownHandler);
    remove(this._filmPopupComponent);
    this._filmPopupComponent.reset();
    this._mode = Mode.DEFAULT;
  }

  _popupEscKeyDownHandler(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;
    if (isEscKey) {
      this._closePopup();
    }
  }

  _setPopupChangeHandlers(film) {
    this._filmPopupComponent.setAddWatchListButtonChangeHandler(() => {
      this._dataChangeHandler(this, film, Object.assign({}, film, {
        watchlist: !film.watchlist,
      }));
    });
    this._filmPopupComponent.setWatchedButtonChangeHandler(() => {
      this._dataChangeHandler(this, film, Object.assign({}, film, {
        alreadyWatched: !film.alreadyWatched,
      }));
    });
    this._filmPopupComponent.setFavoriteButtonChangeHandler(() => {
      this._dataChangeHandler(this, film, Object.assign({}, film, {
        favorite: !film.favorite,
      }));
    });
  }
}
