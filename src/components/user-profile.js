import AbstractComponent from "./abstract-component.js";

const createUserRatingTemplate = (user) => {
  const {rating, avatar} = user;
  return (
    `<section class="header__profile profile">
    <p class="profile__rating">${rating}</p>
    <img class="profile__avatar" src="${avatar}" alt="Avatar" width="35" height="35">
  </section>`
  );
};

export default class UserProfile extends AbstractComponent {
  constructor(user) {
    super();
    this._user = user;
  }

  getTemplate() {
    return createUserRatingTemplate(this._user);
  }
}
