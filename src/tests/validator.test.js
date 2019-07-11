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
    tags: ['hello', 'world'],
    gender: 'Female'
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
      },
      {
        ...rules.CONTAINED,
        value: ['hello', 'world', 'cool']
      }
    ],
    gender: [{
      ...rules.CONTAINED,
      value: ['F', 'M']
    }]
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
      ],
      gender: ['out of valid values']
    })
  })

  test('nested rules', () => {
    const validateForm = {
      tagId: 'test',
      login: {
        username: 'test',
        password: '',
        retype: 'test',
        score: 90,
        info: {
          age: 10,
          level: 'high'
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
        score: [{
          ...rules.MAX,
          value: 'mid'
        }],
        info: {
          age: [{
            ...rules.MIN,
            value: 18
          }, {
            ...rules.MAX,
            value: 100
          }],
          level: [
            {
              ...rules.MIN,
              value: 1
            },

            {
              ...rules.MAX,
              value: 100
            }
          ]
        }
      }
    }

    const { result, messages } = Validator.validate(validateForm, validateRules)

    expect(result).toBeFalsy()

    expect(messages).toEqual({
      login: {
        info: {
          age: ['more than 18 required'],
          level: [
            'more than 1 required',
            'less than 100 required'
          ]
        },
        password: ['item required'],
        retype: ['invalid'],
        username: ['more than 6 chars required']
      },
      tagId: ['number required']
    })
  })

  test('single value', () => {
    const { result, messages } = Validator.validate(18, [{
      ...rules.MIN,
      value: 20
    }])

    expect(result).toBeFalsy()
    expect(messages).toEqual([
      'more than 20 required'
    ])
  })

  test('array', () => {
    const { result, messages } = Validator.validate([17, 5], [[{
      ...rules.MIN,
      value: 8
    }], {
      ...rules.MIN_LENGTH,
      value: 3
    }])

    expect(result).toBeFalsy()
    expect(messages).toEqual([
      [[], ['more than 8 required']],
      'more than 3 chars required'
    ])
  })

  test('array in array', () => {
    const { result, messages } = Validator.validate([[17, 5, 4], [2, 13]], [
      [
        [{
          ...rules.MIN,
          value: 7
        }],
        {
          ...rules.MIN_LENGTH,
          value: 3
        }
      ]
    ])


    expect(result).toBeFalsy()
    expect(messages).toEqual([
      [
        [
          [[], ['more than 7 required'], ['more than 7 required']]
        ],
        [
          [['more than 7 required'], []],
          'more than 3 chars required'
        ]
      ]
    ])
  })

  test('nested array', () => {
    const { result, messages } = Validator.validate([{ name: 18912 }, { name: 18 }, { name: '16666' }], [
      [{
        name: [{
          ...rules.MAX_LENGTH,
          value: 3
        }]
      }]
    ])

    expect(result).toBeFalsy()
    expect(messages).toEqual([
      [
        [{ name: ['less than 3 chars required'] }],
        [],
        [{ name: ['less than 3 chars required'] }]
      ]
    ])
  })

  test('array in oobject', () => {
    const { result, messages } = Validator.validate({ tags: ['hello world'] }, {
      tags: [
        [{
          ...rules.MAX_LENGTH,
          value: 5
        }], {
          ...rules.MIN_LENGTH,
          value: 2
        }
      ]
    })
    expect(result).toBeFalsy()
    expect(messages).toEqual({ tags: [[['less than 5 chars required']], 'more than 2 chars required'] })
  })
})
