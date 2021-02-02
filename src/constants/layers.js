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
  },
  {
    id: `tracts`,
    label: `UI_MAP_LAYERS_TRACTS`,
    types: [`polygons`],
    tooltip: null,
    only_one: true,
    only_one_name: `basic_geo`,
    // metric: `dem_perpoc`,
    group: 0,
    index: 2,
  },
  {
    id: `places`,
    label: `UI_MAP_LAYERS_PLACES`,
    types: [`polygons`],
    tooltip: null,
    only_one: true,
    only_one_name: `basic_geo`,
    // metric: `dem_perbl`,
    group: 0,
    index: 3,
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
