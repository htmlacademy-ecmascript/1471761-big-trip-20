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


export {
  Mode,
  POINT_COUNT,
  DESTINATION_COUNT,
  OFFER_COUNT,
  TYPES,
  DEFAULT_TYPE,
  FilterType,
};
