import {REQUIRED,MIN_LENGTH, MAX_LENGTH, MIN, MAX, PATTERN, FUNC} from './constants'

export const required =  {
    type: REQUIRED,
    value: true,
}

export const minLength = {
    type: MIN_LENGTH,
    value:0,
};

export const maxLength = {
    type: MAX_LENGTH,
    value: 0,
}