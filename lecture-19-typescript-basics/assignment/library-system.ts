// ASSIGNMENT — Library System (TypeScript Fundamentals)

// TODO: Define an enum 'BookGenre' with values: Fiction, NonFiction, Science, History
// enum BookGenre { ... }

// TODO: Define an interface 'Book'
// It should have:
// - id (readonly number)
// - title (string)
// - author (string)
// - genre (BookGenre)
// - isAvailable (boolean)
// - publishedYear (optional number)

// TODO: Define a type alias 'LibraryResult' which is a Union type of Book | string
// type LibraryResult = ...

// TODO: Create an array of Books to act as your library database
// const library: Book[] = [ ... ];

// TODO: Write a function 'addBook' that takes a Book and adds it to the library array.
// Ensure it has a void return type.
// function addBook(book: Book): void { ... }

// TODO: Write a function 'findBookById' that takes an id (number) and returns a LibraryResult.
// If the book is found, return the Book object.
// If not found, return an error string (e.g., "Book not found").
// function findBookById(id: number): LibraryResult { ... }

// TODO: Write a function 'checkoutBook' that takes an id.
// Find the book. If available, set isAvailable to false and return true.
// If not available or not found, return false.
// function checkoutBook(id: number): boolean { ... }

// TODO: Test your functions
