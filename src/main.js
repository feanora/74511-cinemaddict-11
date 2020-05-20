import FilterComponent from "./components/filter.js";
import FooterStatisticsComponent from "./components/footer-statistics.js";
import MainMenuComponent from "./components/main-menu.js";
import FilmsModel from "./models/films.js";
import CommentsModel from "./models/comments.js";
import PageController from "./contorllers/page.js";
import UserProfileComponent from "./components/user-profile.js";
import {generateFilmCards} from "./mock/film.js";
import {generateFilters} from "./mock/filter.js";
import {generateUserProfile} from "./mock/user-profile.js";
import {COMMENTS_COUNT, FilmCardsCount, RenderPosition} from "./const.js";
import {render} from "./utils/render.js";
import {generateComments} from "./mock/comment.js";

const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector((`.main`));
const siteFooterElement = document.querySelector(`.footer`);

const user = generateUserProfile();
const filters = generateFilters();

const comments = generateComments(COMMENTS_COUNT);
const commentsModel = new CommentsModel();
commentsModel.setComments(comments);

const films = generateFilmCards(FilmCardsCount.ALL);
const filmsModel = new FilmsModel();
filmsModel.setFilms(films);

render(siteHeaderElement, new UserProfileComponent(user));
const mainMenuComponent = new MainMenuComponent();
render(siteMainElement, mainMenuComponent);
render(mainMenuComponent.getElement(), new FilterComponent(filters), RenderPosition.AFTERBEGIN);

const pageController = new PageController(siteMainElement, filmsModel, commentsModel);
pageController.render(films);

render(siteFooterElement, new FooterStatisticsComponent(FilmCardsCount.ALL));
