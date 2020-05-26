import AbstractComponent from "./abstract-component.js";
import {getUserRating} from "../utils/common.js";
import {USER_AVATAR_PATH} from "../const";
import {getWatchedFilms} from "../utils/filter.js";

const createUserRatingTemplate = (watchedFilmsCount) => {
  const rating = getUserRating(watchedFilmsCount);
  const avatar = USER_AVATAR_PATH;

  return (
    `<section class="header__profile profile">
    <p class="profile__rating">${rating}</p>
    <img class="profile__avatar" src="${avatar}" alt="Avatar" width="35" height="35">
  </section>`
  );
};

export default class UserProfile extends AbstractComponent {
  constructor(filmsModel) {
    super();
    this._filmsModel = filmsModel;
  }

  getTemplate() {
    return createUserRatingTemplate(getWatchedFilms(this._filmsModel.getFilmsAll()).length);
  }
}
