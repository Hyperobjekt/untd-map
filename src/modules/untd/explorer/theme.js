import { css } from 'emotion'

export const variables = {
  colors: {
    primary: '#20232a',
    white: '#ffffff',
    bridalHeath: '#fffbf3',
    alabaster: '#f7f7f7',
    oldLace: '#fdf5e9',
    magnolia: '#fbfaff',
    greenWhite: '#ebede3',
    alto: '#d7d7d7',
    boulder: '#757575',
    capeCod: '#3c4748',
    codGray: '#181818',
    dkGray: '#4b4b4b',
    firefly: '#08131f',
    black: '#000000',
    towerGray: '#9dbab7',
    flaxSmoke: '#818967',
    chaletGreen: '#4a6f34',
    turtleGreen: '#2c390b',
    shark: '#292d33',
    cinnabar: '#e94f34',
    orangeRoughy: '#d4441c',
    fog: '#d8ccff',
    deluge: '#7768ae',
    txtLogo: '#8f9287',
    criColor1: '#7b53ef',
    criColor3: '#cabbf5',
    barHighlight: '#e94f34',
    cpLabelColor: '#606b44',
    cpalOrange: '#e55934',
    cpalOrangeLight: '#ffeee5',
  },
  dimensions: {
    navbarHeight: '64px',
  },
  breakpoints: [0, 320, 768, 992, 1280],
  fonts: {
    primary: 'halyard-text',
  },
}

export const theme = {
  elements: {
    redBorder: { border: '1px solid red' },
    tooltip: css(`
      z-index: 5000;
      border-radius: 0;
      margin-left: 16px;
      .arrow {
        display: none;
      }
      .tooltip-inner {
        background-color: #2c390b;
        border-radius: 0;
        font-size: 1.4rem;
        font-family: halyard-text;
        padding: 0.8rem;
      }
    `),
    // Tooltip triggered by desktop universal share.
    tooltipCustomShare: css`
      opacity: 1;
      .tooltip {
        opacity: 1;
        .tooltip-inner {
          border-radius: 2px;
          background-color: ${variables.colors.white};
          box-shadow: 2px 2px 2px rgba(0, 0, 0, 0.05);
          text-align: left;
          opacity: 1;
          padding: 1rem;
          .item {
            margin-bottom: 0.4rem;
            &:last-of-type {
              margin-bottom: 0;
            }
            span {
              font-family: ${variables.fonts.primary};
              font-weight: 300;
              font-size: 1.3rem;
              line-height: 1.5rem;
            }
            svg {
              width: 14px;
              height: 14px;
              margin-right: 1rem;
            }
          }
        }
      }
    `,
  },
}
