import { faker } from '@faker-js/faker';

import Todo, { ITodo } from '@/models/todo.model';

// Generates a random todo object for testing.

export const createTodoProfile = (overrides = {}): any => ({
  title: faker.lorem.sentence(),
  description: faker.lorem.paragraph(),
  priority: faker.helpers.arrayElement(['low', 'medium', 'hard']),
  completed: faker.datatype.boolean(),
  dueDate: faker.date.future(),
  ...overrides
});

// Creates and saves a random todo to the database.

export const createTestTodo = (overrides = {}): Promise<ITodo> => {
  return Todo.create(createTodoProfile(overrides));
};

