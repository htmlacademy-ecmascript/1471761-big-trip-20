import { nanoid } from 'nanoid';

const POINT_COUNT = 10;
const DESTINATION_COUNT = 10;
const OFFER_COUNT = 10;

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

const OFFERS_OPTIONS = [
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

const EnabledSortType = {
  [SortType.DAY]: true,
  [SortType.EVENT]: false,
  [SortType.TIME]: true,
  [SortType.PRICE]: true,
  [SortType.OFFERS]: false
};

const BLANK_DESTINATION = {
  id: 0,
  name: '',
  description: '',
  pictures: [],
};

const BLANK_OFFER = {
  type: '',
  offers: [],
};


export {
  BLANK_DESTINATION,
  BLANK_OFFER,
  OFFERS_OPTIONS,
  EnabledSortType,
  SortType,
  Mode,
  POINT_COUNT,
  DESTINATION_COUNT,
  OFFER_COUNT,
  TYPES,
  DEFAULT_TYPE,
  FilterType,
};
