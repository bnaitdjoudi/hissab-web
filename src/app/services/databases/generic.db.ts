export declare interface GenericDataBase<T, ID> {
  create(model: T): Promise<any>;

  update(model: T, id: ID): Promise<T>;

  findById(id: ID): Promise<T>;

  findAll(): Promise<T[]>;

  deleteById(ids: ID[]): Promise<void>;
}
