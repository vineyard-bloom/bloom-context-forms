# FormContext's hooks

## connectForm function
Connects any children of the FormProvider to the form context.

### Usage:
```
import { connectForm } from 'bloom-context-forms'

...

export default props => connectFrom(props.formId, props)(FormConsumerCmponent)
```

## getCurrentContext function
It returns a read-only object that you can use to read any fields on the form.

### Usage:
```
import { getCurrentContext } from 'bloom-context-forms'

...

getCurrentContext('whateverFormIDYouWant')
```

