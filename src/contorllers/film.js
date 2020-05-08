import {generateComments} from "../mock/comment";
import {remove, render} from "../utils/render";
import CommentComponent from "../components/comment";
import FilmCardComponent from "../components/film-card";
import FilmPopupComponent from "../components/film-popup";
import {RenderPosition} from "../const";

const renderComments = (film, commentsContainer) => {
  const comments = generateComments(film.commentsCount);
  comments.slice(0, comments.length).forEach((comment) => {
    render(commentsContainer, new CommentComponent(comment));
  });
};

export default class FilmController {
  constructor(container) {
    this._container = container;
    this._filmCardComponent = null;
    this._filmPopupComponent = null;
    this._popupEscKeyDownHandler = this._popupEscKeyDownHandler.bind(this);
  }

  render(film) {
    this._filmCardComponent = new FilmCardComponent(film);
    this._filmPopupComponent = new FilmPopupComponent(film);
    render(this._container, this._filmCardComponent);

    this._filmCardComponent.setFilmCardElementsClickHandler((evt) => {
      const target = evt.target.closest(`.film-card__poster, .film-card__title, .film-card__comments`);
      if (target) {
        this._renderPopup(film);
      }
    });
  }

  _renderPopup(film) {
    const siteFooterElement = document.querySelector(`.footer`);
    render(siteFooterElement, this._filmPopupComponent, RenderPosition.AFTEREND);
    const commentsContainerElement = this._filmPopupComponent.getElement().querySelector(`.film-details__comments-list`);
    renderComments(film, commentsContainerElement);
    this._filmPopupComponent.setPopupCloseElementClickHandler(() => {
      this._closePopup();
    });
    document.addEventListener(`keydown`, this._popupEscKeyDownHandler);
    return this._filmPopupComponent;
  }

  _closePopup() {
    document.removeEventListener(`keydown`, this._popupEscKeyDownHandler);
    remove(this._filmPopupComponent);
  }

  _popupEscKeyDownHandler(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;
    if (isEscKey) {
      this._closePopup();
    }
  }

}
