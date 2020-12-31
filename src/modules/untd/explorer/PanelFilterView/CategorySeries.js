import React from 'react'
import clsx from 'clsx'
import i18n from '@pureartisan/simple-i18n'
import PropTypes from 'prop-types'

import FilterSeries from './FilterSeries'
import InteractiveScale from './InteractiveScale'

const CategorySeries = ({ ...props }) => {
  console.log('CategorySeries, ', props)
  /**
   * Returns tab description transl and markup if one is provided
   * @param  Object metric Object with metric data
   * @return String HTML string
   */
  const getTabDesc = metric => {
    if (metric.desc && metric.desc.length > 0) {
      return (
        <div
          className={clsx(
            'tab-desc',
            'tab-desc-' + metric.tabId,
          )}
          dangerouslySetInnerHTML={{
            __html: i18n.translate(metric.desc),
          }}
        ></div>
      )
    } else {
      return ''
    }
  }

  return (
    <div
      className={clsx(
        'filter-panel-tabs',
        props.activeTab
          ? 'active-tab-' + props.activeTab
          : '',
      )}
    >
      {props.tabs.map(t => {
        // const metric = props.metrics.find(m => {
        //   return m.id === t
        // })
        const tabLabel = i18n.translate(t.title)
        const tabDesc = i18n.translate(t.desc)
        const tabId = t.id
        const categoryIndicators = props.metrics.filter(
          el => {
            return el.cat === t.id
          },
        )
        // <div
        //   className={clsx(
        //     'filter-select',
        //     'tab-' + tabId,
        //   )}
        //   key={t}
        // >
        //   <InteractiveScale metric={metric} />
        // </div>
        return (
          <div
            className={clsx(
              'filter-tab-category',
              tabId ? 'tab-category-' + tabId : '',
            )}
            key={tabId}
          >
            <h5>{tabLabel}</h5>
            <h6
              dangerouslySetInnerHTML={{
                __html: tabDesc,
              }}
            ></h6>
            <FilterSeries
              tab={tabId}
              metrics={categoryIndicators}
            />
          </div>
        )
      })}
    </div>
  )
}

FilterSeries.propTypes = {
  tabs: PropTypes.array,
  metrics: PropTypes.array,
  activeTab: PropTypes.string,
}

FilterSeries.defaultProps = {
  tabs: [],
  metrics: [],
  activeTab: 'cri',
}

export default CategorySeries
