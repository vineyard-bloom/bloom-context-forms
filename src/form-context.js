import React from 'react'
import deepFreeze from 'deep-freeze-strict'

const initialContext = {
  updateForm: (id, formState) => {
    initialContext[id] = formState
  }
}

export const FormContext = React.createContext(initialContext)

export function getCurrentContext(formId) {
  return formId
    ? deepFreeze(FormContext._currentValue[formId] || {})
    : new Error(
        'You must pass in the id of the form whose context you want to retrieve to `getCurrentContext`.'
      )
}

export function connectForm(Component) {
  return props => {
    const defaultContext = { fields: {} }
    const componentPreview = new Component({
      context: defaultContext,
      ...props
    })
    const formId = componentPreview.props.id || componentPreview.props.formId
    return (
      <FormContext.Consumer>
        {context => (
          <Component
            context={
              formId && context[formId] ? context[formId] : defaultContext
            }
            {...props}
          />
        )}
      </FormContext.Consumer>
    )
  }
}
