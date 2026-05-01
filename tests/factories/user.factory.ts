import { faker } from '@faker-js/faker';

import User, { IUser } from '@/models/user.model';

// Generates a random user profile object for testing.

export const createUserProfile = (overrides = {}): any => ({
  name: faker.person.fullName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
  ...overrides
});

// Creates and saves a random user to the database.

export const createTestUser = (overrides = {}): Promise<IUser> => {
  return User.create(createUserProfile(overrides));
};

