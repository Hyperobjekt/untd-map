// Array of layers with statistics attached.
export const UNTD_LAYERS = [
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

// Static layers without statistics attached.
export const UNTD_STATIC_LAYERS = [
  {
    id: `county`,
    label: `UI_MAP_LAYERS_COUNTIES`,
    types: [`polygons`],
    tooltip: null,
    only_one: true,
    only_one_name: `static_geo`,
    group: 0,
    index: 0,
    place_type: `County`,
    has_labels: 0,
    label_key: 'NAME',
  },
  {
    id: `fedcongress`,
    label: `UI_MAP_FEATURE_FEDCONGRESS`,
    types: [`polygons`],
    tooltip: null,
    only_one: true,
    only_one_name: `static_geo`,
    group: 0,
    index: 0,
    place_type: `label`,
    has_labels: 1,
    label_key: 'Official',
  },
  {
    id: `statehouse`,
    label: `UI_MAP_FEATURE_STATEHOUSE`,
    types: [`polygons`],
    tooltip: null,
    only_one: true,
    only_one_name: `static_geo`,
    group: 0,
    index: 0,
    place_type: `label`,
    has_labels: 1,
    label_key: 'Official',
  },
  {
    id: `statesenate`,
    label: `UI_MAP_FEATURE_STATESENATE`,
    types: [`polygons`],
    tooltip: null,
    only_one: true,
    only_one_name: `static_geo`,
    group: 0,
    index: 0,
    place_type: `label`,
    has_labels: 1,
    label_key: 'Official',
  },
  {
    id: `schooldistricts`,
    label: `UI_MAP_FEATURE_SCHOOLDISTRICTS`,
    types: [`polygons`],
    tooltip: null,
    only_one: true,
    only_one_name: `static_geo`,
    group: 0,
    index: 0,
    place_type: `label`,
    has_labels: 1,
    label_key: 'NAME',
  },
]

export const POINT_CATEGORIES = [
  {
    id: `social_infrastructure`,
    subcategories: [],
    color: `rgba(154,85,142,1)`,
  },
  {
    id: `commerce`,
    subcategories: [],
    color: `rgba(73,81,94,1)`,
  },
  {
    id: `school`,
    subcategories: [
      'public_school',
      'private_school',
      'charter_school',
    ],
    color: `rgba(145,75,13,1)`,
  },
  {
    id: `public_health`,
    subcategories: [],
    color: `rgba(219,134,48,1)`,
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
