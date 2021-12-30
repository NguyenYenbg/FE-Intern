//định nghĩa các rules
Validator.isRequired=function(selector, message){
    return{
        selector: selector,
        test: function(value){
            return value.trim() ? undefined : message || 'Please enter this field'
        }
    }
}
Validator.isEmail=function(selector, message){
    return{
        selector: selector,
        test: function(value){
            var regex=/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined : message || 'Please enter the correct email format'
        }
    }
}
Validator.hasLowerUpperCase=function(selector, message){
    return{
        selector: selector,
        test: function(value){
            var regex=/^(?=.*[a-z])(?=.*[A-Z])/;
            return regex.test(value) ? undefined : message || 'Please enter at least 1 uppercase and 1 lowercase'
        }
    }
}
Validator.specialCharacters=function(selector, message){
    return{
        selector: selector,
        test: function(value){
            var regex=/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
            return !regex.test(value) ? undefined : message || 'This field contains no special characters'
        }
    }
}
Validator.minLength=function(selector, min, message){
    return{
        selector: selector,
        test: function(value){
            return value.length >= min ? undefined : message || `Please enter more than ${min} characters`;
        }
    }
}
Validator.maxLength=function(selector, max, message){
    return{
        selector: selector,
        test: function(value){
            return value.length <= max ? undefined : message || `Please enter less than ${max} characters`;
        }
    }
}
Validator.isConfirmed=function(selector, getConfirmValue, message){
    return{
        selector: selector,
        test: function(value){
            return value === getConfirmValue() ? undefined : message || 'Input value is incorrect';
        }
    }
}

//function Validator
function Validator(options){
    var formElement=document.querySelector(options.form);
    var selectorRules={};

    function getParent(element,selector){
        while(element.parentElement){
            if(element.parentElement.matches(selector)){
                return element.parentElement;
            }
            element=element.parentElement;
        }
    }

    function validate(inputElement, rule){
        var errorElement=getParent(inputElement, options.formGroupSelector).querySelector(options.errorSelector);
        var errorMessage;
        //lấy ra các rule của selector
        var rules=selectorRules[rule.selector];
        for(var i=0; i<rules.length; ++i){
            errorMessage=rules[i](inputElement.value);
            if(errorMessage) break;
        }
        if(errorMessage){
            errorElement.innerText=errorMessage;
            getParent(inputElement, options.formGroupSelector).classList.add('invalid');
        }else{
            errorElement.innerText='';
            getParent(inputElement, options.formGroupSelector).classList.remove('invalid');
        }
        return !errorMessage;
    }
    
    if(formElement){
        //khi submit form
        formElement.onsubmit=function(e){
            e.preventDefault();
            var isFormValid=true;
            options.rules.forEach(function(rule){
                var inputElement=formElement.querySelector(rule.selector);
                var isValid=validate(inputElement, rule);
                if(!isValid){
                    isFormValid=false;
                }
            });
            if(isFormValid){
                if(typeof options.onSubmit === 'function'){
                    var enableInputs=formElement.querySelectorAll('[name]');
                    var formValues=Array.from(enableInputs).reduce(function(values, input){
                        values[input.name]=input.value;
                        return values;
                    }, {});
                    options.onSubmit(formValues);
                }else{
                    formElement.submit();
                }
            }
        }

        //lặp qua từng rule
        options.rules.forEach(function(rule){
            var inputElement=formElement.querySelector(rule.selector);

            //luu lai cac rule cho moi input
            if(Array.isArray(selectorRules[rule.selector])){
                selectorRules[rule.selector].push(rule.test);
            }else{
                selectorRules[rule.selector]=[rule.test];
            }

            if(inputElement){
                //TH: blur
                inputElement.onblur=function(){
                    validate(inputElement, rule);
                }

                //TH: nhập vào input
                inputElement.oninput=function(){
                    var errorElement=getParent(inputElement, options.formGroupSelector).querySelector(options.errorSelector);
                    errorElement.innerText='';
                    getParent(inputElement, options.formGroupSelector).classList.remove('invalid');
                }
            }
        })
    }
}