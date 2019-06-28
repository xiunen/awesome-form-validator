/* global describe,expect,test */
import Validator, { rules } from '..'

describe('test validate', () => {
  Validator.setMessages({
    required: 'item required'
  })

  const dataForm = {
    username: 'test',
    password: '',
    retype: 'test',
    bio: 'test',
    age: 15,
    nickanme: 'tEst',
    tags: ['hello', 'world']
  }
  const validationConfig = {
    username: [
      {
        ...rules.MIN_LENGTH,
        value: 6,
        message: 'invalid, lenth less than {{number}} charactors'
      }
    ],
    password: [
      rules.REQUIRED,
      {
        ...rules.LENGTH_BETWEEN,
        value: [6, 20]
      }
    ],
    retype: [
      rules.REQUIRED,
      {
        ...rules.FUNCTION,
        value: (value, rule, form) => value === form.password,
        message: 'retype error'
      }
    ],
    bio: [
      {
        ...rules.MAX_LENGTH,
        value: 3
      }, {
        ...rules.PATTERN,
        value: /[a-zA-Z]+/
      }
    ],
    age: [rules.NUMBER, {
      ...rules.NUMBER_BETWEEN,
      value: [18, 60]
    }],
    nickname: [{
      ...rules.PATTERN,
      value: /[A-Z][a-z]+/
    }],
    tags: [
      rules.ARRAY,
      {
        ...rules.MIN_LENGTH,
        value: 1
      },
      {
        ...rules.MAX_LENGTH,
        value: 3
      }
    ]
  }

  test('should return false', () => {
    const { result, messages } = Validator.validate(dataForm, validationConfig)

    expect(result).toBeFalsy()

    expect(messages).toEqual({
      password: ['item required', 'length btween 6 to 20 required'],
      retype: ['retype error'],
      username: ['invalid, lenth less than 6 charactors'],
      age: [
        'number btween 18 to 60 required'
      ],
      bio: [
        'less than 3 chars required'
      ],
      nickname: [
        'format not matched'
      ]
    })
  })

  test('nested rules', () => {
    const validateForm = {
      tagId: 'test',
      login: {
        username: 'test',
        password: '',
        retype: 'test',
        info: {
          age: 10
        }
      }
    }

    const validateRules = {
      tagId: [
        rules.NUMBER
      ],
      login: {
        username: [
          rules.REQUIRED,
          {
            ...rules.MIN_LENGTH,
            value: 6
          }
        ],
        password: [
          rules.REQUIRED
        ],
        retype: [{
          ...rules.FUNCTION,
          value: (value, rule, form) => value === form.password
        }],
        info: {
          age: [{
            ...rules.MIN,
            value: 18
          }]
        }
      }
    }

    const { result, messages } = Validator.validate(validateForm, validateRules)

    expect(result).toBeFalsy()

    expect(messages).toEqual({
      login: {
        info: { age: ['more than 18 required'] },
        password: ['item required'],
        retype: ['invalid'],
        username: ['more than 6 chars required']
      },
      tagId: ['number required']
    })
  })
})
