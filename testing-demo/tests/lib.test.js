const lib = require('../lib');

// group related test
describe('absolute', () =>{
  // test function, two arguments: name and function that does the test
  it('should return a positive number if input is positive', () => {
    const result = lib.absolute(1);
    // Make an assertion to validate that the result is correct
    // expect result to be 1. "toBe(1)" is called a matcher function
    expect(result).toBe(1);
  });
  
  it('should return a positive number if input is positive', () => {
    const result = lib.absolute(-1);
    expect(result).toBe(1);
  });
  
  it('should return a 0 input is 0', () => {
    const result = lib.absolute(0);
    expect(result).toBe(0);
  });
})

describe('greet', () => {
  it('should return the greeting message', () => {
    const result = lib.greet('Guillermo');
    // Test not too specific, as long as we have Guillermo in the
    // message, it is okay.
    expect(result).toMatch(/Guillermo/);
  });
});