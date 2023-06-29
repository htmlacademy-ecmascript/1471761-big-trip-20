import dayjs from 'dayjs';
const POINT_COUNT = 7;
const DESTINATION_COUNT = 7;
const OFFER_COUNT = 7;

//const DEFAULT_DATETIME_FORMAT = 'YYYY-MM-DDTHH:mm:ss';

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

const EVENT_TYPES_LIST = Object.values(TYPES);

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


const EnabledSortType = {
  [SortType.DAY]: true,
  [SortType.EVENT]: false,
  [SortType.TIME]: true,
  [SortType.PRICE]: true,
  [SortType.OFFERS]: false
};

const EMPTY_POINT = {
  basePrice: 0,
  dateFrom: dayjs().format('YYYY-MM-DD HH:MM'),
  dateTo: dayjs().add(1, 'week').format('YYYY-MM-DD HH:MM'),
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
  EVENT_TYPES_LIST,
  EnabledSortType,
  SortType,
  Mode,
  POINT_COUNT,
  DESTINATION_COUNT,
  OFFER_COUNT,
  TYPES,
  DEFAULT_TYPE,
  FilterType,
  DEFAULT_SORT_TYPE,
  DEFAULT_DATETIME_FORMAT
};
