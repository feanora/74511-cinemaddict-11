import AbstractSmartComponent from "./abstract-smart-component.js";
import moment from "moment";

const createCommentsMarkup = (comments) => {
  return comments.map((comment) => {
    const {id, author, comment: text, date, emotion} = comment;
    const commentDate = moment(date).fromNow();
    return (
      `<li class="film-details__comment">
        <span class="film-details__comment-emoji">
          <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji-${emotion}">
        </span>
        <div>
          <p class="film-details__comment-text">${text}</p>
          <p class="film-details__comment-info">
            <span class="film-details__comment-author">${author}</span>
            <span class="film-details__comment-day">${commentDate}</span>
            <button class="film-details__comment-delete" data-id="${id}">Delete</button>
          </p>
        </div>
      </li>`
    );
  }).join(`\n`);
};

const getCommentsTitle = (commentsCount) => commentsCount > 1 ? `Comments` : `Comment`;
const createCommentsTemplate = (comments) => {
  const commentsCount = comments.length;
  const commentsTitle = getCommentsTitle(commentsCount);
  const commentsList = createCommentsMarkup(comments);
  return (
    `<div class="form-details__bottom-container">
        <section class="film-details__comments-wrap">
            <h3 class="film-details__comments-title">${commentsTitle} <span class="film-details__comments-count">${commentsCount}</span></h3>

            <ul class="film-details__comments-list">
              ${commentsList}
            </ul>

        </section>
    </div>`
  );
};

export default class Comments extends AbstractSmartComponent {
  constructor(comments) {
    super();

    this._comments = comments;

    this._deleteCommentsButtonClickHandler = null;
  }

  getTemplate() {
    return createCommentsTemplate(this._comments);
  }

  recoveryListeners() {
    this.setDeleteCommentButtonClickHandler(this._deleteCommentsButtonClickHandler);
  }

  rerender() {
    super.rerender();
  }

  setDeleteCommentButtonClickHandler(handler) {
    this.getElement().querySelector(`.film-details__comments-list`).addEventListener(`click`, handler);
    this._deleteCommentsButtonClickHandler = handler;
  }
}

