const { By, Key, until } = require('selenium-webdriver');
const { getDriver, baseUrl, timeouts } = require('../../selenium-config');

async function loginTest() {
    let driver = getDriver();

    try {
        await driver.manage().setTimeouts({
            pageLoad: timeouts.pageLoad,
            script: timeouts.script,
            implicit: timeouts.implicit
        });

        await driver.get(`${baseUrl}/login`);

        // Debug: Take a screenshot after loading the page
        await driver.takeScreenshot().then(function (image, err) {
            require('fs').writeFileSync('after-load.png', image, 'base64');
        });

        // Test different scenarios
        await testLoginScenario(driver, 'invalid@example.com', 'wrongPassword', 'Failed to log in');
        await testLoginScenario(driver, 'correct@example.com', 'correctPassword', 'Welcome');
        await testLoginScenario(driver, '', '', 'Please enter both email and password.');

    } catch (error) {
        console.error('Error during the test:', error);
    } finally {
        await driver.quit();
    }
}

async function testLoginScenario(driver, email, password, expectedMessage) {
    await driver.findElement(By.id('email')).clear();
    await driver.findElement(By.id('email')).sendKeys(email);

    await driver.findElement(By.id('password')).clear();
    await driver.findElement(By.id('password')).sendKeys(password);

    // Explicitly find and click the login button
    const loginButton = await driver.findElement(By.css(".MuiButton-root"));
    await loginButton.click();

    try {
        // Wait and retrieve the error message or success notification
        let errorMessage = await driver.wait(until.elementLocated(By.css("p.actual-error-class")), 20000).getText();
        console.log(`Test with ${email}: ${errorMessage.includes(expectedMessage) ? 'Passed' : 'Failed'}`);
    } catch (e) {
        console.log(`Test with ${email}: Failed to find the expected element or message. Error: ${e}`);
        // Take a screenshot and save HTML for debugging
        await driver.takeScreenshot().then(function (image, err) {
            require('fs').writeFileSync(`debug-failed-${email}.png`, image, 'base64');
        });
        const pageSource = await driver.getPageSource();
        require('fs').writeFileSync(`debug-${email}.html`, pageSource);
    }
}

loginTest();
