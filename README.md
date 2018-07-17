# Bloom Context Forms

#### A context-only alternative to [bloom-forms](https://github.com/vineyard-bloom/bloom-forms). No Redux here.

## What is this?
Bloom-Context-Forms provides a FormHandler wrapper that manages your internal form state inside React 16's context. All updates, validation, and other hooks are available through connecting your component to the specific Context it consumes.

## Suggested Use
It's suggested to use this package to manage your form state and validation, and use the [Bloom Inputs](https://github.com/vineyard-bloom/bloom-inputs) package for accessible, stylable inputs.

## Features:
- Standardized form value updates, regardless of input type.
- Integrates seamlessly with [bloom-starter](https://github.com/vineyard-bloom/bloom-starter) and [bloom-inputs](https://github.com/vineyard-bloom/bloom-inputs).
- Fully customizable validation. Works through the `<FormHandler>` and independently.
- Tracks any fields passed into `fieldNames`. Allows fully custom inputs without any special wrappers around each of them.
- Smaller size than bloom-forms. Does not depend on Redux.

## Why use Bloom Context Forms?
* Built-in state management
* Built-in error handling
* Built-in form population
* Built-in accessibility
* All field values and errors available through Context
* Unopinionated about contents
* Slim size
* Only dependency is React 16, but values are available anywhere (by default, they are Read Only outside of the form they belong to)

## Includes:
* connectForm (function)
* FormHandler
* getCurrentContext (function)
* validator

## README Contents:
### General:
- [Set Up](https://github.com/vineyard-bloom/bloom-context-forms#set-up)
- [Basic Usage](https://github.com/vineyard-bloom/bloom-context-forms#basic-usage)
- [Contributing](https://github.com/vineyard-bloom/bloom-context-forms#contributing)

### [`FormContext` and its helper methods](https://github.com/vineyard-bloom/bloom-context-forms/blob/master/docs/form-context.md)
### [`<FormHandler />` Wrapper](https://github.com/vineyard-bloom/bloom-context-forms/blob/master/docs/form-handler.md)
### [What Props are passed down to child inputs?](https://github.com/vineyard-bloom/bloom-context-forms/blob/master/docs/children-props.md)
### [Validation & Error Handling](https://github.com/vineyard-bloom/bloom-context-forms/blob/master/docs/validate-as-options.md)

## Setup
To use this package, you can install with either npm or yarn.
```
npm install bloom-context-forms --save
```
or
```
yarn add bloom-context-forms
```

To import the files/components in this package, import like:
```
import { FormHandler, getCurrentContext } from 'bloom-context-forms';
```

## Contributing
Fork this repo, and submit any changes as a PR to master. Accepted PRs will be merged and published to npm.

## Basic Usage
### Container Component:
```
import { FormHandler } from 'bloom-context-forms';
import LoginForm from './login-form';

class LoginFormContainer extends React.Component {
  submitForm = async (formData, files, successCallback, failCallback) => {
    // submit formData and files
  }

  validationHelp = {
    dictionary: {
      'must-equal-bloop': testData =>
        testData !== 'bloop' ? 'Sorry, this field has to be "bloop."' : null
    }
  }

  render() {
    const fieldNames = ['username', 'password'];

    return (
      <FormHandler
        fieldNames={fieldNames}
        id='loginForm'
        submitForm={this.submitForm}
        validationHelp={this.validationHelp}
      >
        <LoginForm />
      </FormHandler>
    )
  }
}

```

The above component can be written in the [renderProps](https://reactjs.org/docs/render-props.html) style like so:
```
// same as above

...

  render() {
    const fieldNames = ['username', 'password'];

    return (
      <FormHandler
        fieldNames={fieldNames}
        id='loginForm'
        submitForm={this.submitForm}
        validationHelp={this.validationHelp}
      >
        {formHandlerProps => <LoginForm { ...formHandlerProps } />}
      </FormHandler>
    )
  }
}
```
This can be useful when you need to access the props passed down to children directly your Container's render method.

### Form component:
```
import { connectForm } from 'bloom-context-forms';

const LoginForm = () => { ... };

export default connectForm(LoginForm);
```

### Why Two Files?
The distinction between container and presentational component is to separate state and data-calling functionality from markup.

Container: Connects the component to the form context state; Submits data to the API; Updates state as needed
Presentation Component: Uses functionality passed down from parent containers; Focus is purely presentational / view layer

If you don't want to use this method, use the renderProps example above to access your needed methods directly on rendering.

[Back to Contents](https://github.com/vineyard-bloom/bloom-context-forms#readme-contents)
