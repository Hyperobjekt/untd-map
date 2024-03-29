import React from 'react'
import i18n from '@pureartisan/simple-i18n'
import { getRoundedValue } from './../utils'
import styled from 'styled-components'

const DemographicStat = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  margin-top: 1.5rem;
  min-width: 50%;
  max-width: 50%;
  span {
    max-width: 140px;
  }
`

const DemographicsPanel = ({ activeFeature, ...props }) => {
  const demographics = Object.keys(activeFeature.properties)
    .filter(el => {
      return (
        el.indexOf('_sd') < 0 && el.indexOf('popE') > -1
      )
    })
    .map(el => {
      return {
        id: el,
        value: activeFeature.properties[el],
      }
    })
  const demoTotal = demographics.find(
    el => el.id.indexOf('tot') > -1,
  )

  return (
    <div {...props}>
      <h3 className="gotham16 mb-5">
        {i18n.translate(`PANEL_LOCATION_DEMO`)}
      </h3>
      <DemographicStat>
        <span className="knockout12 grey2">
          {i18n.translate(demoTotal.id)}
        </span>
        <span className="gotham18">
          {getRoundedValue(demoTotal.value)}
        </span>
      </DemographicStat>
      <div className="d-flex flex-wrap">
        {demographics
          .filter(el => el.id.indexOf('tot') < 0)
          .sort((a, b) => b.value - a.value)
          .map(d => (
            <DemographicStat key={`demo-${d.id}`}>
              <span className="knockout12 grey2">
                {i18n.translate(d.id)}
              </span>
              <span className="gotham18">
                {getRoundedValue(d.value)}
              </span>
            </DemographicStat>
          ))}
      </div>
    </div>
  )
}

export default DemographicsPanel
