# Conventional Commits Cheatsheet

Professional teams use the "Conventional Commits" standard to make their git history readable and automatable.

## The Format
```
type(optional scope): description

[optional body explaining details]
```

## Types

* **feat:** A new feature for the user
* **fix:** A bug fix for the user
* **docs:** Changes to the documentation
* **style:** Formatting, missing semi colons, etc; no production code change
* **refactor:** Refactoring production code, eg. renaming a variable
* **test:** Adding missing tests, refactoring tests; no production code change
* **chore:** Updating grunt tasks etc; no production code change

## Examples

### Adding a new feature
```
feat(auth): add JWT login endpoint

Added the /api/auth/login endpoint and integrated JwtSecurityTokenHandler to issue tokens.
```

### Fixing a bug
```
fix(cart): resolve issue with negative item quantities

Added validation in the CartService to prevent quantities below 1.
```

### Updating documentation
```
docs: update README with setup instructions
```

### Refactoring code
```
refactor(products): move complex filtering to dedicated service
```
