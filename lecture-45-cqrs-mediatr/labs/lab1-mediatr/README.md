# Lab 1: MediatR Setup

1. Install `MediatR`.
2. Register it in `Program.cs`.
3. Create a `GetProductsQuery` record and its Handler.
4. Inject `IMediator` into your controller and return the result of `await _mediator.Send(new GetProductsQuery())`.
