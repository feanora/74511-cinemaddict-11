import AbstractComponent from "./abstract-component.js";

const createMostCommentedFilmsBlockTemplate = () => {
  return (
    `<section class="films-list--extra">
      <h2 class="films-list__title">Most commented</h2>

      <div class="films-list__container">
      </div>
    </section>`
  );
};

export default class MostCommentedFilmsBlock extends AbstractComponent {
  getTemplate() {
    return createMostCommentedFilmsBlockTemplate();
  }
}
