export const DEFAULT_LIMIT_PER_QUERY = 10;
export const MAX_LIMIT_PER_QUERY = 100;
export const ARCHETYPES_QUERIES_ARR = ['name', 'cards', 'offset', 'limit'];
export const CARDS_QUERIES_ARR = [
  'offset',
  'limit',
  'name',
  'archetype',
  'attribute',
  'type',
  'typing',
  'cardtext',
  'pendulumtext',
  'levelorrank',
  'link',
  'atk',
  'def',
];
export const ARCHETYPE_UPDATABLE_PROPERTIES = ['source', 'name', 'coverImg'];
export const CARD_UPDATABLE_PROPERTIES = [
  'cardName',
  'images',
  'cardText',
  'pendulumText',
  'references',
  'dateReleased',
  'type',
  'typing',
  'archetype',
  'attribute',
  'levelOrRank',
  'attack',
  'defense',
];
export const SCHEMA_ERROR_KEYS = [
  'source.domain',
  'source.archetypeUrl',
  'name',
  'cardName',
  'type',
  'typing',
  'cardText',
  'images.imgCropFileName',
  'images.imgFileName',
];
