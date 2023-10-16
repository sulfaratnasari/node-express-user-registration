require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { pool } = require('../config.js');
const bcrypt = require('bcrypt');
const app = express();

app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);
app.use(cors());

async function isUserExists(email) {
    return new Promise(resolve => {
        pool.query('SELECT * FROM Users WHERE Email = $1', [email], (error, results) => {
            if (error) {
                throw error;
            }

            return resolve(results.rowCount > 0);
        });
    });
}

async function getUser(email) {
    return new Promise(resolve => {
        pool.query('SELECT * FROM Users WHERE Email = $1', [email], (error, results) => {
            if (error) {
                throw error;
            }

            return resolve(results.rows[0]);
        });
    });
}

function authenticate(request) {
    let api_key = request.header("api-key");
    return api_key == "HiJhvL$T27@1u^%u86g"
}

const getUsers = (request, response) => {
    if (!authenticate(request)) {
        return response.status(400).json({ error: "API key is missing." });
    }

    pool.query('SELECT * FROM Users', (error, results) => {
        if (error) {
            return response.status(500).json({error:"Something went wrong. Please try again later."});
        }

        const rows = results.rows.map(user => {
            return {
                user_id: user.id,
                name: user.name,
                email: user.email,
                address: user.address,
                photos: user.photos,
                creditcard: {
                    type: user.creditcard_type,
                    number: user.creditcard_number,
                    name: user.creditcard_name,
                    exired: user.creditcard_expired,
                }
            };
        });

        const users = {
            count: results.rows.length,
            rows: rows
        }

        response.status(200).json(users);
    });
};

const createUser = (request, response) => {
    if (!authenticate(request)) {
        return response.status(400).json({ error: "API key is missing." });
    }
    const saltRounds = 10;
    const { name, address, email, password, photos, creditcard_type, creditcard_number, creditcard_name, creditcard_expired, creditcard_cvv } = request.body;

    if (!name || name.length === 0) {
        return response.status(400).json({ status: 'failed', message: 'Name is required.' });
    }

    if (!email || email.length === 0) {
        return response.status(400).json({ status: 'failed', message: 'Email is required.' });
    }

    if (!password || password.length === 0) {
        return response.status(400).json({ status: 'failed', message: 'Password is required' });
    }

    isUserExists(email).then(isExists => {
        if (isExists) {
            return response.status(400).json({ status: 'failed', message: 'Email is taken.' });
        }

        bcrypt.hash(password, saltRounds, (error, encryptedPassword) => {
            if (error) {
                throw error;
            }

            pool.query('INSERT INTO Users (name, address, email, password, photos, creditcard_type, creditcard_number, creditcard_name, creditcard_expired, creditcard_cvv) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)', [name, address, email, encryptedPassword, photos, creditcard_type, creditcard_number, creditcard_name, creditcard_expired, creditcard_cvv], error => {
                if (error) {
                    return response.status(500).json({error:"Something went wrong. Please try again later."});
                }

                getUser(email).then(user => {
                    user = {
                        user_id: user.id,
                    };

                    response.status(201).json(user);
                });
            });
        });
    }, error => {
        response.status(400).json({ status: 'failed', message: 'Error while checking is user exists.' });
    });
};

const getUserById = (request, response) => {
    if (!authenticate(request)) {
        return response.status(400).json({ error: "API key is missing." });
    }
    const userId = request.params.userId

    pool.query('SELECT * FROM Users WHERE id = $1', [userId], (error, results) => {
        if (error) {
            return response.status(500).json({error:"Something went wrong. Please try again later."});
        }

        const users = {
            user_id: results.rows[0].id,
            name: results.rows[0].name,
            email: results.rows[0].email,
            address: results.rows[0].address,
            photos: results.rows[0].photos,
            creditcard: {
                type: results.rows[0].creditcard_type,
                number: results.rows[0].creditcard_number,
                name: results.rows[0].creditcard_name,
                exired: results.rows[0].creditcard_expired,
            }
        }

        response.status(200).json(users);
    });

};

const updateUser = (request, response) => {
    if (!authenticate(request)) {
        return response.status(400).json({ error: "API key is missing." });
    }
    const { user_id, name, address, photos, email, creditcard_type, creditcard_number, creditcard_name, creditcard_expired, creditcard_cvv } = request.body;

    pool.query('UPDATE Users SET name = $1, address = $2, email = $3, creditcard_type =$4, creditcard_number =$5, creditcard_name = $6, creditcard_expired = $7, creditcard_cvv = $8, photos = $9 where id = $10', [name, address, email, creditcard_type, creditcard_number, creditcard_name, creditcard_expired, creditcard_cvv, photos, user_id], error => {
        if (error) {
            return response.status(500).json({error:"Something went wrong. Please try again later."});
        }

        getUser(email).then(user => {
            user = {
                user_id: user.id,
            };

            response.status(200).json({ success: true });
        });
    });

};

app.route('/user/register').post(createUser);
app.route('/user/list').get(getUsers)
app.route('/user/:userId').get(getUserById);
app.route('/user/update').patch(updateUser)
app.get('/', (request, response) => {
    response.json('Simple User Registration API using Node Express with PostgreSQL');
});

app.listen(process.env.PORT || 3000, () => {
    console.log(`App running on port ${process.env.PORT || 3000}.`);
});