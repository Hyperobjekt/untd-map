// Maximum percents for all demographics
export const DEMO_MAX_PERCENTS = {
  dem_perwh: 1,
  dem_perbl: 0.902,
  dem_peras: 0.709,
  dem_perhi: 1,
  dem_perpoc: 1,
}

// Array of layers groups.
export const CPAL_LAYER_GROUPS = [
  {
    id: 0,
    title: `UI_MAP_LAYER_0_TITLE`,
    desc: `UI_MAP_LAYER_0_DESC`,
    census_legend: 0,
  },
]

// Array of layers.
export const UNTD_LAYERS = [
  {
    id: `counties`,
    label: `UI_MAP_LAYERS_COUNTIES`,
    types: [`redlineShapes`, `redlineLines`],
    tooltip: null,
    only_one: true,
    only_one_name: `basic_geo`,
    group: 0,
    index: 0,
  },
  {
    id: `zips`,
    label: `UI_MAP_LAYERS_ZIPS`,
    types: [`feeders`],
    tooltip: null,
    only_one: true,
    only_one_name: `basic_geo`,
    group: 0,
    index: 1,
  },
  {
    id: `tracts`,
    label: `UI_MAP_LAYERS_TRACTS`,
    types: [`demoShapes`, `demoLines`],
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
    types: [`demoShapes`, `demoLines`],
    tooltip: null,
    only_one: true,
    only_one_name: `basic_geo`,
    // metric: `dem_perbl`,
    group: 0,
    index: 3,
  },
]

export const POINT_ICONS = [
  {
    id: `grocery`,
    source: ``,
  },
  {
    id: `bank`,
    source: ``,
  },
  {
    id: `health`,
    source: ``,
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
