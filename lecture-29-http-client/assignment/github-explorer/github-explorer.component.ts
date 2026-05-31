import { Component } from '@angular/core';
// TODO: Import HttpClient (or inject a custom GithubService)

@Component({
  selector: 'app-github-explorer',
  standalone: true,
  imports: [], // TODO: FormsModule if using ngModel
  template: `
    <div class="github-container">
      <h2>GitHub User Explorer</h2>
      
      <!-- TODO: Create an input and button to search for a GitHub username -->
      <!-- API URL: https://api.github.com/users/{username} -->
      
      <!-- TODO: Display loading state using @if -->
      
      <!-- TODO: Display error message if user not found -->

      <!-- TODO: Display User Data -->
      <!-- Show avatar, name, bio, public_repos, followers -->
      <div class="user-card">
        <!-- Profile info goes here -->
      </div>
    </div>
  `
})
export class GithubExplorerComponent {
  // TODO: Inject HttpClient
  
  // TODO: Define state variables (username string, userData object, loading boolean, error string)

  // TODO: Create a method to search the GitHub API
  // searchUser() { ... }
}
