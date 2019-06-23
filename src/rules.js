import {REQUIRED,MIN_LENGTH, MAX_LENGTH, NUMBER, MIN, MAX, PATTERN, FUNC} from './constants'

export const required =  {
    type: REQUIRED,
    message:  'required'
}

export const minLength = {
    type: MIN_LENGTH,
    value:0,
    message:'more than {{number}} chars required',
};

export const maxLength = {
    type: MAX_LENGTH,
    value: 0,
    message:'less than {{number}} chars required',
}

export const number = {
    type: NUMBER,
    message: 'number required',
}

export const min = {
    type: MIN,
    value: false,
    message: 'more than {{number}} required',
}

export const max = {
    type: MAX,
    value: false,
    message: 'less than {{number}} required',
}

export const pattern = {
    type: PATTERN,
    value: false,
    message: 'invalid pattern',
}

export const func = {
    type: FUNC,
    value: ()=>true,
    message:'invalid input',
}