<template>
  <div class="validator">
    <b class="red">*</b><input type="text" v-model="form.name" placeholder="姓名" :class="{'error': validator.name}">
    <input type="text" v-model="form.ename" placeholder="英文名" :class="{'error': validator.ename}">
    <input type="text" v-model="form.idCard" placeholder="身份证号" :class="{'error': validator.idCard}">
    <input type="text" v-model="form.phone" placeholder="手机号" :class="{'error': validator.phone}">
    <input type="text" v-model="form.age" placeholder="年龄" :class="{'error': validator.age}">
    <b class="red">*</b><input type="password" v-model="form.psw" placeholder="密码" :class="{'error': validator.psw}">
    <b class="red">*</b><input type="password" v-model="form.psw1" placeholder="重复密码" :class="{'error': validator.psw1}">
    <button type="button" @click="submit">提交</button>
    <h3>校验结果：{{result}}</h3>
    <pre>{{validator}}</pre>
  </div>
</template>

<script>
/* eslint-disable */
import Validator from "@/index.js";

Validator.addRule('English', ({value}) => {
    return /^[a-zA-Z]*$/.test(value);  // 返回值必须是正向的
}, '{0}只能包含英文字母');

export default {
  name: "validator",
  data() {
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
      validator: {},
      result: ''
    };
  },
  methods: {
    submit() {
      this.result = Validator.check(
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
            rules: [{ name: 'English' }]
          },
          {
            value: this.form.idCard,
            key: 'idCard',
            name: "身份证号",
            rules: [
              { name: 'idCard', msg: '身份证号码格式不正确' }
            ]
          },
          {
            value: this.form.age,
            name: "年龄",
            key: "age",
            rules: [
              { name: "positiveInteger" }
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
          // eslint-disable-next-line
          console.error(msg);
          this.validator = result;
        }
      );
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
input{
  margin-right: 20px;
}
.red{
  color: red;
}
.error {
  border: 1px solid red;
}
</style>
