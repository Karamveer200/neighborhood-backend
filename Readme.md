### Sign Up

- POST - http://localhost:5000/api/auth/register
- Body -

```
{
    "name": "John Doe",
    "email": "johndoe@gmail.com",
    "password" : "123abc",
    "phoneNumber":"603786152",
    "residentialAddress":"8161 Canada way"
}
```

### Log In

- POST - http://localhost:5000/api/auth/login
- Body -

```
{
    "email": "johndoe@gmail.com",
    "password" : "123abc"
}
```

### Get Current Logged in user by token

- GET - http://localhost:5000/api/auth
- Headers -

```
authorization: {jwtToken}
```
