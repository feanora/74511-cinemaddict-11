import API from "./api.js";
import FilmsModel from "./models/films.js";
import FilterController from "./contorllers/filter.js";
import FooterStatisticsComponent from "./components/footer-statistics.js";
import MainMenuComponent from "./components/main-menu.js";
import PageController from "./contorllers/page.js";
import StatisticsComponent from "./components/statistics.js";
import UserProfileComponent from "./components/user-profile.js";
import {AUTHORIZATION, END_POINT, MenuItem} from "./const.js";
import {render} from "./utils/render.js";

const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector((`.main`));
const siteFooterElement = document.querySelector(`.footer`);

const api = new API(END_POINT, AUTHORIZATION);
const filmsModel = new FilmsModel();

const mainMenuComponent = new MainMenuComponent();
render(siteMainElement, mainMenuComponent);

const filterController = new FilterController(mainMenuComponent.getElement(), filmsModel);
filterController.render();

const pageController = new PageController(siteMainElement, filmsModel, api);
pageController.showLoad();

const statisticsComponent = new StatisticsComponent(filmsModel);
render(siteMainElement, statisticsComponent);
statisticsComponent.hide();

mainMenuComponent.setChangeMenuHandler((menuItem) => {
  switch (menuItem) {
    case MenuItem.STATISTICS:
      pageController.hide();
      filterController.deactivateFilterType();
      statisticsComponent.show();
      mainMenuComponent.addStatisticsActiveClass();
      break;
    case MenuItem.FILMS:
      mainMenuComponent.removeStatisticsActiveClass();
      statisticsComponent.hide();
      pageController.show();
      break;
  }
});

api.getFilms()
  .then((films) => {
    filmsModel.setFilms(films);
    render(siteHeaderElement, new UserProfileComponent(filmsModel));
    pageController.hideLoad();
    pageController.render();
    render(siteFooterElement, new FooterStatisticsComponent(filmsModel));
  });


