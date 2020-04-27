import AbstractComponent from "./abstract-component.js";

const createMainMenuTemplate = () => {
  return (
    `<nav class="main-navigation">

      <a href="#stats" class="main-navigation__additional">Stats</a>
    </nav>`
  );
};

export default class MainMenu extends AbstractComponent {
  getTemplate() {
    return createMainMenuTemplate();
  }
}
