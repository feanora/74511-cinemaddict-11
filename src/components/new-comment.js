import AbstractSmartComponent from "./abstract-smart-component.js";
import {EMOJIS} from "../const";

const createAddEmojiMarkup = (emotion) => {
  return emotion ? `<img src="images/emoji/${emotion}.png" width="55" height="55" alt="emoji-${emotion}">` : ``;
};

const createEmojiListMarkup = () => {
  return EMOJIS.map((emotion) => {
    return (
      `<input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-${emotion}" value="${emotion}">
        <label class="film-details__emoji-label" for="emoji-${emotion}">
          <img src="./images/emoji/${emotion}.png" width="30" height="30" alt="emoji">
        </label>`
    );
  }).join(`\n`);
};

const createNewCommentTemplate = (emotion) => {
  return (
    `<div class="film-details__new-comment">
        <div for="add-emoji" class="film-details__add-emoji-label">
        ${createAddEmojiMarkup(emotion)}
        </div>

        <label class="film-details__comment-label">
        <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
        </label>

        <div class="film-details__emoji-list">
        ${createEmojiListMarkup()}
        </div>
    </div>`
  );
};

export default class NewComment extends AbstractSmartComponent {
  constructor() {
    super();
    // this._emotion = emotion;
    this._emotion = ``;
    this._subscribeOnEvents();
  }

  getTemplate() {
    return createNewCommentTemplate(this._emotion);
  }

  rerender() {
    super.rerender();
  }

  recoveryListeners() {
    this._subscribeOnEvents();
  }

  reset() {
    this.rerender();
    this._emotion = ``;
  }

  _subscribeOnEvents() {
    const element = this.getElement();
    element.querySelector(`.film-details__emoji-list`).addEventListener(`change`, (evt) => {
      this._emotion = evt.target.value;
      this.rerender();
    });
  }
}
