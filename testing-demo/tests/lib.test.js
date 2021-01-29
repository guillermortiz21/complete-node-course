const lib = require('../lib');
const db = require('../db');

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
    // You could also use .toContain('Guillermo');
  });
});

describe('getCurrencies', () => {
  it('should return supported currencies', () => {
    const result = lib.getCurrencies();
    
    // Too general
    //expect(result).toBeDefined();
    //expect(result).not.toBeNull();

    // Too specific
    //expect(result[0]).toBe('USD');
    //expect(result[1]).toBe('AUD');
    //expect(result[2]).toBe('EUR');
    //expect(result.length).toBe(3);

    // Proper we, balanced
    // Check for existence of an element
    //expect(result).toContain('USD');
    //expect(result).toContain('AUD');
    //expect(result).toContain('EUR');

    // Instead of three assertions, just one
    expect(result).toEqual(expect.arrayContaining(['EUR', 'USD', 'AUD']))
  });
})

describe('getProduct', () => {
  it('should return the product with the given id', () => {
    const result = lib.getProduct(1);
    // toBe compares the location in memory, this test will fail
    //expect(result).toBe({id: 1, price: 10});
    // we can use toEqual to check for object equality
    //expect(result).toEqual({id: 1, price: 10});
    // With toMatchObject it checks if it has at least these properties.
    //expect(result).toMatchObject({id: 1, price: 10});
    // I just care that it has the id property with a 1 as number
    expect(result).toHaveProperty('id', 1);
  });
});

describe('registerUser', () =>{
  it('should throw if username is falsy', () => {
    // Array of falsy values
    const args = [null, undefined, NaN, '', 0, false];
    args.forEach(falsy => {
      expect(() => lib.registerUser(falsy)).toThrow(Error);
    })
  })
  it('should return a user object if valid username is passed', () => {
    const result = lib.registerUser('Guillermo');
    expect(result).toHaveProperty('username', 'Guillermo');
    expect(result.id).toBeGreaterThan(0);
  });
});

describe('applyDiscount', () => {
  it('should apply 10% discount if customer has more than 10 points', () => {
    // Set the db
    db.getCustomerSync = function(customerId){
      console.log('Fake reading customer...');
      return {id: customerId, points: 20};
    }

    const order = {customerId: 1, totalPrice: 10};
    lib.applyDiscount(order);
    expect(order.totalPrice).toBe(9);
  })
});