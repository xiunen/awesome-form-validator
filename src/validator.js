import {REQUIRED,MIN_LENGTH, MAX_LENGTH, MIN, MAX, PATTERN, FUNC, NUMBER} from './constants'

class Validator{
    getInstance(){
        if(!Validator.instance){
            Validator.instance = new Validator();
        }
        return Validator.instance
    }

    // setOptions(options={}){
    //     this.options = {
    //         ...options,
    //         messages: {
    //             ...(options.messages||{})
    //         }
    //     }
    // }

    validate(form={}, rules={}){
        let result = true;
        const validateMessages = {};
        const keys = Object.keys(rules);
        
        keys.forEach(key=>{
            const fieldRules = rules[key];

            if(!Array.isArray(fieldRules))return;
            
            const fieldMessages = [];
            const value = form[key];

            fieldRules.forEach(rule=>{
                switch(rule.type){
                    case REQUIRED: {
                        if(!value && typeof value!=='number'){
                            result = false;
                            fieldMessages.push(rule.message);
                        }
                    }
                }
            });

            if(fieldMessages.length){
                validateMessages[key] = fieldMessages;
            }
        })
        return {
            result,
            messages: validateMessages
        }
    }
}

export default Validator.getInstance()