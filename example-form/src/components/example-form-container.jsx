import React from 'react'
import { FormProvider, getCurrentContext } from 'bloom-context-forms'

import ExampleForm from './presentation/example-form'

class ExampleFormContainer extends React.Component {
  rerouteAfterSubmit = () => {
    // this.props.history.push('/lending')
  }

  submitForm = async (formData, files, successCallback, failCallback) => {
    // console.log(formData)
    // getCurrentContext('exampleForm')
    console.log(getCurrentContext('exampleForm'))
    try {
      // const res = await callToWebService(formData)
      // this.rerouteAfterSubmit(res)
      successCallback()
    } catch (err) {
      failCallback(err)
    }
  }

  render() {
    const fieldNames = [
      'textinput',
      'password',
      'checkbox',
      'radio',
      'radio2',
      'date',
      'currency',
      'select',
      'select2',
      'toggle',
      'file-simple',
      'file-simple-2',
      'file-droppable',
      'onlyBloop',
      'textarea'
    ]

    const validationHelp = {
      dictionary: {
        'must-equal-bloop': testData =>
          testData !== 'bloop' ? 'Sorry, this field has to be "bloop."' : null
      }
    }

    return (
      <FormProvider
        id='exampleForm'
        fieldNames={fieldNames}
        submitForm={this.submitForm}
        validationHelp={validationHelp}
      >
        <ExampleForm />
      </FormProvider>
    )
  }
}

export default ExampleFormContainer
