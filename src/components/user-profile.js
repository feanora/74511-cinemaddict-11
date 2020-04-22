import {createElement} from "../util.js";

const createUserRatingTemplate = (user) => {
  const {rating, avatar} = user;
  return (
    `<section class="header__profile profile">
    <p class="profile__rating">${rating}</p>
    <img class="profile__avatar" src="${avatar}" alt="Avatar" width="35" height="35">
  </section>`
  );
};

export default class UserProfile {
  constructor(user) {
    this._user = user;
    this._element = null;
  }

  getTemplate() {
    return createUserRatingTemplate(this._user);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }
    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
