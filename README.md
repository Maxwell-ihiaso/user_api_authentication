# user_api_authentication

---

![API authentication using JWT](/public/jwt_authentication_preview.png)

---

## Technology Used

- Nodejs
- Expressjs
- jsonwebtoken
- joi
- mongoose
- http-errors
- cors
- redit

---

## Usage

#### I had started developing the frontend interface prior to me pushing to this repository. You may ignore the /public & /views folder if you are concerned with just the backend. - A full web app will be pushed to a different repository once I am done with that

- if you wish to build on this repository, you can clone using;

        git clone https://github.com/Maxwell-ihiaso/user_api_authentication.git

- change to the cloned directory;

        cd user_api_authentication

- install the required dependencies using;

        npm install

You should be ready!!!

---

## Operations

---

### @route: /auth/register

### @req parameters: email & password (required)

### @res - onSuccess: {status, isloggedin, acsessToken, refreshToken}

### @res - onError: error{status, message}

---

### @route: /auth/login

### @req parameters: email & password (required)

### @res - onSuccess: {status, isloggedin, acsessToken, refreshToken}

### @res - onError: error{status, message}

---

### @route: /auth/dashboard

### @description: protected route

### @req parameters: accesstoken (must be set in headers)

                        headers {
                            Authorization: `Bearer ${accessToken}`
                        }

### @res - onSuccess: access Dashboard content

### @res - onError: protects route

---

### @route: /auth/refresh

### @description: refresh the accessToklen & RefreshToken then Blacklist previous RefreshToken

### @req parameters: refrshToken (must be set in body)

### @res - onSuccess: { acsessToken, refreshToken}

### @res - onError: Logs out

---

### @route: /auth/logout

### @description: protected route

### @req parameters: accesstoken (must be set in headers)

### @res - onSuccess: deletes refreshToken from redis cache

### @res - onError: stay logged in untill accessTeoken expires
