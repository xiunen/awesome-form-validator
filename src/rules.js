export const REQUIRED = {
  type: 'required'
}

export const MIN_LENGTH = {
  type: 'minlength',
  value: 0
}

export const MAX_LENGTH = {
  type: 'maxlength',
  value: 0
}

export const LENGTH_BETWEEN = {
  type: 'length_btween',
  value: [0, false]

}

export const NUMBER = {
  type: 'number'
}

export const NUMBER_BETWEEN = {
  type: 'number_btween',
  value: [false, false]
}

export const ARRAY = {
  type: 'array'
}

export const MIN = {
  type: 'min',
  value: false
}

export const MAX = {
  type: 'max',
  value: false
}

export const PATTERN = {
  type: 'pattern',
  value: false
}

export const FUNCTION = {
  type: 'function',
  value: () => true
}

export const CONTAINED = {
  type: 'contained',
  value: []
}
