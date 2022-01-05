//định nghĩa các rules
Validator.isRequired=function(selector){
    return{
        selector: selector,
        test(value){
            return value.trim() ? undefined : 'Please enter this field'
        }
    }
}
Validator.isEmail=function(selector){
    return{
        selector: selector,
        test(value){
            const regex=/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
            return regex.test(value) ? undefined : 'Please enter the correct email format'
        }
    }
}
Validator.hasLowerUpperCase=function(selector){
    return{
        selector: selector,
        test(value){
            const regex=/^(?=.*[a-z])(?=.*[A-Z])/
            return regex.test(value) ? undefined : 'Please enter at least 1 uppercase and 1 lowercase'
        }
    }
}
Validator.specialCharacters=function(selector){
    return{
        selector: selector,
        test(value){
            const regex=/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/
            return !regex.test(value) ? undefined : 'This field contains no special characters'
        }
    }
}
Validator.minLength=function(selector, min){
    return{
        selector: selector,
        test(value){
            return value.length >= min ? undefined : `Please enter more than ${min} characters`
        }
    }
}
Validator.maxLength=function(selector, max){
    return{
        selector: selector,
        test(value){
            return value.length <= max ? undefined : `Please enter less than ${max} characters`
        }
    }
}
Validator.isConfirmed=function(selector, getConfirmValue){
    return{
        selector: selector,
        test(value){
            return value === getConfirmValue() ? undefined : 'Input value is incorrect'
        }
    }
}

//handle validate
var selectorRules={}
function validate(inputElement, rule){
    let errorElement=inputElement.parentElement.querySelector('.form-message')
    let errorMessage=''
    //lấy ra các rule của selector
    let rules=selectorRules[rule.selector]
    for(let i=0; i<rules.length; ++i){
        errorMessage=rules[i](inputElement.value)
        if(errorMessage) break
    }
    if(errorMessage){
        errorElement.innerText=errorMessage;
        inputElement.parentElement.classList.add('invalid')
    }else{
        errorElement.innerText=''
        inputElement.parentElement.classList.remove('invalid')
    }
    return !errorMessage
}

//function Validator
function Validator(options){
    var formElement=document.querySelector(options.form)
    //khi submit form
    formElement.onsubmit=function(e){
        e.preventDefault()
        //default: tất cả các trường k có lỗi
        var isFormValid=true;
        options.rules.forEach(function(rule){
            var inputElement=formElement.querySelector(rule.selector)
            var isValid=validate(inputElement, rule)
            if(!isValid){
                isFormValid=false
            }
        });
        //k trường nào có lỗi thì xử lý submit
        if(isFormValid){
            if(typeof options.onSubmit === 'function'){
                var enableInputs=formElement.querySelectorAll('[name]')
                var formValues=Array.from(enableInputs).reduce(function(values, input){
                    values[input.name]=input.value
                    return values
                }, {});
                options.onSubmit(formValues)
            }else{
                formElement.submit()
            }
        }       
    }
    //lặp qua từng rule
    options.rules.forEach(function(rule){
        let inputElement=formElement.querySelector(rule.selector)
        //luu lai cac rule cho moi input
        if(Array.isArray(selectorRules[rule.selector])){
            selectorRules[rule.selector].push(rule.test)
        }else{
            selectorRules[rule.selector]=[rule.test]
        }
        if(inputElement){
            //TH: blur
            inputElement.onblur=function(){
                validate(inputElement, rule)
            }
            //TH: nhập vào input
            inputElement.oninput=function(){
                let errorElement=inputElement.parentElement.querySelector('.form-message')
                errorElement.innerText=''
                inputElement.parentElement.classList.remove('invalid')
            }
        }
    })   
}