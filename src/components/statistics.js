import AbstractSmartComponent from "./abstract-smart-component.js";
import {getUserRating} from "../utils/common.js";
import {getWatchedFilms} from "../utils/filter.js";
import {STATISTICS_FILTER_NAMES, StatisticsFilterType} from "../const.js";
import Chart from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import moment from "moment";

const getTotalDuration = (films) => {
  return films.reduce((acc, film) => {
    return acc + film.runtime;
  }, 0);
};

const isUniqueItem = (item, index, items) => items.indexOf(item) === index;

const getAllGenresAllFilms = (films) => {
  return films.reduce((acc, film) => {
    acc = acc.concat(film.genres);
    return acc;
  }, []);
};

const getUniqueGenres = (allGenres) => allGenres.filter(isUniqueItem);

const getFilmCountOfEachGenre = (uniqueGenres, allGenres) => {
  return uniqueGenres.map((genre) => {
    return {
      genre,
      count: allGenres.filter((it) => it === genre).length
    };
  }).sort((a, b) => b.count - a.count);
};

const createStatisticsFilterMarkup = (statisticsFilter) => {
  const {type, name, checked} = statisticsFilter;
  const isChecked = checked ? `checked` : ``;

  return (
    `<input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-${type}" value="${type}" ${isChecked}>
     <label for="statistic-${type}" class="statistic__filters-label">${name}</label>`
  );
};

const createStatisticsFilterTemplate = (activeFilter) => {
  const statisticsFilters = Object.values(StatisticsFilterType).map((statisticsFilterType, i) => {
    return {
      type: statisticsFilterType,
      name: STATISTICS_FILTER_NAMES[i],
      checked: statisticsFilterType === activeFilter
    };
  });

  const statisticsFiltersMarkup = statisticsFilters.map((statisticsFilter) => createStatisticsFilterMarkup(statisticsFilter)).join(``);

  return (
    `<form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
      <p class="statistic__filters-description">Show stats:</p>
      ${statisticsFiltersMarkup}
    </form>`
  );
};

const getWatchedFilmsCount = (films) => getWatchedFilms(films).length;

const createStatisticsTemplate = (films, activeFilter) => {
  const watchedFilmsCount = getWatchedFilmsCount(films);
  const userRank = getUserRating(watchedFilmsCount);

  const totalDuration = moment.duration(getTotalDuration(films), `minutes`);
  const totalHoursCount = Math.floor(totalDuration.asHours());
  const totalMinutesCount = totalDuration.minutes();

  const uniqueGenres = getUniqueGenres(getAllGenresAllFilms(films));
  const allGenres = getAllGenresAllFilms(films);
  const filmsCountOfEachGenre = getFilmCountOfEachGenre(uniqueGenres, allGenres);
  const topGenre = filmsCountOfEachGenre[0][`genre`] || ``;

  return (
    `<section class="statistic">
    <p class="statistic__rank">
      Your rank
      <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
      <span class="statistic__rank-label">${userRank}</span>
    </p>

       ${createStatisticsFilterTemplate(activeFilter)}

    <ul class="statistic__text-list">
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">You watched</h4>
        <p class="statistic__item-text">${watchedFilmsCount} <span class="statistic__item-description">movies</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Total duration</h4>
        <p class="statistic__item-text">${totalHoursCount} <span class="statistic__item-description">h</span> ${totalMinutesCount} <span class="statistic__item-description">m</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Top genre</h4>
        <p class="statistic__item-text">${topGenre}</p>
      </li>
    </ul>

    <div class="statistic__chart-wrap">
      <canvas class="statistic__chart" width="1000"></canvas>
    </div>

  </section>`
  );
};

const getFilmsByStatisticsFilter = (films, statisticsFilterType) => {
  switch (statisticsFilterType) {
    case StatisticsFilterType.ALL:
      return films;
    case StatisticsFilterType.TODAY:
      return films.filter((film) => moment(film.watchingDate).isSame(moment(), `day`));
    case StatisticsFilterType.WEEK:
      return films.filter((film) => moment(film.watchingDate).isAfter(moment().subtract(7, `days`)));
    case StatisticsFilterType.MONTH:
      return films.filter((film) => moment(film.watchingDate).isAfter(moment().subtract(1, `months`)));
    case StatisticsFilterType.YEAR:
      return films.filter((film) => moment(film.watchingDate).isAfter(moment().subtract(1, `years`)));
  }
  return films;
};

const renderChart = (statisticCtx, films) => {
  const BAR_HEIGHT = 50;
  const uniqueGenres = getUniqueGenres(getAllGenresAllFilms(films));
  const allGenres = getAllGenresAllFilms(films);
  const filmsCountOfEachGenre = getFilmCountOfEachGenre(uniqueGenres, allGenres);
  statisticCtx.height = BAR_HEIGHT * filmsCountOfEachGenre.length;

  return new Chart(statisticCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: filmsCountOfEachGenre.map((it) => it.genre),
      datasets: [{
        data: filmsCountOfEachGenre.map((it) => it.count),
        backgroundColor: `#ffe800`,
        hoverBackgroundColor: `#ffe800`,
        anchor: `start`
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 20
          },
          color: `#ffffff`,
          anchor: `start`,
          align: `start`,
          offset: 40,
        }
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#ffffff`,
            padding: 100,
            fontSize: 20
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          barThickness: 24
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false
      }
    }
  });
};

export default class Statistics extends AbstractSmartComponent {
  constructor(filmsModel) {
    super();

    this._filmsModel = filmsModel;
    this._activeStatisticsFilm = StatisticsFilterType.ALL;

    this._chart = null;
    this._renderChart();

    this._setFilterChangeHandler();
  }

  getTemplate() {
    return createStatisticsTemplate(this._filmsModel.getFilmsAll(), this._activeStatisticsFilm);
  }

  recoveryListeners() {
    this._setFilterChangeHandler();
  }

  rerender() {
    super.rerender();

    this._renderChart();
  }

  show() {
    super.show();

    this._activeStatisticsFilm = StatisticsFilterType.ALL;

    this.rerender();
  }

  _renderChart() {
    const statisticCtx = this.getElement().querySelector(`.statistic__chart`);
    const watchedFilms = getWatchedFilms(this._filmsModel.getFilmsAll());
    const films = getFilmsByStatisticsFilter(watchedFilms, this._activeStatisticsFilm);

    this._resetChart();
    this._chart = renderChart(statisticCtx, films);
  }

  _resetChart() {
    if (this._chart) {
      this._chart.destroy();
      this._chart = null;
    }
  }

  _setFilterChangeHandler() {
    this.getElement().querySelector(`.statistic__filters`).addEventListener(`change`, (evt) => {
      if (evt.target.tagName !== `INPUT`) {
        return;
      }
      this._activeStatisticsFilm = evt.target.value;
      this.rerender();
    });
  }
}
