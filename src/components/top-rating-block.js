import AbstractComponent from "./abstract-component.js";

const createTopRatingFilmsBlockTemplate = () => {
  return (
    `<section class="films-list--extra">
      <h2 class="films-list__title">Top rated</h2>

      <div class="films-list__container">
      </div>
    </section>`
  );
};

export default class TopRatingFilmsBlock extends AbstractComponent {
  getTemplate() {
    return createTopRatingFilmsBlockTemplate();
  }
}
