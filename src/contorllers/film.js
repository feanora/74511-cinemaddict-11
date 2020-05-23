import {remove, render, replace} from "../utils/render.js";
import CommentsComponent from "../components/comments.js";
import NewCommentComponent from "../components/new-comment.js";
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
    this._commentsComponent = null;
    this._newCommentComponent = null;

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
      const commentsContainerElement = this._filmPopupComponent.getElement().querySelector(`.film-details__inner`);
      this._renderCommentsBlock(film, commentsContainerElement);

    } else {
      render(this._container, this._filmCardComponent);
    }
  }

  _renderCommentsBlock(film, commentsContainer) {
    const filmComments = this._commentsModel.getCommentsByIds(film.comments);

    this._commentsComponent = new CommentsComponent(filmComments);
    render(commentsContainer, this._commentsComponent);

    if (!this._newCommentComponent) {
      this._newCommentComponent = new NewCommentComponent();
    }

    const newCommentContainerElement = this._commentsComponent.getElement().querySelector(`.film-details__comments-wrap`);
    render(newCommentContainerElement, this._newCommentComponent);
  }

  _renderPopup(film) {
    const siteFooterElement = document.querySelector(`.footer`);
    render(siteFooterElement, this._filmPopupComponent, RenderPosition.AFTEREND);

    const commentsContainerElement = this._filmPopupComponent.getElement().querySelector(`.film-details__inner`);
    this._renderCommentsBlock(film, commentsContainerElement);
  }

  _openPopup(film) {
    this._viewChangeHandler();
    this._mode = Mode.POPUP;

    document.body.classList.add(`hide-overflow`);

    this._renderPopup(film);

    this._setPopupHandlers(film);
    document.addEventListener(`keydown`, this._popupEscKeyDownHandler);
  }

  _closePopup() {
    this._mode = Mode.DEFAULT;
    document.removeEventListener(`keydown`, this._popupEscKeyDownHandler);
    document.body.classList.remove(`hide-overflow`);
    remove(this._filmPopupComponent);
    this._filmPopupComponent.rerender();
    this._newCommentComponent.reset();
  }

  destroy() {
    remove(this._filmCardComponent);
    remove(this._filmPopupComponent);
    document.removeEventListener(`keydown`, this._popupEscKeyDownHandler);
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._closePopup();
    }
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

