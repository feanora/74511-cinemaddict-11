import AbstractComponent from "./abstract-component.js";

const createFilmsBlockTemplate = () => {
  return (
    `<section class="films">
    </section>`
  );
};

export default class FilmsBlock extends AbstractComponent {

  getTemplate() {
    return createFilmsBlockTemplate();
  }
}
