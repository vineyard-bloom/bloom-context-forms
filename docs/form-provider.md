# The `<Form/>` Wrapper

### Usage:
- [Required Props](https://github.com/vineyard-bloom/bloom-context-forms/blob/master/docs/form.md#required-props)
- [Optional Props](https://github.com/vineyard-bloom/bloom-context-forms/blob/master/docs/form.md#optional-props)
- [Updating Form State](https://github.com/vineyard-bloom/bloom-context-forms/blob/master/docs/form.md#updating-form-state)
- [Validation](https://github.com/vineyard-bloom/bloom-context-forms/blob/master/docs/form.md#validation)
- [Prepopulating Form](https://github.com/vineyard-bloom/bloom-context-forms/blob/master/docs/form.md#prepopulating-form)
- [Submitting Forms](https://github.com/vineyard-bloom/bloom-context-forms/blob/master/docs/form.md#submitting-forms)
- [Forms with Switch Inside](https://github.com/vineyard-bloom/bloom-context-forms/blob/master/docs/form.md#forms-with-switch-inside)

## Required Props
- `fieldNames` is a required prop when using form.jsx. It uses this array to know which fields to track. Each entry in fieldNames can be a string, like `'firstName'`, or an object with a type and name, like `{ name: 'isFullTimeEmployee', type: 'checkbox' }`. It's recommended to use the second version for checkboxes and radios.

- `submitForm`
  a function that receives the formData, file data, and two callbacks (success and fail). See 'Submitting Forms' below.

- `id`
  a string for id of your form. You should make your jsx component `<form id>` match.

[Back to Contents](https://github.com/vineyard-bloom/bloom-context-forms#readme-contents)

## Optional Props
- `validationHelp`
  Object used to customize bloom-form's built-in validation. See 'Validation' below.
- `ignoreFocusOnFirstElement`
  By default the first input will be focused on for accessibility reasons.  Set this prop to false to offset default behavior.
- `preserveAfterUnmount`
  By default, the form will clear its data after unmounting from the ui. This means that a registration form will delete its data after you route to a new page. If `preserveAfterUnmount` is true, this will prevent the form from clearing, and you'll be able to return to that form and see the data still there.
- `prepopulateData`
  a json object, usually return from an ajax GET request, that fills in the fields in your form. The keys in this json object should match up with the fieldNames you passed into the form.
- `wrapInFormElement`
  a boolean that will renders the form children inside of `<form></form>` instead of inside a React Fragment.

[Back to Contents](https://github.com/vineyard-bloom/bloom-context-forms#readme-contents)

## Updating Form State
Values can updated via the `updateField` method. You can stick it right on an input that passing in the event to onChange like:
```
<TextInput onChange={ this.props.updateField } />
```
If the field passes in the field's name and value to update instead of the event, you can also use `updateField`, like so:
```
<SelectInput onChange={ this.props.updateField } />
```
Behind the scenes, this method either receives the event and grabs the value from `e.target.value`, or it receives `fieldName` and `value` attributes to update the value manually.

The function looks like this (pseudocode):
```
function (e, fieldName, value, type='text') {
  // type can be useful for updating files. Bloom Inputs handle type for you.
  if (!e) {
    // use fieldName and value to set value
  } else {
    // use e.target.value and e.target.getAttribute('name') to set value
  }
}
```

[Back to Contents](https://github.com/vineyard-bloom/bloom-context-forms#readme-contents)

## Validation

### Set Up
`validationHelp` should be an object with two fields: a json object of error messages, and a dictionary of custom `validateAs` keys with their test functions that return errors.
- Example:
```
validationHelp = {
  errorLanguage: {
    'not-empty': 'This field cannot be empty',
    'min-length': 'This field must be at least <LIMIT> chars.'
  },
  dictionary: {
    'min-length-2': (testData) => testData && testData.length >= 2 ? null : errorLanguage['min-length'].replace('<LIMIT>', 2),
    'min-length-8': (testData) => testData && testData.length >= 8 ? null : errorLanguage['min-length'].replace('<LIMIT>', 8)
  }
}
```

To use this set up, an example field would look like:
```
  <TextInput
    error={ formData.pet.error }
    name='pet'
    onBlur={ props.checkField }
    onChange={ props.updateField }
    validateAs='min-length-2'
    value={ formData.pet.value }
  />
```
and the `<FormProvider>` around it would look like:
```
  <FormProvder validationHelp={validationHelp} ...>
    <PetForm/>
  </FormProvider>
```

### Check individual field onBlur
`checkField` is availabe through props to check one element. Usually this is used when a field is blurred. It receives the event object, and/or the name of the field to check.

### Check multiple fields
`checkMultipleFields` receives an array of field names and checks them synchronously.

[Back to Contents](https://github.com/vineyard-bloom/bloom-context-forms#readme-contents)

## Prepopulating `<FormProvider />`
To have your form populate with existing data, pass in a JSON object of key/value pairs where the keys match your fieldNames prop.

You may have to use an ajax call to grab the necessary data. Form.jsx will load those values as soon as it receives them.

## Submitting Forms
`<FormProvider/>` will handle your form data, but you should write your own submitForm function and pass it in as a prop. Your submitForm should be able to handle formData, a FormData object of files, and both a success and fail callback. You *must* call the success and fail callbacks for the form to update `pendingRequest` -- otherwise, anything showing loading/pending that's dependent on that field will continue to spin endlessly.

An example submitForm might look like:
```
submitForm = async (formData, files, successCallback, failCallback) => {
  try {
    const res = await WebService.post(formData)
    successCallback()
  } catch(err) {
    // trigger an error alert
    failCallback()
  }
}
```

[Back to Contents](https://github.com/vineyard-bloom/bloom-context-forms#readme-contents)

## Forms with Switch Inside
// may not need this -- context continues to be passed down in most cases
To make forms with Routes inside, you will need to make the Switch its own Container inside another form container and pass in the props with a spread operator.

For example:
Outermost container:
```
class RegistrationFormContainer extends React.Component {
  render() {
    return (
      <Form id='registration-form' fieldNames={ fieldNames } submitRoute='/user/register'>
        <RegistrationFormSwitch />
      </Form>
    )
  }
}
```
Switch container:
```
class RegistrationFormSwitch extends React.Component {
  render() {
    return (
      <Switch>
        <Route path='/step1' render={ () => <StepOne { ...this.props } /> } />
        <Route path='/step2' render={ () => <StepTwo { ...this.props } /> } />
      </Switch>
    )
  }
}
```
Now StepOne and StepTwo will both be able to receive their needed Form props, such as `updateField` and `addFormError`.

[Back to Contents](https://github.com/vineyard-bloom/bloom-context-forms#readme-contents)
