# validator 表单校验

## 无需改造你的vue template，也不和框架强制绑定

## 安装

    npm i @ideagays/validator --save

## 基础使用

    import Validator from "@ideagays/validator";

    let validator = new Validator(); // 构造一个实例对象
    let validatorResult = validator.check([
    {
        value: this.form.age,
        key: 'age', 
        name: '年龄',
        rules: [{ name: 'required' }, { name: 'max:90', msg: '年龄不能大于90'}]
    },], (msg, result) => {
        // to do something
    });

##  默认提供的校验规则

{0}：校验字段提供的name值

{1}：校验条件值 例如max:20中的20

| 名称      | 默认提示文案 | 说明 |
|:---------|:---------|:-------|
| required  | {0}不能为空   | 非空必填 |
| number  | {0}必须是合法的数字   | 合法数字 |
| positiveInteger  | {0}必须是正整数  | 正整数 |
| digits  | {0}只能包含数字   | 纯数字 |
| email  | 邮箱格式不正确   | 邮箱 |
| phone  | 手机号格式不正确   | 手机号 |
| idCard  | 身份证号格式不正确   | 大陆身份证 |
| fax  | 电话号码格式不正确   | 固话传真 |
| equalTo  | 两个值不相等   | 判断相等 equalTo:${otherValue}|
| maxlength  | {0}最大长度为{1}   | 最大长度 maxlength: 20 |
| minlength  | {0}最小长度为{1}   | 最小长度 minlength: 20 |
| max  | {0}不能大于{1} | 最大值 max:20 |
| min  | {0}不能小于{1} | 最小值 min:20 |
| Chinese  | {0}只能包含中文 | 中文汉字 |

## EVENTS API 

addRule 添加自定义规则，放在在check方法之前才有效

例子

    Validator.addRule('English', ({value}) => {
        return /^[a-zA-Z]*$/.test(value);  // 返回值必须是正向的
    }, '{0}只能包含英文字母');

check 校验方法

    Validator.check(Array<Object>, callback(String, Object)); // 全部校验通过返回true, 否则返回false；
    参数1：
    [{
        value: String 字段的值  必传
        key: String 作为校验结果中对象中的对应key值，一般用于表单域标红等需求  非必传
        name: String 字段名称，在不提供校验提示文案时，可用该值替换默认提示文案中的{0}  非必传  
        rules: [{
            name: String  规则名称，除了默认提供的之外，还支持正则表达式，带条件的规则写法是用:分割名称和条件值，例如max:20  必传
            msg: String  不提供字段名称name或传入自定义正则表达式时，该值必传，否则不必传
        }]  规则数组  必传
    }]
    参数2：
    callback回调函数非必传，第一个参数为校验不通过的第一个字段的提示文案；
    第2个参数为包含未通过校验字段的对象集合 例如 {'age': '年龄不能超过20'}，可用于表单域标红等需求
    

### 例子

[Demo](https://ideagay.github.io/dist/#/validator)

    <template>
        <input type="text" v-model="form.name" placeholder="姓名" :class="{'error': validator.name}">
        <input type="text" v-model="form.ename" placeholder="英文名" :class="{'error': validator.ename}">
        <input type="text" v-model="form.idCard" placeholder="身份证号" :class="{'error': validator.idCard}">
        <input type="text" v-model="form.phone" placeholder="手机号" :class="{'error': validator.phone}">
        <input type="text" v-model="form.age" placeholder="年龄" :class="{'error': validator.age}">
        <input type="text" v-model="form.psw" placeholder="密码" :class="{'error': validator.psw}">
        <input type="text" v-model="form.psw1" placeholder="重复密码" :class="{'error': validator.psw1}">
    </template>

    <script>
        import Validator from "@ideagays/validator";

        export default {
            data () {
                return {
                    form: {
                        name: "",
                        ename: "",
                        idCard: "",
                        phone: "",
                        age: "",
                        psw: "",
                        psw1: ""
                    },
                    validator: {}
                };
            },
            methods: {
                submit() {
                this.validator = Validator.check(
                    [
                    {
                        value: this.form.name,
                        key: "name",
                        name: "姓名",
                        rules: [{ name: "required" }, { name: "Chinese" }]
                    },
                    {
                        value: this.form.ename,
                        key: "ename",
                        name: "英文名",
                        rules: [{ name: "required" }, { name: 'English' }]
                    },
                    {
                        value: this.form.idCard,
                        key: 'idCard',
                        rules: [
                        { name: 'idCard' }
                        ]
                    },
                    {
                        value: this.form.age,
                        name: "年龄",
                        key: "age",
                        rules: [
                        { name: "positiveInteger" },
                        { name: "max:90" }
                        ]
                    },
                    {
                        value: this.form.phone,
                        key: "phone",
                        name: "手机号",
                        rules: [
                        { name: "phone" }
                        ]
                    },
                    {
                        value: this.form.psw,
                        key: "psw",
                        name: "密码",
                        rules: [{ name: "required" }]
                    },
                    {
                        value: this.form.psw1,
                        key: "psw1",
                        name: "重复密码",
                        rules: [
                        { name: "required" },
                        { name: `equalTo:${this.form.psw}`, msg: "两个密码不一致" }
                        ]
                    }
                    ],
                    (msg, result) => {
                        console.error(msg);
                        console.error(result);
                        this.validator = result;
                    }
                );
                }
        }
    </script>

    <style scoped>
        .error {
            border: 1px solid red;
        }
    </style>

