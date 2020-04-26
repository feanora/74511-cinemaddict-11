import FilmsBlockComponent from "./components/films-block.js";
import FilterComponent from "./components/filter.js";
import FooterStatisticsComponent from "./components/footer-statistics.js";
import MainMenuComponent from "./components/main-menu.js";
import PageController from "./contorllers/page.js";
import SortComponent from "./components/sort.js";
import UserProfileComponent from "./components/user-profile.js";
import {generateFilmCards} from "./mock/film.js";
import {generateFilters} from "./mock/filter";
import {generateUserProfile} from "./mock/user-profile.js";
import {FilmCardsCount, RenderPosition} from "./const.js";
import {render} from "./utils/render.js";

const renderMainMenu = (mainMenuComponent, filters) => {
  render(mainMenuComponent.getElement(), new FilterComponent(filters), RenderPosition.AFTERBEGIN);
  render(siteMainElement, new SortComponent());
};

const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector((`.main`));
const siteFooterElement = document.querySelector(`.footer`);
const user = generateUserProfile();
const filters = generateFilters();
const films = generateFilmCards(FilmCardsCount.ALL);

render(siteHeaderElement, new UserProfileComponent(user));
const mainMenuComponent = new MainMenuComponent();
render(siteMainElement, mainMenuComponent);
renderMainMenu(mainMenuComponent, filters);

const filmsBlockComponent = new FilmsBlockComponent();
render(siteMainElement, filmsBlockComponent);

const pageController = new PageController(filmsBlockComponent);
pageController.render(films);
render(siteFooterElement, new FooterStatisticsComponent(FilmCardsCount.ALL));
