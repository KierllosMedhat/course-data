import { Injectable } from '@angular/core';

export interface User {
  id: number;
  name: string;
}

// TODO: Add the @Injectable decorator to provide this service at the root level
// @Injectable({ ... })
export class UserService {
  // TODO: Create a private array of mock users (or use a Signal for modern state)
  // private users: User[] = [ ... ];

  // TODO: Create a method 'getUsers()' that returns the array of users

  // TODO: Create a method 'addUser(name: string)' that adds a new user with a unique ID

  // TODO: Create a method 'deleteUser(id: number)' that removes a user by ID
}

// ---------------------------------------------------------
// COMPONENT
// ---------------------------------------------------------
import { Component } from '@angular/core';
// import { UserService } from './user.service';

@Component({
  selector: 'app-user-list',
  standalone: true,
  template: `
    <div class="user-list">
      <h2>User Directory</h2>
      <!-- TODO: Build a form/input to add new users -->

      <ul>
        <!-- TODO: Loop over the users provided by the service -->
        <!-- Provide a delete button for each user -->
      </ul>
    </div>
  `
})
export class UserListComponent {
  // TODO: Inject the UserService
  
  // TODO: Create an 'users' property that gets the data from the service

  // TODO: Create methods to handle adding and deleting users via the service
}
