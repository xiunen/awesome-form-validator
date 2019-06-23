import {REQUIRED,MIN_LENGTH, MAX_LENGTH, MIN, MAX, PATTERN, FUNC, NUMBER} from './constants'

class Validator{
    getInstance(){
        if(!Validator.instance){
            Validator.instance = new Validator();
        }
        return Validator.instance
    }

    setOptions(options={}){
        this.options = {
            ...options,
            messages: {
                [REQUIRED]: 'required',
                [MIN_LENGTH]:'more than {{number}} chars required',
                [MAX_LENGTH]:'less than {{number}} chars required',
                [MIN]: 'more than {{number}} required',
                [MAX]: 'less than {{number}} required',
                [PATTERN]: 'invalid pattern',
                [FUNC]:'invalid input',
                [NUMBER]: 'number required',
                ...(options.messages||{})
            }
        }
    }

    validate(form, rules={}){
        let result = true;
        let messages = [];
        const keys = Object.keys(rules);
        keys.forEach(key=>{
            const itemRules = rules[key];

        })
        //todo validate with rules
        return {
            result,
            messages
        }
    }
}

export default Validator.getInstance()