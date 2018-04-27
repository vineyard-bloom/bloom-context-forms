# Props Given to Children
### What `<FormProvider/>` passes to its contents

Whatever you stick inside of `<FormProvider />` is wrapped in a variety of methods and props that are helpful to those children.

A complete list of these that are available via `this.props` are:
  - `attemptedSubmit`
    boolean indicating whether `submitForm` has been called
  - `checkField`
    a function that checks one field. You can pass in an event with the target to be checked attached, or the name of the field to be checked (as the second param). I.E.:
    ```
    this.props.checkField(null, 'firstName')
    ```
    or
    ```
    <TextInput onBlur={props.checkField} />
    ```
  - `checkMultipleFields`
    a function that checks an array of field names, one by one. You must pass in the array of field names to check.
  - `dirtyFields`
    an array of field names that have had their values changed
  - `fields`
    an object where each key matches the field name of the fields inside the form. Each key maps to an object with the structure:
    `{ value: string, error: string }`
  - `isValid`
    boolean that indicates if there are no errored-out fields in the form
  - `prepopulated`
    boolean that indicates if `prepopulateData` was passed into the `<FormProvider/>` as a prop
  - `processingRequest`
    boolean that indicates if the form is in the middle of a `submitForm` action
  - `updateVisibleFields`
    function that updates the list of visibleFields. You can pass in an optional formId, but it defaults to whatever form it's called from
  - `updateField`
    a function that updates the state / values of a single field. It receives an event or fieldName, value, and type parameters.
    ```
    // update from event
    <TextInput onChange={props.updateField} />
    // passes in the event, where e.target.value is used to do updates
    ```
    or
    ```
    // update from fieldName, value, and type
    <SelectInput onChange={props.updateField} />
    // passes in null for the event, then fieldName, value, and type='text' (FileInput uses type='file')
    ```
  - `visibleFields`
    an array of fields that are visible on the page. Must be updated manually after first mount by using `updateVisibleFields`


[Back to Contents](https://github.com/vineyard-bloom/bloom-forms#readme-contents)
