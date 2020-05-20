import {remove, render, replace} from "../utils/render.js";
import CommentComponent from "../components/comment.js";
import FilmCardComponent from "../components/film-card.js";
import FilmPopupComponent from "../components/film-popup.js";
import {RenderPosition, Mode} from "../const.js";

export default class FilmController {
  constructor(container, commentsModel, dataChangeHandler, viewChangeHandler) {
    this._container = container;
    this._commentsModel = commentsModel;

    this._mode = Mode.DEFAULT;

    this._filmCardComponent = null;
    this._filmPopupComponent = null;

    this._dataChangeHandler = dataChangeHandler;
    this._viewChangeHandler = viewChangeHandler;

    this._popupEscKeyDownHandler = this._popupEscKeyDownHandler.bind(this);
  }

  render(film) {
    const oldFilmCardComponent = this._filmCardComponent;
    const oldFilmPopupComponent = this._filmPopupComponent;

    this._filmCardComponent = new FilmCardComponent(film);
    this._filmPopupComponent = new FilmPopupComponent(film);

    this._setFilmCardHandlers(film);
    this._setPopupHandlers(film);

    if (oldFilmCardComponent && oldFilmPopupComponent) {
      replace(this._filmCardComponent, oldFilmCardComponent);
      replace(this._filmPopupComponent, oldFilmPopupComponent);

    } else {
      render(this._container, this._filmCardComponent);
    }
  }

  _renderComments(film, commentsContainer) {
    const filmComments = this._commentsModel.getCommentsByIds(film.comments);
    filmComments.slice(0, film.comments.length).forEach((comment) => {
      render(commentsContainer, new CommentComponent(comment));
    });
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._closePopup();
    }
  }

  _openPopup(film) {
    this._viewChangeHandler();
    this._mode = Mode.POPUP;

    const siteFooterElement = document.querySelector(`.footer`);
    render(siteFooterElement, this._filmPopupComponent, RenderPosition.AFTEREND);

    document.body.classList.add(`hide-overflow`);

    const commentsContainerElement = this._filmPopupComponent.getElement().querySelector(`.film-details__comments-list`);
    this._renderComments(film, commentsContainerElement);

    this._setPopupHandlers(film);
    document.addEventListener(`keydown`, this._popupEscKeyDownHandler);
  }

  _closePopup() {
    this._mode = Mode.DEFAULT;
    document.removeEventListener(`keydown`, this._popupEscKeyDownHandler);
    document.body.classList.remove(`hide-overflow`);
    remove(this._filmPopupComponent);
    this._filmPopupComponent.reset();
  }

  _popupEscKeyDownHandler(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;
    if (isEscKey) {
      this._closePopup();
    }
  }

  _setFilmCardChangeHandlers(film) {
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
  }

  _setFilmCardHandlers(film) {
    this._filmCardComponent.setFilmCardElementsClickHandler((evt) => {
      const target = evt.target.closest(`.film-card__poster, .film-card__title, .film-card__comments`);
      if (target) {
        this._openPopup(film);
      }
    });

    this._setFilmCardChangeHandlers(film);
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

  _setPopupHandlers(film) {
    this._filmPopupComponent.setPopupCloseElementClickHandler(() => {
      this._closePopup();
    });

    this._setPopupChangeHandlers(film);
  }
}

