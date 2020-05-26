import FilterController from "./contorllers/filter.js";
import FooterStatisticsComponent from "./components/footer-statistics.js";
import MainMenuComponent from "./components/main-menu.js";
import FilmsModel from "./models/films.js";
import CommentsModel from "./models/comments.js";
import PageController from "./contorllers/page.js";
import StatisticsComponent from "./components/statistics.js";
import UserProfileComponent from "./components/user-profile.js";
import {generateFilmCards} from "./mock/film.js";
import {FilmCardsCount, COMMENTS_COUNT} from "./const.js";
import {render} from "./utils/render.js";
import {generateComments} from "./mock/comment.js";
import {MenuItem} from "./const";

const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector((`.main`));
const siteFooterElement = document.querySelector(`.footer`);

const films = generateFilmCards(FilmCardsCount.ALL);
const filmsModel = new FilmsModel();
filmsModel.setFilms(films);

const comments = generateComments(COMMENTS_COUNT);
const commentsModel = new CommentsModel();
commentsModel.setComments(comments);

render(siteHeaderElement, new UserProfileComponent(filmsModel));
const mainMenuComponent = new MainMenuComponent();
render(siteMainElement, mainMenuComponent);

const filterController = new FilterController(mainMenuComponent.getElement(), filmsModel);
filterController.render();

const pageController = new PageController(siteMainElement, filmsModel, commentsModel);
pageController.render(films);

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

