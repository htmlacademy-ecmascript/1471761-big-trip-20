//import { POINT_COUNT } from '../const.js';
import Observable from '../framework/observable.js';
//import { getRandomPoint } from '../mock/point.js';

export default class PointsModel extends Observable {
  #pointsApiService = null;
  #points = [];
  // #service = null;

  constructor({pointsApiService}) {
    //super();
    //this.#service = service;
    //this.#points = this.#service.getPoints();

    super();
    this.#pointsApiService = pointsApiService;

    this.#pointsApiService.points.then((points) => {
      console.log(points);
      // Есть проблема: cтруктура объекта похожа, но некоторые ключи называются иначе,
      // а ещё на сервере используется snake_case, а у нас camelCase.
      // Можно, конечно, переписать часть нашего клиентского приложения, но зачем?
      // Есть вариант получше - паттерн "Адаптер"
    });
  }


  get() {
    return this.#points;
  }

  getById(id) {
    return this.#points
      .find((point) => point.id === id);
  }

  update(updateType, update) {
    this.#points = this.#pointsApiService.updatePoints(update);
    this._notify(updateType, update);
  }

  add(updateType, point) {
    this.#points = this.#pointsApiService.addPoints(point);
    this._notify(updateType, point);
  }

  deletePoint(updateType, point) {
    this.#points = this.#pointsApiService.deletePoints(point);
    this._notify(updateType, point);
  }
}
