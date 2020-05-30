import FilterComponent from "../components/filter.js";
import {getFilmsByFilter} from "../utils/filter.js";
import {render, replace} from "../utils/render.js";
import {FILTER_NAMES, FilterType, RenderPosition} from "../const.js";

export default class FilterController {
  constructor(container, filmsModel) {
    this._container = container;
    this._filmsModel = filmsModel;

    this._activeFilterType = FilterType.ALL_MOVIES;
    this._filterComponent = null;

    this._dataChangeHandler = this._dataChangeHandler.bind(this);
    this._filterChangeHandler = this._filterChangeHandler.bind(this);

    this._filmsModel.setDataChangeHandler(this._dataChangeHandler);
  }

  render() {
    const container = this._container;
    const allFilms = this._filmsModel.getFilmsAll();
    const filters = Object.values(FilterType).map((filterType, i) => {
      return {
        type: filterType,
        name: FILTER_NAMES[i],
        count: getFilmsByFilter(allFilms, filterType).length,
        isActive: filterType === this._activeFilterType
      };
    });

    const oldComponent = this._filterComponent;

    this._filterComponent = new FilterComponent(filters);
    this._filterComponent.setFilterChangeHandler(this._filterChangeHandler);

    if (oldComponent) {
      replace(this._filterComponent, oldComponent);
    } else {
      render(container, this._filterComponent, RenderPosition.AFTERBEGIN);
    }
  }

  deactivateFilterType() {
    this._activeFilterType = ``;
    this._dataChangeHandler();
  }

  _filterChangeHandler(filterType) {
    this._filmsModel.setFilter(filterType);
    this._activeFilterType = filterType;
    this._dataChangeHandler();
  }

  _dataChangeHandler() {
    this.render();
  }
}
