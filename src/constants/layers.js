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

export const POINT_TYPES_COLORS = [
  '#51410a',
  '#af8b15',
  '#42f43f',
  '#19a817',
  '#2e5b2d',
  '#13adef',
  '#2a6e8c',
  '#0d32e8',
  '#505faa',
  '#3f3289',
  '#623289',
  '#ed31c4',
  '#752263',
  '#f43a29',
  '#8e2f26',
  '#3f3838',
  '#aaa6a5',
  '#efe51a',
  '#7c7711',
  '#577c11',
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
