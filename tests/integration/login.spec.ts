import { expect, test } from '@_src/fixtures/merge.fixture';
import { LoginUserModel } from '@_src/models/user.model';
import { testUser1 } from '@_src/test-data/user.data';
import { faker } from '@faker-js/faker/locale/en';

test.describe('Verify login', () => {
    test('login with correct credentials @GAD-R02-01', async ({
        loginPage,
    }) => {
        // Arrange
        const expectedWelcomeTitle = 'Welcome';

        // Act
        const welcomePage = await loginPage.login(testUser1);

        const title = await welcomePage.getTitle();

        // Assert
        expect(title).toContain(expectedWelcomeTitle);
    });

    test('reject login with incorrect password @GAD-R02-01', async ({
        loginPage,
    }) => {
        // Arrange
        const expectedLoginTitle = 'Login';

        const loginUserData: LoginUserModel = {
            userEmail: testUser1.userEmail,
            userPassword: faker.internet.password(),
        };

        // Act
        await loginPage.login(loginUserData);

        // Assert
        await expect
            .soft(loginPage.loginError)
            .toHaveText('Invalid username or password');
        const title = await loginPage.getTitle();
        expect.soft(title).toContain(expectedLoginTitle);
    });
});
