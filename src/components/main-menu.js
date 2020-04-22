import {createElement} from "../util.js";

const createMainMenuTemplate = () => {
  return (
    `<nav class="main-navigation">

      <a href="#stats" class="main-navigation__additional">Stats</a>
    </nav>`
  );
};

export default class MainMenu {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createMainMenuTemplate();
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
