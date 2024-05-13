// jest.setup.js

// Setting up global.fetch mock before all tests
beforeAll(() => {
    global.fetch = jest.fn();

});

beforeEach(() => {
    fetch.mockClear();
});

afterEach(() => {
    jest.restoreAllMocks();
});

// Example test using the mocked fetch
test('example test', async () => {
    // Assuming we are testing a function that makes a fetch call to '/api/login'
    const response = await someFunctionThatCallsFetch();

    // Example function call
    expect(response).toEqual({ message: 'Logged in successfully' });
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/api/login'));

    // Additional logic based on the response could also be tested here
});
