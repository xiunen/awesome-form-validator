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

export default {
    [REQUIRED]: (value)=>{
        return !value && (typeof value!=='number');
    },
    [MIN_LENGTH]: (value, rule)=>{
        if(!rule.value)return true;
        if(typeof value === 'number')return String(value).length >= rule.value;
        if(typeof value === 'string'||Array.isArray(value))return value.length >= rule.value;
        return false;
    },
    [MAX_LENGTH]: (value, rule)=>{
        if(!rule.value)return true;
        if(typeof value === 'number')return String(value).length <= rule.value;
        if(typeof value === 'string'||Array.isArray(value))return value.length <= rule.value;
        return false;
    },
    [MAX]: (value,rule)=>{
        if(isNaN(value))return false;
        if(typeof rule.value!=='number')return true;
        return parseInt(value) <= rule.value;
    },
    [MIN]: (value,rule)=>{
        if(isNaN(value))return false;
        if(typeof rule.value!=='number')return true;
        return parseInt(value) >= rule.value;
    },
    [NUMBER]: (value)=>{
        return !isNaN(value);
    },
    [PATTERN]: (value, rule)=>{
        if(!(a instanceof RegExp))return true;
        if(!(typeof value === 'string') && !(typeof value === 'number'))return false;
        return rule.value.test(value)
    }
}