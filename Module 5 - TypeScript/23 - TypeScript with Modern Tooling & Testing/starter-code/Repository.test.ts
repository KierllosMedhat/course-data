import { describe, it, expect, beforeEach } from 'vitest';
import { Repository, BaseEntity } from './Repository';

interface TestItem extends BaseEntity {
  name: string;
}

describe('Repository<T>', () => {
  let repo: Repository<TestItem>;

  beforeEach(() => {
    repo = new Repository<TestItem>();
  });

  // TODO: Test that add() stores an item and getAll() returns it
  it('should store an item when add() is called', () => {
    // Write test here
  });

  // TODO: Test that getById() finds the correct item by ID
  it('should find the correct item by id', () => {
    // Write test here
  });

  // TODO: Test that getById() returns undefined for a missing ID
  it('should return undefined when getById() is called with a non-existent id', () => {
    // Write test here
  });

  // TODO: Test that update() correctly merges changes
  it('should merge changes into the item during update()', () => {
    // Write test here
  });

  // TODO: Test that delete() removes an item by ID
  it('should remove the item when delete() is called', () => {
    // Write test here
  });
});
