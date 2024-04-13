import { isValidationOptions } from "class-validator";
import { ClassValidatorFields } from "../../domain/validators/class-validator-fields";
import { FieldsErrors } from "../../domain/validators/validator-fields-interface";
import { EntityValidationError } from "../../domain/validators/validation.error";

type Expected = {
  validator: ClassValidatorFields<any>;
  data: any;
} | (() => any);

expect.extend({
  containsErrorMessages(expected: Expected, received: FieldsErrors) {
    if (typeof expected === 'function') {
      try {
        expected();
        return isValid();
      } catch (e) {
        const error = e as EntityValidationError;
        return assertContainsErrorMessages(error.errors, received);
      }
    } else {
      const { validator, data } = expected;
      const validated = validator.validate(data);

      if (validated) {
        return isValid();
      }

      return assertContainsErrorMessages(validator.errors, received);
    }
  }
});

function assertContainsErrorMessages(expected: FieldsErrors, received: FieldsErrors) {
  const isMatch = expect.objectContaining(received).asymmetricMatch(expected);

  return isMatch
    ? isValid()
    : { message: () =>
      `The validation errors not contains ${JSON.stringify(received)}. Current: ${JSON.stringify(expected)}`
    , pass: false };
}

function isValid() {
  return {
    message: () => '',
    pass: true
  };
}
