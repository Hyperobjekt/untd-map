export const DESKTOP_STEPS = [
  {
    target: '.mapboxgl-map',
    text: 'TOUR_DESK_STEP_2',
    placement: 'auto',
    disableBeacon: true,
  },
  {
    target: '.map__zoom',
    text: 'TOUR_DESK_STEP_3',
    placement: 'right',
    disableBeacon: true,
  },
  {
    target: '.tour-desk-4',
    text: 'TOUR_DESK_STEP_4',
    placement: 'right',
    disableBeacon: true,
  },
  {
    target: '.tour-desk-5',
    text: 'TOUR_DESK_STEP_5',
    placement: 'right',
    disableBeacon: true,
    clickOn: ['#button_toggle_panel_filters'],
  },
  {
    target: '.tour-desk-6',
    text: 'TOUR_DESK_STEP_6',
    placement: 'right',
    disableBeacon: true,
  },
  {
    target: '.tour-desk-7',
    text: 'TOUR_DESK_STEP_7',
    placement: 'left',
    disableBeacon: true,
  },
  {
    target: '.tour-desk-8',
    text: 'TOUR_DESK_STEP_8', // Search for a school...
    placement: 'bottom',
    disableBeacon: true,
    clickOn: ['#button_toggle_panel_layers'],
  },
  {
    target: '.tour-desk-9',
    text: 'TOUR_DESK_STEP_9', // Hover a school..., click a school...
    placement: 'auto',
    disableBeacon: true,
    clickOn: ['#button_toggle_panel_layers'],
  },
  {
    target: '.tour-desk-10',
    text: 'TOUR_DESK_STEP_10', // Use these controls to zoom...
    placement: 'left',
    disableBeacon: true,
  },
  {
    target: '.tour-desk-11',
    text: 'TOUR_DESK_STEP_11', // The map has additional layers...
    placement: 'right',
    disableBeacon: true,
    clickOn: ['#button_toggle_panel_info'],
  },
  {
    target: '.tour-desk-12',
    text: 'TOUR_DESK_STEP_12', // The feeder view displays all of the....
    placement: 'auto',
    disableBeacon: true,
  },
]

export const MOBILE_STEPS = [
  {
    target: '.mapboxgl-map',
    text: 'TOUR_DESK_STEP_2',
    placement: 'auto',
    disableBeacon: true,
  },
  {
    target: '.map__zoom',
    text: 'TOUR_DESK_STEP_3',
    placement: 'left',
    disableBeacon: true,
  },
  {
    target: '.map-legend',
    text: 'TOUR_DESK_STEP_4',
    placement: 'bottom',
    disableBeacon: true,
    clickOn: ['#map_legend_toggle'],
  },
  {
    target: '.modal .map-panel-slideout-filters',
    text: 'TOUR_DESK_STEP_5',
    placement: 'center',
    disableBeacon: true,
    clickOn: ['#button_toggle_panel_filters'],
  },
  {
    target: '.modal .map-panel-slideout-filters .dropdown',
    text: 'TOUR_DESK_STEP_6',
    placement: 'bottom',
    disableBeacon: true,
  },
  {
    target: '.modal .map-panel-slideout-filters .filter',
    text: 'TOUR_MOBILE_STEP_7',
    placement: 'top',
    disableBeacon: true,
  },
  {
    target: '.modal .map-panel-slideout-layers',
    text: 'TOUR_MOBILE_STEP_8', // Search for a school...
    placement: 'center',
    disableBeacon: true,
    clickOn: [
      '.modal .close',
      '#button_toggle_panel_layers',
    ],
  },
  {
    target: '.react-autosuggest__container',
    text: 'TOUR_DESK_STEP_9', // Hover a school..., click a school...
    placement: 'bottom',
    disableBeacon: true,
    clickOn: ['.modal .close'],
  },
  {
    target: '#button_u_share_link',
    text: 'TOUR_DESK_STEP_10', // Use these controls to zoom...
    placement: 'bottom',
    disableBeacon: true,
  },
  {
    target: '.modal .map-panel-slideout-info',
    text: 'TOUR_DESK_STEP_11', // The map has additional layers...
    placement: 'center',
    disableBeacon: true,
    clickOn: ['#button_toggle_panel_info'],
  },
  {
    target: 'body',
    text: 'TOUR_MOBILE_STEP_12', // The feeder view displays all of the....
    placement: 'center',
    disableBeacon: true,
    clickOn: ['.modal .close'],
  },
]
