export interface BaseEntity {
  id: number;
}

export class Repository<T extends BaseEntity> {
  private items: T[] = [];

  getAll(): T[] {
    return this.items;
  }

  getById(id: number): T | undefined {
    return this.items.find(item => item.id === id);
  }

  add(item: T): void {
    this.items.push(item);
  }

  update(id: number, data: Partial<T>): void {
    const item = this.getById(id);
    if (item) {
      Object.assign(item, data);
    }
  }

  delete(id: number): void {
    this.items = this.items.filter(item => item.id !== id);
  }
}
