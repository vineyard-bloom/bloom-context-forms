import React from 'react'
import ReactDOM from 'react-dom'

import ExampleForm from 'components'

class AppRoot extends React.Component {
  render() {
    return <ExampleForm />
  }
}

var docRoot = document.getElementById('root')

ReactDOM.render(<AppRoot />, docRoot)
