/* eslint-disable */
var format = function( source, params ) {
    for (let i = 0, len = params.length; i < len; i++) {
        let regx = new RegExp('\\{' + i +'\\}', 'g');
        source = source.replace(regx, params[i]);
    }
	return source;
}

var dealResult = function (value, regx) {
    return Validator.rules.required({value: value}) ? regx : true;
}

var Validator = {
    rules: {
        required: function ({value}) {
            return value !== undefined && value !== null && value.length > 0;
        },
        positiveInteger: function ({value}) {
            return dealResult(value, /^([1-9]\d)*$/.test(value));
        },
        number: function ({value}) {
            return dealResult(value, /^(?:-?\d+|-?\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(value));
        },
        digits: function ({value}) {
            return dealResult(value, /^\d*$/.test(value));
        },
        email: function ({value}) {
            return dealResult(value, /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(value));
        },
        phone: function ({value}) {
            return dealResult(value, /^1\d{10}$/.test(value));
        },
        fax: function ({value}) {
            return dealResult(value, /^(([0\+]\d{2,3}-)?(0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/.test(value));
        },
        idCard: function ({value}) {
            return dealResult(value, /^\d{15}$|^\d{18}$|^\d{17}(\d|X|x)$/.test(value));
        },
        maxlength: function ({value, condition}) {
            return dealResult(value, value.length < condition);
        },
        minlength: function ({value, condition}) {
            return dealResult(value, value.length > condition);
        },
        max: function ({value, condition}) {
            return dealResult(value, Number(value) < Number(condition));
        },
        min: function ({value, condition}) {
            return dealResult(value, Number(value) > Number(condition));
        },
        Chinese: function ({value}) {
            return dealResult(value, /^[\u4E00-\u9FA5]*$/.test(value));
        },
        equalTo: function ({value, condition}) {
            return dealResult(value, value === condition);
        }
    },
    messages: {
        required: '{0}不能为空',
        positiveInteger: '{0}必须是正整数',
        number: '{0}必须是合法的数字',
        digits: '{0}只能包含数字',
        email: '邮箱格式不正确',
        phone: '手机号格式不正确',
        equalTo: '两个值不相等',
        idCard: '身份证号格式不正确',
        fax: '电话号码格式不正确',
        maxlength: '{0}最大长度为{1}',
        minlength: '{0}最小长度为{1}',
        max: '{0}不能大于{1}',
        min: '{0}不能小于{1}',
        Chinese: '{0}只能包含中文'
    },
    check: function (els, callback) {
        var _this = this;
        let cache = {};
        let msgs = [];
        els.forEach((el, index) => {
            for (let i = 0, len = el.rules.length; i < len; i++) {
                let result = true;
                let _rule = [];
                let obj = el.rules[i];
                if (Object.prototype.toString.call(obj.name) === '[object RegExp]') { // 如果是自定义的正则表达式
                    result = obj.name.test(el.value);
                } else {
                    _rule = obj.name.split(':'); // 规则字段按:分割，例如 maxlength:12
                    result = _this.rules[_rule[0]]({
                        value: el.value, 
                        condition: _rule[1]
                    });
                }
                if (!result) {
                    let msg = obj.msg || format(_this.messages[_rule[0]], [
                        el.name, 
                        _rule[1]
                    ]);
                    cache[el.key || index] = msg;
                    msgs.push(msg)
                    break;
                }
            }
        });
        callback && callback(msgs[0], cache); 
        return msgs.length === 0;
    },
    addRule: function (ruleName, fn, msg) {
        this.rules[ruleName] = fn;
        this.messages[ruleName] = msg;
    }
}

export default Validator;