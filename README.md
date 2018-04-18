# Bloom Context Forms

#### A context-only alternative to [bloom-forms](https://github.com/vineyard-bloom/bloom-forms). No Redux here.

## What is this?
Bloom-Context-Forms provides a Form wrapper that manages your internal form state inside React 16's context. All updates, validation, and other hooks are available through connecting your component to the specific Context it consumes.

## Suggested Use
It's suggested to use this package to manage your form state and validation, and use the [Bloom Inputs](https://github.com/vineyard-bloom/bloom-forms/blob/master/docs/inputs.md) package for accessible, stylable inputs.

## Features:
- Standardized form value updates, regardless of input type.
- Integrates seamlessly with [bloom-starter](https://github.com/vineyard-bloom/bloom-starter) and [bloom-inputs](https://github.com/vineyard-bloom/bloom-inputs).
- Fully customizable validation. Works through the `<FormProvider>` and independently.
- Tracks any fields passed into `fieldNames`. Allows fully custom inputs without any special wrappers around each of them.

## Why use Bloom Context Forms?
* Built-in state management
* Built-in error handling
* Built-in form population
* Built-in accessibility
* All field values and errors available through Context
* Unopinionated about contents

## Includes:
* FormContext
* FormProvider

## README Contents:
### General:
- [Set Up](https://github.com/vineyard-bloom/bloom-forms#set-up)
- [Basic Usage](https://github.com/vineyard-bloom/bloom-forms#basic-usage)
- [Contributing](https://github.com/vineyard-bloom/bloom-forms#contributing)

### [`<Form/>` Wrapper](https://github.com/vineyard-bloom/bloom-forms/blob/master/docs/form.md)
### [What Props are passed down to child inputs?](https://github.com/vineyard-bloom/bloom-forms/blob/master/docs/children-props.md)
### [Validation & Error Handling](https://github.com/vineyard-bloom/bloom-forms/blob/master/docs/validate-as-options.md)
### [Redux -- Reducers, Actions, and Store format](https://github.com/vineyard-bloom/bloom-forms/blob/master/docs/redux.md)
### [Comparisons to other Redux form libraries](https://github.com/vineyard-bloom/bloom-forms/blob/master/docs/comparison.md)

## Setup
To use this package, you can install with either npm or yarn.
```
npm install bloom-forms --save
```
or
```
yarn add bloom-forms
```

To import the files/components in this package, import like:
```
import { Form, formReducer } from 'bloom-forms';
```

## Contributing
Fork this repo, and submit any changes as a PR to master. Accepted PRs will be merged and published to npm.

## Basic Usage
- Every form needs two files: a container and a presentation component (with all the inputs inside it)
- The container should render the presentation component wrapped inside of the generic Form.jsx container. This wrapper handles all your state, updating redux, errors, etc.
- Example:
A login form might look like this: (simplified -- make sure all your inputs have required props, etc.)
```
const LoginForm = (props) => {
  return (
    <form id='login-form'>
      <TextInput name='username' value={ formData.username } />
      <TextInput name='password' isPassword={ true } value={ formData.password.value } onBlur={ props.checkField } />
      <Button text='submit' onClick={ props.submitForm } />
    </form>
  )
}
```
And its container would look like this:
```
class LoginFormContainer extends React.Component {
  submitForm = (formData, files, successCallback, failCallback) => {
    WebService.login(formData)
      .then(res => {
        successCallback()
      })
      .catch(err => {
        failCallback()
      })
  }

  render() {
    let fieldNames = ['username', 'password']
  
    return (
      <Form id='login-form' fieldNames={ fieldNames } submitForm={ this.submitForm }>
        <LoginForm />
      </Form>
    )
  }
}
```
- Note that the IDs match ('login-form'), and the fieldNames match the names of the TextInputs.

Now make sure that you've imported your `formReducer` into your reducers file in redux, like:
```
import { formReducer } from 'bloom-forms'
...

export default combineReducers({
  ...
  forms: formReducer
  ...
})
```

[Back to Contents](https://github.com/vineyard-bloom/bloom-forms#readme-contents)
