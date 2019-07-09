import {
  REQUIRED,
  MIN_LENGTH, MAX_LENGTH, LENGTH_BETWEEN,
  NUMBER, NUMBER_BETWEEN, MIN, MAX,
  ARRAY, PATTERN, FUNCTION, CONTAINED
} from './rules'

const validateFuncMap = {
  [REQUIRED.type]: value => (typeof value === 'number') || value,

  [MIN_LENGTH.type]: (value, length) => {
    if (!length) return true

    if (typeof value === 'number') {
      return String(value).length >= length
    }

    if (typeof value === 'string' || Array.isArray(value)) {
      return value.length >= length
    }

    return false
  },

  [MAX_LENGTH.type]: (value, length) => {
    if (!length) return true

    if (typeof value === 'number') {
      return String(value).length <= length
    }

    if (typeof value === 'string' || Array.isArray(value)) {
      return value.length <= length
    }

    return false
  },

  [LENGTH_BETWEEN.type]: (value, [min, max]) => {
    if ((typeof min !== 'number') || (typeof max !== 'number') || (min > max)) return true

    if (Array.isArray(value)) {
      return (value.length >= min) && (value.length <= max)
    }

    if ((typeof value !== 'string') && (typeof value !== 'number')) return false

    const str = String(value)

    return (str.length >= min) && (str.length <= max)
  },

  [MAX.type]: (value, target) => {
    if (Number.isNaN(value - 0)) return false

    if (typeof target !== 'number') return true

    return (value - 0) <= target
  },
  [MIN.type]: (value, target) => {
    if (Number.isNaN(value - 0)) return false

    if (typeof target !== 'number') return true

    return (value - 0) >= target
  },

  [NUMBER.type]: value => !Number.isNaN(value - 0),

  [NUMBER_BETWEEN.type]: (value, [min, max]) => {
    if ((typeof min !== 'number') || (typeof max !== 'number') || (min > max)) return true

    if (Number.isNaN(value - 0)) return false

    const numberValue = value - 0

    return numberValue >= min && numberValue <= max
  },

  [ARRAY.type]: value => Array.isArray(value),

  [PATTERN.type]: (value, pattern) => {
    if (!(pattern instanceof RegExp)) return true

    if (!(typeof value === 'string') && !(typeof value === 'number')) return false

    return pattern.test(value)
  },
  [CONTAINED.type]: (value, array = []) => {
    if (Array.isArray(value)) {
      return !value.filter(item => !array.includes(item)).length
    }
    return array.includes(value)
  }

}

class Validator {
  constructor() {
    this.messages = {
      [REQUIRED.type]: 'required',
      [MIN_LENGTH.type]: 'more than {{number}} chars required',
      [MAX_LENGTH.type]: 'less than {{number}} chars required',
      [LENGTH_BETWEEN.type]: 'length btween {{min}} to {{max}} required',
      [MAX.type]: 'less than {{number}} required',
      [MIN.type]: 'more than {{number}} required',
      [NUMBER.type]: 'number required',
      [NUMBER_BETWEEN.type]: 'number btween {{min}} to {{max}} required',
      [ARRAY.type]: 'array required',
      [PATTERN.type]: 'format not matched',
      [FUNCTION.type]: 'invalid',
      [CONTAINED.type]: 'out of valid values'
    }
  }

  static getInstance() {
    if (!Validator.instance) {
      Validator.instance = new Validator()
    }

    return Validator.instance
  }

  setMessages(messages) {
    this.messages = {
      ...this.messages,
      ...messages
    }
  }


  /**
     * @returns {Object} {result, messages} reuslt is validate result, value: true|false. messages is object which format like {name:['required','less than 3 chars required']}
     * @param {Object} form
     * @param {Object} rules, format like [{type:'required', message:'required'},{type:'minlength', value: 6, message:"more than {{number}} chars required"}]
     */
  validate(form = {}, rules = {}) {
    let result = true
    const messages = {}
    const self = this

    Object.keys(rules || {}).forEach((field) => {
      const value = form[field]

      if (Array.isArray(rules[field])) {
        rules[field].forEach((rule) => {
          let validateResult = true
          if (typeof rule.value === 'function') {
            validateResult = rule.value(value, rule.value, form)
          } else {
            validateResult = validateFuncMap[rule.type](value, rule.value, form)
          }

          if (!validateResult) {
            result = false
            messages[field] = messages[field] || []

            const replacement = {
              field
            }

            if (Array.isArray(rule.value)) {
              replacement.min = rule.value[0]
              replacement.max = rule.value[1]
            } else if (typeof rule.value === 'number') {
              replacement.number = rule.value
            }

            const reg = /\{\{(\w+)\}\}/g
            const message = (rule.message || this.messages[rule.type]).replace(reg, (toReplaced, matched) => replacement[matched] || '')

            messages[field].push(message)
          }
        })
      } else {
        const { result: fieldResult, messages: fieldMessages } = self.validate(value, rules[field])

        result = fieldResult

        if (!fieldResult) {
          messages[field] = fieldMessages
        }
      }
    })


    return {
      result,
      messages
    }
  }
}

export default Validator.getInstance()
