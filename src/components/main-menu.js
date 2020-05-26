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
