import {
  Form as VeeForm,
  Field as VeeField,
  ErrorMessage,
  defineRule,
  configure
} from 'vee-validate';

import { required, email, max, min, regex } from '@vee-validate/rules';

export default {
  install(app) {
    app.component('VeeForm', VeeForm);
    app.component('VeeField', VeeField);
    app.component('ErrorMessage', ErrorMessage);

    defineRule('required', required);
    defineRule('email', email);
    defineRule('max', max);
    defineRule('min', min);
    defineRule('regex', regex);

    configure({
      generateMessage: (ctx) => {
        const messages = {
          required: `${ctx.field} is required`,
          email: `Enter a valid email`,
          max: `${ctx.field} too long`,
          min: `${ctx.field} too short`,
          regex: `${ctx.field} must contain letter, number and symbol`
        };

        const message = messages[ctx.rule.name]
          ? messages[ctx.rule.name]
          : `This field ${ctx.field} is invalid`;

        return message;
      },

      validateOnBlur: true,
      validateOnChange: true,
      validateOnInput: true,
      validateOnModelUpdate: true
    });
  }
};
