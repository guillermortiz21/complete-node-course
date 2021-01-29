const {fizzBuzz} = require('../exercise1');

describe('fizzBuzz', () => {
  it('should throw if the input is not a number', () => {
    expect(() => fizzBuzz('')).toThrow(Error);
    expect(() => fizzBuzz(null)).toThrow(Error);
    expect(() => fizzBuzz({})).toThrow(Error);
    expect(() => fizzBuzz([])).toThrow(Error);
    expect(() => fizzBuzz(undefined)).toThrow(Error);
  });
  it('should return FizzBuzz if the input is divisible by 3 and by 5', () => {
    const result = fizzBuzz(15);
    expect(result).toEqual('FizzBuzz');
  });
  it('should return Fizz if the input is divisible only by 3', () => {
    const result = fizzBuzz(3);
    expect(result).toEqual('Fizz');
  });
  it('should return Buzz if the input is divisible only by 5', () => {
    const result = fizzBuzz(5);
    expect(result).toEqual('Buzz');
  });
  if('should return the input if it not divisible by 3 or by 5', () => {
    const result = fizzBuzz(0);
    expect(result).toEqual(0);
  });
});
