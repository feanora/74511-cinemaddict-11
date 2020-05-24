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
    this._film = null;

    this._mode = Mode.DEFAULT;

    this._filmCardComponent = null;
    this._filmPopupComponent = null;
    this._commentsComponent = null;
    this._newCommentComponent = null;

    this._dataChangeHandler = dataChangeHandler;
    this._viewChangeHandler = viewChangeHandler;

    this._popupEscKeyDownHandler = this._popupEscKeyDownHandler.bind(this);
    this._commentChangeHandler = this._commentChangeHandler.bind(this);
  }

  render(film) {
    this._film = film;
    const oldFilmCardComponent = this._filmCardComponent;
    const oldFilmPopupComponent = this._filmPopupComponent;

    this._filmCardComponent = new FilmCardComponent(film);
    this._filmPopupComponent = new FilmPopupComponent(film);

    this._setFilmCardHandlers(film);

    if (oldFilmCardComponent && oldFilmPopupComponent) {
      replace(this._filmCardComponent, oldFilmCardComponent);

    } else {
      render(this._container, this._filmCardComponent);
    }
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

  _renderPopup() {
    const siteFooterElement = document.querySelector(`.footer`);
    render(siteFooterElement, this._filmPopupComponent, RenderPosition.AFTEREND);

    this._renderCommentsBlock();
  }

  _renderCommentsBlock() {
    const allComments = this._commentsModel.getComments();
    const filmComments = this._getFilmComments(allComments);

    this._commentsComponent = new CommentsComponent(filmComments);
    const commentsContainer = this._filmPopupComponent.getElement().querySelector(`.film-details__inner`);
    render(commentsContainer, this._commentsComponent);

    if (!this._newCommentComponent) {
      this._newCommentComponent = new NewCommentComponent();
    }

    const newCommentContainerElement = this._commentsComponent.getElement().querySelector(`.film-details__comments-wrap`);
    render(newCommentContainerElement, this._newCommentComponent);

    this._commentsComponent.setDeleteCommentButtonClickHandler((evt) => {
      this._deleteCommentsButtonClickHandler(evt);
    });
  }

  _getFilmComments(comments) {
    return this._film.comments.map((it) => comments.find((comment) => comment.id === it));
  }

  _rerenderCommentsBlock() {
    remove(this._commentsComponent);
    this._renderCommentsBlock();
  }

  _openPopup(film) {
    this._viewChangeHandler();
    this._mode = Mode.POPUP;

    document.body.classList.add(`hide-overflow`);

    this._renderPopup(film);

    this._setPopupHandler(film);
    document.addEventListener(`keydown`, this._popupEscKeyDownHandler);
  }

  _closePopup() {
    this._mode = Mode.DEFAULT;

    document.removeEventListener(`keydown`, this._popupEscKeyDownHandler);
    document.body.classList.remove(`hide-overflow`);

    remove(this._filmPopupComponent);

    this._filmPopupComponent.rerender();
    this._newCommentComponent.reset();

    this._dataChangeHandler(this, this._film, this._film);
  }

  _commentChangeHandler(oldData, newData) {
    if (newData === null) {
      const isSuccess = this._commentsModel.deleteComment(oldData);
      this._rerenderCommentsBlock();
      if (isSuccess) {
        this._rerenderCommentsBlock();
      }
    }

    if (oldData === null) {
      this._commentsModel.addComment(newData);
      this._rerenderCommentsBlock();
      this._newCommentComponent.reset();
    }
  }

  _deleteCommentsButtonClickHandler(evt) {
    evt.preventDefault();

    const target = evt.target;

    if (target && target.className !== `film-details__comment-delete`) {
      return;
    }

    const commentId = target.dataset.id;

    this._deleteFilmCommentIndex(commentId);
    this._commentChangeHandler(commentId, null);
  }

  _deleteFilmCommentIndex(id) {
    const filmCommentIndex = this._film.comments.findIndex((it) => it === Number(id));
    this._film.comments = [].concat(this._film.comments.slice(0, filmCommentIndex), this._film.comments.slice(filmCommentIndex + 1));
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

  _setPopupHandler() {
    this._filmPopupComponent.setPopupCloseElementClickHandler(() => {
      this._closePopup();
    });
  }
}

