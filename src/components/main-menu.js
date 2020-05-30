import AbstractComponent from "./abstract-component.js";
import {MenuItem} from "../const.js";

const createMainMenuTemplate = () => {
  return (
    `<nav class="main-navigation">

      <a href="#stats" data-menu="${MenuItem.STATISTICS}" class="main-navigation__additional">Stats</a>
    </nav>`
  );
};

export default class MainMenu extends AbstractComponent {
  getTemplate() {
    return createMainMenuTemplate();
  }

  addStatisticsActiveClass() {
    const activeItem = this.getElement().querySelector(`.main-navigation__additional`);
    activeItem.classList.add(`main-navigation__additional--active`);
  }

  removeStatisticsActiveClass() {
    const activeItem = this.getElement().querySelector(`.main-navigation__additional`);
    activeItem.classList.remove(`main-navigation__additional--active`);
  }

  setChangeMenuHandler(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      if (evt.target.tagName === `A` || evt.target.parentElement.tagName === `A`) {
        evt.preventDefault();
        const activeMenuItem = evt.target.dataset.menu;
        handler(activeMenuItem);
      }
    });
  }
}
