const { Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const chromedriver = require('chromedriver');

module.exports = {
  // Function to initialize a new WebDriver instance
  getDriver: function() {
    const options = new chrome.Options();
    // Additional options can be set here if needed, such as options.addArguments('headless') for headless browsing
    
    return new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .withCapabilities({ browserName: 'chrome' })
      .build();
  },

  // Define other global settings for your Selenium tests
  baseUrl: 'http://localhost:3000', // Base URL for your application

  // Timeouts for various operations
  timeouts: {
    script: 5000,
    pageLoad: 10000,
    implicit: 3000
  }
};
