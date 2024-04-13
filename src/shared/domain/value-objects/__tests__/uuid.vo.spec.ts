import { Uuid, InvalidUuidError } from '../uuid.vo';
import { validate as uuidValidate } from "uuid";

describe('UUID Value Object Unit Tests', () => {

  const validateSpy = jest.spyOn(Uuid.prototype as any, 'validate');

  test('should create a uuid with default values', () => {
    const uuid = new Uuid();
    expect(uuid.id).toBeDefined();
    expect(uuidValidate(uuid.id)).toBeTruthy();
    expect(validateSpy).toHaveBeenCalledTimes(1);
  })

  test('should create a uuid with a value', () => {
    const uuid = new Uuid('123e4567-e89b-12d3-a456-426614174000');
    expect(uuid.id).toBe('123e4567-e89b-12d3-a456-426614174000');
    expect(validateSpy).toHaveBeenCalledTimes(1);
  })

  test('should throw an error when id is invalid', () => {
    expect(() => new Uuid('invalid-uuid')).toThrowError(new InvalidUuidError());
    expect(validateSpy).toHaveBeenCalledTimes(1);
  })
})
