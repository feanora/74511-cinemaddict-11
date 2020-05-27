import API from "./api.js";
import CommentsModel from "./models/comments.js";
import FilmsModel from "./models/films.js";
import FilterController from "./contorllers/filter.js";
import FooterStatisticsComponent from "./components/footer-statistics.js";
import MainMenuComponent from "./components/main-menu.js";
import PageController from "./contorllers/page.js";
import StatisticsComponent from "./components/statistics.js";
import UserProfileComponent from "./components/user-profile.js";
import {AUTHORIZATION, COMMENTS_COUNT, MenuItem} from "./const.js";
import {render} from "./utils/render.js";
import {generateComments} from "./mock/comment.js";

const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector((`.main`));
const siteFooterElement = document.querySelector(`.footer`);

const api = new API(AUTHORIZATION);
const filmsModel = new FilmsModel();

const comments = generateComments(COMMENTS_COUNT);
const commentsModel = new CommentsModel();
commentsModel.setComments(comments);

render(siteHeaderElement, new UserProfileComponent(filmsModel));
const mainMenuComponent = new MainMenuComponent();
render(siteMainElement, mainMenuComponent);

const filterController = new FilterController(mainMenuComponent.getElement(), filmsModel);
filterController.render();

const pageController = new PageController(siteMainElement, filmsModel, commentsModel);

const statisticsComponent = new StatisticsComponent(filmsModel);
render(siteMainElement, statisticsComponent);
statisticsComponent.hide();

render(siteFooterElement, new FooterStatisticsComponent(filmsModel));

mainMenuComponent.setChangeMenuHandler((menuItem) => {
  switch (menuItem) {
    case MenuItem.STATISTICS:
      pageController.hide();
      statisticsComponent.show();
      break;
    case MenuItem.FILMS:
      statisticsComponent.hide();
      pageController.show();
      break;
  }
});

api.getFilms()
  .then((films) => {
    filmsModel.setFilms(films);
    pageController.render(films);
  });

