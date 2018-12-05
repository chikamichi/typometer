import * as chai from 'chai'
import 'mocha'

const expect = chai.expect

function hello() {
  return 'Hello World!'
}

describe('Hello function', () => {
  it('should return hello world', () => {
    const result = hello()
    expect(result).to.equal('Hello World!')
  });
});
