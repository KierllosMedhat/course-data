// Legacy code example for AI Refactoring Practice
// Paste this into an AI tool and ask it to refactor using modern ES6+ features!

function getUserData(userId) {
    var result = {
        success: false,
        data: null,
        error: null
    };

    fetch('https://jsonplaceholder.typicode.com/users/' + userId)
        .then(function(response) {
            if (response.status === 200) {
                response.json().then(function(data) {
                    // Manual assignment instead of spread/destructuring
                    var user = {};
                    user.id = data.id;
                    user.name = data.name;
                    user.email = data.email;
                    
                    // Old way of checking nested properties safely
                    if (data.address && data.address.geo && data.address.geo.lat) {
                        user.latitude = data.address.geo.lat;
                    } else {
                        user.latitude = "Unknown";
                    }

                    result.success = true;
                    result.data = user;
                    console.log("User fetched successfully");
                    console.log(result);
                });
            } else {
                result.error = "Failed to fetch. Status: " + response.status;
                console.log(result);
            }
        })
        .catch(function(err) {
            result.error = err.message;
            console.log(result);
        });
}

// Test the function
getUserData(1);
