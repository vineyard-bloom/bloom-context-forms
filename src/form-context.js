import React from 'react'
import deepFreeze from 'deep-freeze-strict'

export const FormContext = React.createContext()

export function getCurrentContext(formId) {
  return formId
    ? deepFreeze(FormContext._currentValue[formId])
    : new Error('You must pass in the id of the form whose context you want to retrieve.')
}

export function connectForm(formId, props) {
  return Component => (
    <FormContext.Consumer>
      {context => <Component context={context[formId]} {...props} />}
    </FormContext.Consumer>
  )
}
