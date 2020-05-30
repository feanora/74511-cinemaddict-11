import CommentsComponent from "../components/comments.js";
import FilmCardComponent from "../components/film-card.js";
import FilmModel from "../models/film.js";
import FilmPopupComponent from "../components/film-popup.js";
import NewCommentComponent from "../components/new-comment.js";
import {remove, render, replace} from "../utils/render.js";
import {shake} from "../utils/common.js";
import {ButtonText, RenderPosition, Mode, SHAKE_ANIMATION_TIMEOUT} from "../const.js";
import {encode} from "he";

export default class FilmController {
  constructor(container, commentsModel, dataChangeHandler, viewChangeHandler, api, filmsModel) {
    this._container = container;
    this._commentsModel = commentsModel;
    this._filmsModel = filmsModel;
    this._api = api;

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
    this._setPopupHandlers(film);

    if (oldFilmCardComponent && oldFilmPopupComponent) {
      replace(this._filmCardComponent, oldFilmCardComponent);
      replace(this._filmPopupComponent, oldFilmPopupComponent);
      this._renderCommentsBlock();
      this._filmPopupComponent.recoveryListeners();
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
    this._rerenderCommentsBlock();
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
    this._newCommentComponent.reset();

    this._setCommentBlockHandlers();
  }

  _getFilmComments(comments) {
    return this._film.comments.map((it) => comments.find((comment) => comment.id === it));
  }

  _rerenderCommentsBlock() {
    if (this._commentsComponent) {
      remove(this._commentsComponent);
    }
    this._renderCommentsBlock();
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
    this._dataChangeHandler(this, this._film, this._film, this._mode);
  }

  _commentChangeHandler(oldData, newData) {
    if (newData === null) {
      const isSuccess = this._commentsModel.deleteComment(oldData);
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

  _commentSubmitHandler(evt) {
    const isCtrlCommandPlusEnter = evt.ctrlKey && evt.key === `Enter` || evt.metaKey && evt.key === `Enter`;
    if (isCtrlCommandPlusEnter) {
      const newCommentEmotionElement = this._newCommentComponent.getElement().querySelector(`.film-details__add-emoji-label img`);
      const newCommentTextValue = this._newCommentComponent.getElement().querySelector(`.film-details__comment-input`).value;
      const sanitizedCommentText = encode(newCommentTextValue);
      const IMG_ALT_PREFIX = `emoji-`;

      if (!newCommentEmotionElement || sanitizedCommentText.length === 0) {
        return;
      }

      const newComment = {
        comment: sanitizedCommentText,
        date: new Date(),
        emotion: newCommentEmotionElement.alt.substring(IMG_ALT_PREFIX.length)
      };

      const target = evt.target;
      target.disabled = true;
      target.style.border = `none`;

      this._api.addComment(newComment, this._film)
        .then((data) => {
          this._film.comments = data.movie.comments;
          const commentsList = data.comments;
          this._filmsModel.updateFilm(this._film.id, data.movie);
          this._commentChangeHandler(null, commentsList);
        })
        .catch(() => {
          target.disabled = false;
          shake(this._newCommentComponent.getElement(), SHAKE_ANIMATION_TIMEOUT);
          target.style.border = `3px solid red`;
        });
    }
  }

  _deleteCommentsButtonClickHandler(evt) {
    evt.preventDefault();

    const target = evt.target;

    if (target && target.className !== `film-details__comment-delete`) {
      return;
    }

    const commentId = target.dataset.id;
    target.textContent = ButtonText.DELETING;
    target.disabled = true;

    const filmCommentIndex = this._film.comments.findIndex((it) => it === (commentId));

    this._api.deleteComment(commentId)
      .then(() => {
        this._film.comments = [].concat(this._film.comments.slice(0, filmCommentIndex), this._film.comments.slice(filmCommentIndex + 1));

        const updatedFilm = FilmModel.clone(this._film);
        updatedFilm.comments = this._film.comments;
        this._filmsModel.updateFilm(this._film.id, updatedFilm);

        this._commentChangeHandler(commentId, null);
      })
      .catch(() => {
        target.textContent = ButtonText.DELETE;
        target.disabled = false;
        shake(this._commentsComponent.getElement().querySelectorAll(`.film-details__comment`)[filmCommentIndex], SHAKE_ANIMATION_TIMEOUT);
      });
  }

  _popupEscKeyDownHandler(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;
    if (isEscKey) {
      this._closePopup();
    }
  }

  _setFilmCardChangeHandlers(film) {
    this._filmCardComponent.setAddWatchListButtonClickHandler((evt) => {
      evt.preventDefault();
      const updatedFilm = FilmModel.clone(film);
      updatedFilm.watchlist = !film.watchlist;
      this._dataChangeHandler(this, film, updatedFilm, this._mode);
    });

    this._filmCardComponent.setWatchedButtonClickHandler((evt) => {
      evt.preventDefault();
      const updatedFilm = FilmModel.clone(film);
      updatedFilm.alreadyWatched = !film.alreadyWatched;
      updatedFilm.watchingDate = film.watchingDate ? new Date() : null;
      this._dataChangeHandler(this, film, updatedFilm, this._mode);
    });

    this._filmCardComponent.setFavoriteButtonClickHandler((evt) => {
      evt.preventDefault();
      const updatedFilm = FilmModel.clone(film);
      updatedFilm.favorite = !film.favorite;
      this._dataChangeHandler(this, film, updatedFilm, this._mode);
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

  _setPopupHandlers(film) {
    this._filmPopupComponent.setPopupCloseElementClickHandler(() => {
      this._closePopup();
    });
    this._setPopupChangeHandlers(film);
  }

  _setPopupChangeHandlers(film) {
    this._filmPopupComponent.setAddWatchListButtonChangeHandler((evt) => {
      evt.preventDefault();
      const updatedFilm = FilmModel.clone(film);
      updatedFilm.watchlist = !film.watchlist;
      this._dataChangeHandler(this, film, updatedFilm, this._mode);
    });

    this._filmPopupComponent.setWatchedButtonChangeHandler((evt) => {
      evt.preventDefault();
      const updatedFilm = FilmModel.clone(film);
      updatedFilm.alreadyWatched = !film.alreadyWatched;
      updatedFilm.watchingDate = film.watchingDate ? new Date() : null;
      this._dataChangeHandler(this, film, updatedFilm, this._mode);
    });

    this._filmPopupComponent.setFavoriteButtonChangeHandler((evt) => {
      evt.preventDefault();
      const updatedFilm = FilmModel.clone(film);
      updatedFilm.favorite = !film.favorite;
      this._dataChangeHandler(this, film, updatedFilm, this._mode);
    });
  }

  _setCommentBlockHandlers() {
    this._commentsComponent.setDeleteCommentButtonClickHandler((evt) => {
      this._deleteCommentsButtonClickHandler(evt);
    });

    this._newCommentComponent.setCommentSubmitHandler((evt) => {
      this._commentSubmitHandler(evt);
    });
  }
}

