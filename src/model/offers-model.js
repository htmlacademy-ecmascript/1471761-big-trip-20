export default class OffersModel {
  #offers = [];
  #service = null;

  constructor(service) {
    this.#service = service;
    //this.#offers = this.#service.getOffers();
  }

  async init() {
    this.#offers = await this.#service.getOffers();
    return this.#offers;
  }

  get() {
    return this.#offers;
  }

  getByType(type) {
    return this.#offers
      .find((offer) => offer.type === type).offers;
  }
}
