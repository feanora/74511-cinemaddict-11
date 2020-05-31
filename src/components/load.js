import AbstractComponent from "./abstract-component.js";

const createLoadBlockTemplate = () => {
  return (
    `<section class="films">
      <section class="films-list">
        <h2 class="films-list__title">Loading...</h2>
      </section>
    </section>`
  );
};

export default class Load extends AbstractComponent {

  getTemplate() {
    return createLoadBlockTemplate();
  }
}
