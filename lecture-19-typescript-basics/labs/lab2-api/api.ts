/*
JSON Response looks like this:
{
    "id": 1,
    "name": "Leanne Graham",
    "username": "Bret",
    "email": "Sincere@april.biz"
}
*/

// TODO: 1. Create an interface 'User' that matches the JSON shape above.

// TODO: 2. Set the return type of this function to Promise<User>
async function fetchUser(id: number) {
    const response = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`);
    const data = await response.json();
    
    // TODO: 3. Cast data to User using the 'as' keyword, or type the json() return value.
    return data;
}

// TODO: 4. Test it out!
// fetchUser(1).then(user => console.log(user.name));
