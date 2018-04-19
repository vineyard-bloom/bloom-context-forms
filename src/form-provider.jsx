import React from 'react'
import PropTypes from 'prop-types'
import { FormContext } from './form-context'

import { validatorAggregator as validator } from './validator'

const initialFormState = {
  attemptedSubmit: false,
  dirtyFields: [],
  fields: {},
  isValid: true,
  prepopulated: false,
  processingRequest: false,
  visibleFields: []
}

class FormProvider extends React.Component {
  state = {
    ...initialFormState,
    checkField: this.checkField,
    checkMultipleFields: this.checkMultipleFields,
    updateVisibleFields: this.updateVisibleFields,
    updateField: this.updateField
  };

  static propTypes = {
    fieldNames: PropTypes.arrayOf(
      PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.shape({
          name: PropTypes.string.isRequired,
          type: PropTypes.string
        })
      ])
    ).isRequired,
    id: PropTypes.string.isRequired,
    ignoreFocusOnFirstElement: PropTypes.bool,
    prepopulateData: PropTypes.object,
    preserveAfterUnmount: PropTypes.bool,
    submitForm: PropTypes.func.isRequired,
    validationHelp: PropTypes.shape({
      errorLanguage: PropTypes.object,
      dictionary: PropTypes.object
    }),
    wrapInFormElement: PropTypes.bool
  }

  componentDidMount() {
    if (this.props.prepopulateData) {
      this.populateFields(this.props.fieldNames, this.props.prepopulateData)
    } else {
      this.populateFields(this.props.fieldNames)
    }

    if (!this.props.ignoreFocusOnFirstElement) {
      this.focusOnFirst()
    }

    this.updateVisibleFields()

    // ensure arrow-bound methods are passed into context
    this.setState({
      checkField: this.checkField,
      checkMultipleFields: this.checkMultipleFields,
      updateVisibleFields: this.updateVisibleFields,
      updateField: this.updateField
    })
  }

  componentWillReceiveProps(newProps) {
    if (newProps.prepopulateData &&
      (!this.props.prepopulateData ||
        (Object.values(this.props.prepopulateData).sort().toString() !=
        Object.values(newProps.prepopulateData).sort().toString())
    )) {
      this.populateFields(newProps.fieldNames, newProps.prepopulateData)
    }

    if (
      this.props.fieldNames &&
      newProps.fieldNames.length !=
        this.props.fieldNames.length
    ) {
      this.populateFields(newProps.fieldNames, null, this.state.fields)
    }
  }

  componentWillUnmount() {
    if (!this.props.preserveAfterUnmount) {
      this.clearForm()
    }
  }

  addFormError = (fieldName, error) => {
    this.setState(state => ({
      fields: {
        ...state.fields,
        [fieldName]: { ...state.fields[fieldName], error }
      }
    }))
  }

  checkField = async (e, fieldName=null) => {
    // console.log(e, fieldName)
    const name = e && e.target
      ? e.target.getAttribute('name')
      : fieldName

    if (!name) {
      return
    } else {
      const elem = document.getElementsByName(name)[0]
      const isRequired = elem ? elem.getAttribute('aria-required') || elem.getAttribute('required') : false
      const validateAs = elem ? elem.getAttribute('data-validate') : ''
      const value = this.state.fields[name] && this.state.fields[name].value || ''

      try {
        // use the validator to find the status of all fields
        const fieldStatus = await validator(
          {
            [fieldName]: {
              value,
              validateAs,
              name
            }
          },
          this.props.validationHelp
            ? this.props.validationHelp.errorLanguage
            : null,
          this.props.validationHelp ? this.props.validationHelp.dictionary : null
        )

        const allowDeletion = !isRequired || (value && isRequired)

        if (fieldStatus.isValid && allowDeletion) {
          this.deleteFormError(name)
          return Promise.resolve(true)
        } else {
          this.addFormError(name, fieldStatus.warnings[name])
          return Promise.resolve(false)
        }
      } catch(err) {
        throw new Error(err)
      }
    }
  }

  checkMultipleFields = async (fieldNamesArray=[]) => {
    const allStatuses = await Promise.all(fieldNamesArray.map(name => this.checkField(null, name)))
    const isAllValid = allStatuses.reduce((a,b) => a && b)
    this.setState({ isAllValid })
  }

  clearForm = async () => {
    this.setState(state => ({
      ...state,
      ...initialFormState
    }))
  }

  createForm = (data) => {
    this.setState({
      ...data
    })
  }

  deleteFormError = (fieldName) => {
    if (this.state.fields[fieldName] && this.state.fields[fieldName].error) {
      this.setState(state => ({
        fields: {
          ...state.fields,
          [fieldName]: { value: state.fields[fieldName].value }
        }
      }))
    }
  }

  focusOnFirst = () => {
    const form = document.getElementById(this.props.id)
    if (form) {
      let firstInput = [...form.querySelectorAll('input, select, textarea')][0]
      if (firstInput) {
        firstInput.focus()
      }
    }
  }

  forwardToSubmitForm = async e => {
    // prepares the data to be in a submittable format after checking for errors
    if (e) {
      e.preventDefault()
    }

    this.setState({
      attemptedSubmit: true,
      processingRequest: true
    })

    const thisForm = this.prepareFormDataForSubmit({ ...this.state.fields })

    const files = thisForm.files || new FormData()
    // if (thisForm.files) {
    //   delete thisForm.files
    // }

    // check each field if it's not a file or 'isValid'
    const checkArr = []
    for (let fieldName in thisForm) {
      if (
        (thisForm[fieldName] ||
          thisForm[fieldName] === '' ||
          thisForm[fieldName] === false) &&
        document.getElementById(fieldName)
      ) {
        // validate each field in case onBlur on that field never triggered
        checkArr.push(this.checkField(null, fieldName))
      }
    }

    return Promise.all(checkArr)
      .then(isValidValues => {
        if ((isValidValues || []).reduce((a, b) => a && b)) {
          const successCallback = () => {
            this.setState({
              processingRequest: false
            })
          }

          const failCallback = () => {
            this.setState({
              processingRequest: false
            })
          }
          if (this.props.testMode) {
            return {
              thisForm,
              files,
              successCallback,
              failCallback
            }
          } else {
            return this.props.submitForm(
              thisForm,
              files,
              successCallback,
              failCallback
            )
          }
        } else {
          delete thisForm.isValid

          this.setState({
            processingRequest: false
          })

          // debugging helper
          console.log(
            `form id '${this.props.id}' has invalid fields`,
            { ...this.state.fields }
          )
        }
      })
      .catch(err => {
        throw new Error(err)
      })
  }

  populateFields = (fieldNames, prepopulateData, oldFields) => {
    const formData = { ...this.state }
    const formFields = oldFields ? { ...oldFields } : {}

    fieldNames.forEach(fieldName => {
      if (fieldName.type) {
        formFields[fieldName.name] = {}

        switch (fieldName.type) {
          case 'checkbox':
            formFields[fieldName.name].value = false
            break
          case 'radio':
            formFields[fieldName.name].value = false
            break
          case 'file':
            formFields[fieldName.name].value = []
            break
          default:
            formFields[fieldName.name] = { value: '' }
        }
      } else {
        formFields[fieldName.toString()] = { value: '' }
      }
    })

    if (prepopulateData) {
      for (var key in prepopulateData) {
        // explode out any nested fields we might need
        if (typeof prepopulateData[key] == 'object') {
          for (var fieldName in prepopulateData[key]) {
            if (formFields[fieldName]) {
              // we only want fields that exist in the form to update
              formFields[fieldName].value = prepopulateData[key][fieldName]
            }
          }
        } else if (formFields[key]) {
          formFields[key].value = prepopulateData[key]

          if (!this.state.prepopulated && prepopulateData[key]) {
            this.setState({
              prepopulated: true
            })
          }
        }
      }
    }

    formData.fields = formFields

    if (this.createForm) {
      this.createForm(formData)
    }
  }

  prepareFormDataForSubmit = originalForm => {
    const thisForm = { ...originalForm }
    for (let field in thisForm) {
      if (
        thisForm[field].value ||
        thisForm[field].value === '' ||
        thisForm[field].value === false
      ) {
        if (field.indexOf('confirm') > -1) {
          // don't send two of the same field (confirm is for front end)
          delete thisForm[field]
        } else if (
          thisForm[field].value[0] &&
          thisForm[field].value[0].type &&
          thisForm[field].value[0].name
        ) {
          // contains files
          thisForm.files =
            thisForm.files &&
            thisForm.files.keys() &&
            Array.from(thisForm.files.keys()).length
              ? thisForm.files
              : new FormData()
          thisForm[field].value.forEach((elem, i) => {
            thisForm.files.append(`${field}[${i}]`, elem)
          })
          delete thisForm[field]
        } else if (field != 'isValid') {
          thisForm[field] = thisForm[field].value
        }
      }
    }

    return thisForm
  }

  updateField = (e=null, fieldName, value, optType, multi=false) => {
    if (e && e.target) {
      if (!fieldName) {
        fieldName = e.target.getAttribute('name')
      }

      let val = value || e.target.value || ''
      const type = optType ||
        (
          document.getElementById(fieldName) || [ ...document.getElementsByName(fieldName) ][0]
        ).getAttribute('type') || 'text'

      if (type === 'checkbox') {
        val = e.target.checked
      } else if (type === 'file') {
        val = e.target.files // fix
      } else if (type === 'radio') {
        if (e.target.checked) {
          val = e.target.id || ''
        }
      }

      this.setState((state) => ({
        dirtyFields: state.dirtyFields.indexOf(fieldName) > -1 ? state.dirtyFields : [ ...state.dirtyFields, fieldName ],
        fields: {
          ...state.fields,
          [fieldName]: { ...state.fields[fieldName], value: multi ? [ ...state.fields[fieldName], val ] : val }
        }
      }))
    } else {
      let val = value || ''
      const type = optType ||
        (
          document.getElementById(fieldName) || [ ...document.getElementsByName(fieldName) ][0]
        ).getAttribute('type') || 'text'

      if (type === 'checkbox') {
        val = !this.state.fields[fieldName].value
      }

      this.setState((state) => ({
        dirtyFields: state.dirtyFields.indexOf(fieldName) > -1 ? state.dirtyFields : [ ...state.dirtyFields, fieldName ],
        fields: {
          ...state.fields,
          [fieldName]: { ...state.fields[fieldName], value: multi ? [ ...state.fields[fieldName], val ] : val }
        }
      }))
    }
  }

  updateVisibleFields = formId => {
    const id = formId || this.props.id || this.props.formId
    const form = document.getElementById(id)
    if (form) {
      const matches = form.querySelectorAll('input, select, textarea')
      const fieldNames = new Set()
      for (var i=0; i < matches.length; i++) {
        fieldNames.add(matches[i].getAttribute('name'))
      }
      this.setState({
        visibleFields: [ ...fieldNames ]
      })
    }
  }

  render() {
    const { children, className, id, wrapInFormElement } = this.props
    const childContext = {
      ...this.state,
      formId: id,
      submitForm: this.forwardToSubmitForm
    }

    return (
      <FormContext.Provider value={{ [id]: childContext }}>
        {
          wrapInFormElement
          ? (
            <form id={id} className={className} noValidate>
              {children}
            </form>
          ) : (
            <React.Fragment>{children}</React.Fragment>
          )
        }
      </FormContext.Provider>
    )
  }
}

export default FormProvider
