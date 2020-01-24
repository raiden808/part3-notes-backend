const palindrome = require('../utils/for_testing').palindrome

test('palindrome of a', () => {
    const result = palindrome('a')

    expect(result).toBe('a')
})

test('palindrom of React', () => {
    const result = palindrome('react')

    expect(result).toBe('tcaer')
})

test('palindrome of releveler', () => {
    const result = palindrome('releveler')

    expect(result).toBe('releveler')
})