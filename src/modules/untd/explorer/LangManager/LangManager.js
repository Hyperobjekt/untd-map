import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import i18n from '@pureartisan/simple-i18n'
import shallow from 'zustand/shallow'

import useStore from './../store.js'

/**
 * Simple component that returns nothing.
 * Initializes language and listens for changes
 * to languages object (which will be updated as
 * files are downloaded.)
 */
const LangManager = ({ ...props }) => {
  const {
    activeLang,
    getLang,
    // langs,
    langUpdates,
  } = useStore(
    state => ({
      activeLang: state.activeLang,
      getLang: state.getLang,
      // langs: state.langs,
      langUpdates: state.langUpdates,
    }),
    shallow,
  )

  const initLang = () => {
    i18n.init({
      locale: activeLang,
      languages: {
        en_us: getLang(activeLang),
      },
    })
  }
  useEffect(() => {
    // console.log('langs changed, ', langs)
    initLang()
  }, [langUpdates])
  initLang()

  return null
}

LangManager.propTypes = {}

export default LangManager
