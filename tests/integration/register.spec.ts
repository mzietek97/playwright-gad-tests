import { prepareRandomUser } from '@_src/factories/user.factory';
import { expect, test } from '@_src/fixtures/merge.fixture';
import { RegisterUserModel } from '@_src/models/user.model';

test.describe('Verify register', () => {
    let registerUserData: RegisterUserModel;

    test.beforeEach(async () => {
        registerUserData = prepareRandomUser();
    });

    test('register with correct data and login @GAD-R03-01 @GAD-R03-02 @GAD-R03-03', async ({ registerPage }) => {
        // Arrange
        const expectAlertPopupText = 'User created';
        const expectedWelcomeTitle = 'Welcome';
        const expectedLoginTitle = 'Login';

        // Act
        const loginPage = await registerPage.register(registerUserData);

        // Assert
        await expect(registerPage.alertPopUp).toHaveText(expectAlertPopupText);

        await loginPage.waitForPageToLoadUrl();
        const titleLogin = await loginPage.getTitle();
        expect.soft(titleLogin).toContain(expectedLoginTitle);

        // Assert test login
        const welcomePage = await loginPage.login({
            userEmail: registerUserData.userEmail,
            userPassword: registerUserData.userPassword,
        });
        const titleWelcome = await welcomePage.getTitle();
        expect(titleWelcome).toContain(expectedWelcomeTitle);
    });

    test('not register with incorrect data - non valid email @GAD-R03-04', async ({ registerPage }) => {
        // Arrange
        const expectErrorText = 'Please provide a valid email address';

        registerUserData.userEmail = '#$%';

        // Act
        await registerPage.register(registerUserData);

        // Assert
        await expect(registerPage.emailErrorText).toHaveText(expectErrorText);
    });

    test('not register with incorrect data - email not provided @GAD-R03-04', async ({ registerPage }) => {
        // Arrange
        const expectErrorText = 'This field is required';

        // Act
        await registerPage.userFirstNameInput.fill(registerUserData.userFirstName);
        await registerPage.userLastNameInput.fill(registerUserData.userLastName);
        await registerPage.userPasswordInput.fill(registerUserData.userPassword);
        await registerPage.registerButton.click();

        // Assert
        await expect(registerPage.emailErrorText).toHaveText(expectErrorText);
    });
});
