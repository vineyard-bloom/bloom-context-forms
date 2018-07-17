import { validator } from '../src'

const validationHelp = {
  dictionary: {
    'max-length-8': testData =>
      testData.length > 8 ? validationHelp.errorLanguage['max-length-8'] : null
  },
  errorLanguage: {
    'max-length-8': 'This field cannot be more than 8 characters long.',
    'not-empty': 'This field cannot be empty!!!'
  }
}

const testData = {
  name: { value: '123', validateAs: 'not-empty', name: 'name' },
  limitedLength: {
    value: '123',
    validateAs: 'max-length-8',
    name: 'limitedLength'
  }
}

const testData2 = {
  multiValidate: {
    value: 'blahblahblahblah@email.com',
    validateAs: 'not-empty email',
    name: 'multiValidate'
  }
}

describe('validator.js', () => {
  test('returns an object with isValid and warnings fields', async () => {
    const result = await validator(
      testData,
      validationHelp.errorLanguage,
      validationHelp.dictionary
    )
    expect(result).toBeTruthy()
    expect(result.isValid).toBe(true)
    expect(result.warnings).toEqual({ name: null, limitedLength: null })
  })

  test('can validate multiple validateAs fields', async () => {
    const result = await validator(
      testData2,
      validationHelp.errorLanguage,
      validationHelp.dictionary
    )
    expect(result).toBeTruthy()
    expect(result.isValid).toBe(true)
    expect(result.warnings).toEqual({
      multiValidate: undefined
    })

    const updatedTestData2 = { ...testData2 }
    updatedTestData2.multiValidate.validateAs = 'max-length-8 email'
    const result2 = await validator(
      updatedTestData2,
      validationHelp.errorLanguage,
      validationHelp.dictionary
    )
    expect(result2).toBeTruthy()
    expect(result2.isValid).toBe(false)
    expect(result2.warnings).toEqual({
      multiValidate: validationHelp.errorLanguage['max-length-8']
    })
  })

  test('returns a warning when a field is invalid', async () => {
    const newTestData = {
      ...testData,
      limitedLength: { ...testData.limitedLength, value: '1234567890' }
    }
    const result = await validator(
      newTestData,
      validationHelp.errorLanguage,
      validationHelp.dictionary
    )
    expect(result).toBeTruthy()
    expect(result.isValid).toBe(false)
    expect(result.warnings).toEqual({
      limitedLength: validationHelp.errorLanguage['max-length-8'],
      name: null
    })

    newTestData.name.value = ''
    newTestData.limitedLength.value = '45'
    const result2 = await validator(
      newTestData,
      validationHelp.errorLanguage,
      validationHelp.dictionary
    )
    expect(result2).toBeTruthy()
    expect(result2.isValid).toBe(false)
    expect(result2.warnings).toEqual({
      name: validationHelp.errorLanguage['not-empty'],
      limitedLength: null
    })
  })
})
