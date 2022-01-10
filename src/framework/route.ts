export type Handler<T> = (item: T) => Promise<T | void> | void;
export type ErrorHandler<T> = (err: unknown, item: T) => Promise<void> | void;

export class Route<T> {
  stack: Handler<T>[] = [];
  errorHandler: ErrorHandler<T> = (e) => console.error(e);

  use(handler: Handler<T>) {
    this.stack.push(handler);
    return this;
  }

  catch(handler: ErrorHandler<T>) {
    this.errorHandler = handler;
    return this;
  }

  async handle(item: T) {
    try {
      await this.stack.reduce(
        async (itemPromise: Promise<T | void>, handler) => {
          const item = await itemPromise;
          if (!item) {
            return item;
          }
          return await handler(item);
        },
        Promise.resolve(item)
      );
    } catch (e) {
      await this.errorHandler(e, item);
    }
  }
}
