// Array of layers.
export const UNTD_LAYERS = [
  {
    id: `county`,
    label: `UI_MAP_LAYERS_COUNTIES`,
    types: [`polygons`],
    tooltip: null,
    only_one: true,
    only_one_name: `basic_geo`,
    group: 0,
    index: 0,
    place_type: `County`,
  },
  {
    id: `zip`,
    label: `UI_MAP_LAYERS_ZIPS`,
    types: [`polygons`],
    tooltip: null,
    only_one: true,
    only_one_name: `basic_geo`,
    group: 0,
    index: 1,
    place_type: `Zip`,
  },
  {
    id: `tract`,
    label: `UI_MAP_LAYERS_TRACTS`,
    types: [`polygons`],
    tooltip: null,
    only_one: true,
    only_one_name: `basic_geo`,
    group: 0,
    index: 2,
    place_type: `Tract`,
  },
  {
    id: `place`,
    label: `UI_MAP_LAYERS_PLACES`,
    types: [`polygons`],
    tooltip: null,
    only_one: true,
    only_one_name: `basic_geo`,
    group: 0,
    index: 3,
    place_type: `Place`,
  },
]

export const POINT_CATEGORIES = [
  {
    id: `social_infrastructure`,
    subcategories: [],
  },
  {
    id: `commerce`,
    subcategories: [],
  },
  {
    id: `school`,
    subcategories: [
      'public_school',
      'private_school',
      'charter_school',
    ],
  },
  {
    id: `public_health`,
    subcategories: [],
  },
]

export const POINT_ICON_MAP = [
  {
    id: `carrot`,
    types: ['snap'],
  },
  {
    id: `book`,
    types: ['lib'],
  },
  {
    id: `rec`,
    types: ['recctr'],
  },
  {
    id: `bank`,
    types: ['bank', 'crunion'],
  },
  {
    id: `cru`,
    types: ['crunion'],
  },
  {
    id: `cart`,
    types: ['market'],
  },
  {
    id: `childcare`,
    types: ['aftersch', 'scc', 'uscc'],
  },
  {
    id: `community`,
    types: ['comcen'],
  },
  {
    id: `health`,
    types: ['pharm', 'comhel'],
  },
  {
    id: `home`,
    types: ['generic'],
  },
  {
    id: `wic`,
    types: ['wic'],
  },
  {
    id: `spube`,
    types: ['ies'],
  },
  {
    id: `spubm`,
    types: ['ims'],
  },
  {
    id: `spubh`,
    types: ['his'],
  },
  {
    id: `sprivate`,
    types: ['prs'],
  },
  {
    id: `scharter`,
    types: ['ces', 'cms', 'chs'],
  },
]

export const BREAKPOINTS = [
  {
    id: 'xs',
    max: 0,
  },
  {
    id: 'sm',
    max: 320,
  },
  {
    id: 'md',
    max: 768,
  },
  {
    id: 'lg',
    max: 992,
  },
  {
    id: 'xl',
    max: 1280,
  },
]
