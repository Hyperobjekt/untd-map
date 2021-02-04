// Maximum percents for all demographics
export const DEMO_MAX_PERCENTS = {
  dem_perwh: 1,
  dem_perbl: 0.902,
  dem_peras: 0.709,
  dem_perhi: 1,
  dem_perpoc: 1,
}

export const HOVER_LAYERS = [
  'points',
  'tracts',
  'zips',
  'places',
]

// Array of layers groups.
export const UNTD_LAYER_GROUPS = [
  {
    id: 0,
    title: `UI_MAP_LAYER_0_TITLE`,
    desc: `UI_MAP_LAYER_0_DESC`,
    census_legend: 0,
    list: `UNTD_LAYERS`,
  },
  {
    id: 1,
    title: `UI_MAP_LAYER_1_TITLE`,
    desc: `UI_MAP_LAYER_1_DESC`,
    census_legend: 0,
    list: `pointTypes`,
  },
]

// Array of layers.
export const UNTD_LAYERS = [
  {
    id: `counties`,
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
    id: `zips`,
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
    id: `tracts`,
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
    id: `places`,
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
      'charter_elementary_school',
      'charter_high_school',
      'charter_middle_school',
      'public_high_school',
      'public_elementary_school',
      'public_middle_school',
    ],
  },
  {
    id: `public_health`,
    subcategories: [],
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
