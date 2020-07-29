# Inventory Tracker App API
### Uses: JavaScript, Node, Express, Serverless Firebase Cloud Functions

#### Base path: https://us-west2-inventory-tracker-db4a8.cloudfunctions.net/api



## AUTH

**/auth/login**
POST
*\Login user based on e-mail address and password. Returns Bearer Token, which is required for protected routes.*

Returns:

```json
{
  "token": "eyJhbGci...I6kbiDg"
}
```



-------------------



**/auth/signup**
POST
*Signup new user with e-mail, password, password confirmation, and display name. Validation is performed on all user inputs.*

Returns (on success):

```json
{
  "token": "eyJhbGci...I6kbiDg"
}
```

Returns (on failure):

```json
{
  "invalidEmail": "Invalid email address",
  "confirmPassword": "Passwords do not match"
}
```





## USER 

**/user**
GET
Protected route
*Retrieves user information based on logged in user.*

```json
{
    "bio": {
        "site": "www.christyyau.com",
        "location": "Internet",
        "bio": "Full Stack"
    },
    "salesEvents": [],
    "user": {
        "uid": "ZtP...7wc2",
        "email": "christy@gmail.com",
        "emailVerified": false,
        "photoURL": "https://firebasestorage.googleapis.com/v0/b/inventory-tracker-db4a8.appspot.com/o/e9f3e107-1483-4bdd-8655-edf870cae474.jpg?alt=media",
        "disabled": false,
        "metadata": {
            "lastSignInTime": "Wed, 29 Jul 2020 19:31:26 GMT",
            "creationTime": "Tue, 28 Jul 2020 06:53:26 GMT"
        },
        "providerData": [
            {
                "uid": "christy@gmail.com",
                "email": "christy@gmail.com",
                "photoURL": "https://firebasestorage.googleapis.com/v0/b/inventory-tracker-db4a8.appspot.com/o/e9f3e107-1483-4bdd-8655-edf870cae474.jpg?alt=media",
                "providerId": "password"
            }
        ],
        "tokensValidAfterTime": "Tue, 28 Jul 2020 06:53:26 GMT"
    }
}
```



----------------------------



**/user/image**
POST
Protected route; multipart/form-data upload
*URL stored on Firebase user (logged in) under user.photoURL*

Returns:

```
{
    "message": "e9f3e107-1483-4bdd-8655-edf870cae474.jpg successfully uploaded",
    "photoURL": "https://firebasestorage.googleapis.com/v0/b/inventory-tracker-db4a8.appspot.com/o/e9f3e107-1483-4bdd-8655-edf870cae474.jpg?alt=media"
}
```



POSTMAN:

![](C:\Development\inventory-tracker\inventory-tracker-functions\img\user-image.png)



------------------



**/user/bio**
POST
Protected route
*Update / edit user bio.  Creates a new document under user's uid if it does not exist, and updates it if document with uid is found.*

Sends:

```json
{
    "bio": "Hello I'm on Github",
    "location": "Internet",
    "site": "www.christyyau.com"
}
```

Returns:

```json
{
    "message": "Successfully updated bio for user ZtP...7wc2"
}
```

--------------



### INVENTORY

**/inventory**
GET
Protected route
*Retrieves inventory attributed to logged in user.*

```json
[
    {
        "invId": "RSyfMDgnMLSDZSoAjoHy",
        "price": 59.99,
        "itemName": "Mug",
        "uid": "ZtP...7wc2",
        "itemId": "001",
        "stock": 2,
        "itemDesc": "Cool green mug"
    },
    {
        "invId": "Tad08ZYDSYgdmmhXwhip",
        "uid": "ZtP...7wc2",
        "itemName": "Carved blue button",
        "price": 14.99,
        "itemDesc": "Really neat button",
        "itemId": "BU001",
        "stock": 20
    }
]
```



-----------------------------

**/inventory/:id**
GET
*Retrieves inventory details based on itemId.*

```json
{
    "price": 59.99,
    "itemDesc": "Cool green mug",
    "itemId": "001",
    "uid": "ZtP...7wc2",
    "stock": 2,
    "itemName": "Mug",
    "id": "RSyfMDgnMLSDZSoAjoHy"
}
```



--------------



**/inventory/add**
POST
Protected route
*Add inventory item.*

```json
{
    "price": 79.99,
    "itemDesc": "Ornamental plate",
    "itemId": "PL033",
    "uid": "ZtP76UrsXoSg7pOn44MPyDksKwc2",
    "stock": 1,
    "itemName": "Pink plate"
}
```

Returns (on success):

```json
{
    "message": "Inventory item XE8KfEdhW2motsaJYqyx added successfully"
}
```

