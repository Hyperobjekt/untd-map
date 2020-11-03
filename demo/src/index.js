import React, { Component } from 'react'
import { render } from 'react-dom'

import Explorer from '../../src'

export default class Demo extends Component {
  toggleMenu = () => {
    // console.log('demo page toggle menu blah')
    return null
  }
  render() {
    return <Explorer toggleMenu={this.toggleMenu} />
  }
}

render(<Demo />, document.querySelector('#demo'))
