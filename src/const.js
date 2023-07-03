const DEFAULT_DATETIME_FORMAT = 'DD/MM/YY HH:mm';

const TYPES = [
  'taxi',
  'bus',
  'ship',
  'drive',
  'flight',
  'check-in',
  'sightseeing',
  'restaurant'
];

const OFFERS = [
  'Order Uber',
  'Add luggage',
  'Switch to comfort',
  'Rent a car',
  'Add breakfast',
  'Book tickets',
  'Lunch in city',
];

const DEFAULT_TYPE = 'flight';

const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PRESENT: 'present',
  PAST: 'past'
};

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

const SortType = {
  DAY: 'day',
  EVENT: 'event',
  TIME: 'time',
  PRICE: 'price',
  OFFERS: 'offers',
};


const DEFAULT_SORT_TYPE = 'DAY';


const EMPTY_POINT = {
  basePrice: 0,
  dateFrom: new Date,
  dateTo: new Date,
  destination: null,
  isFavorite: true,
  offers: [],
  type: DEFAULT_TYPE,
};

const UserAction = {
  UPDATE_POINT: 'UPDATE_POINT',
  ADD_POINT: 'ADD_POINT',
  DELETE_POINT: 'DELETE_POINT',
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',

};

const EditingType = {
  EDITING: 'EDITING',
  CREATING: 'CREATING'
};

const Method = {
  GET: 'GET',
  PUT: 'PUT',
};

export {
  Method,
  EditingType,
  UserAction,
  UpdateType,
  EMPTY_POINT,
  OFFERS,
  SortType,
  Mode,
  TYPES,
  DEFAULT_TYPE,
  FilterType,
  DEFAULT_SORT_TYPE,
  DEFAULT_DATETIME_FORMAT
};
