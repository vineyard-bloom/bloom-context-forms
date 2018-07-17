import React from 'react'
import { FormContext, getCurrentContext } from '../src'

const mockSubmitForm = (formData) => {
  return formData
}

const getFormHandlerWithContext = (context = {updateForm: (id, formState) => {context[id] = formState}}) => {
  // Will then mock the FormContext module being used in our FormHandler component
  jest.doMock('../src/form-context', () => {
    return {
      FormContext: {
        Consumer: (props) => props.children(context)
      }
    }
  })
  
  // you need to re-require after calling jest.doMock.
  // return the updated FormHandler module that now includes the mocked context
  return require('../src').FormHandler
}

const formProps = {
  fieldNames: ['username', 'password'],
  id: 'exampleForm',
  submitForm: mockSubmitForm,
}
const Form = getFormHandlerWithContext(FormContext._currentValue)

describe('FormHandler initial state', () => {
  const formWrapper = shallow(<Form {...formProps} />)
  test('form initialized properly', () => {
    expect(JSON.stringify(formWrapper.state()))
      .toEqual(JSON.stringify(FormContext._currentValue[formProps.id]))
  })

  test('getCurrentContext is initialized properly', () => {
    const contextSnapshot = getCurrentContext('exampleForm')
    expect(JSON.stringify(formWrapper.state())).toEqual(JSON.stringify(contextSnapshot))
  })
})

describe('calling method on FormHandler updates context', () => {
  const formWrapper = shallow(<Form {...formProps} />)
  test('updating a field affects appropriate context', () => {
    const newField = { name: 'username', value: 'Bob' }
    formWrapper.instance().updateField(null, newField.name, newField.value, 'text')
    formWrapper.update()
    expect(formWrapper.state().fields).toEqual({
      username: { value: newField.value },
      password: { value: '' }
    })
    expect(formWrapper.state().fields).toEqual(getCurrentContext('exampleForm').fields)
  })

  test('adding an error to a field affects appropriate context', () => {
    const error = 'I\'m an error'
    formWrapper.instance().addFormError('username', error)
    formWrapper.update()
    expect(formWrapper.state().fields).toEqual({
      username: { value: 'Bob', error: error },
      password: { value: '' }
    })
    expect(formWrapper.state().fields).toEqual(getCurrentContext('exampleForm').fields)
  })

  test('deleting an error from a field affects appropriate context', () => {
    formWrapper.instance().deleteFormError('username')
    formWrapper.update()
    expect(formWrapper.state().fields).toEqual({
      username: { value: 'Bob' },
      password: { value: '' }
    })
    expect(formWrapper.state().fields).toEqual(getCurrentContext('exampleForm').fields)
  })

  test('triggering submit prepares the data for submission', async () => {
    const endFormData = await formWrapper.instance().forwardToSubmitForm()
    formWrapper.update()
    expect(endFormData).toEqual({ username: 'Bob', password: '' })
  })
})
