const http = require('http');
const url = require('url');
const querystring = require('querystring');
const crypto = require('crypto');
const pool = require('./db/db');
const fs = require('fs');
const bcrypt = require('bcrypt');
const path = require('path');

// Function to hash passwords (using bcrypt)
async function hashPassword(password) {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
}

// Function to generate a session ID
function generateSessionId() {
    return crypto.randomBytes(64).toString('hex');
}

// Function to authenticate a user
async function authenticateUser(email, password, callback) {
    try {
        pool.query(
            'SELECT user_id, password FROM login WHERE email = ?',
            [email],
            async (err, results) => {
                if (err) {
                    return callback(err, null);
                }
                if (results.length > 0) {
                    const hashedPassword = results[0].password;
                    const passwordMatch = await bcrypt.compare(password, hashedPassword);
                    if (passwordMatch) {
                        callback(null, results[0].user_id);
                    } else {
                        callback(null, null); // Authentication failed
                    }
                } else {
                    callback(null, null); // User not found
                }
            }
        );
    } catch (error) {
        callback(error, null);
    }
}

// Function to create a session
function createSession(userId, callback) {
    const sessionId = generateSessionId();
    const expires = Date.now() + 24 * 60 * 60 * 1000; // Session expires in 24 hours
    pool.query(
        'INSERT INTO sessions (user_id, session_id, expires) VALUES (?, ?, ?)',
        [userId, sessionId, expires],
        (err) => {
            if (err) {
                return callback(err, null);
            }
            callback(null, sessionId);
        }
    );
}

// Function to get user ID from session ID
function getUserIdFromSession(sessionId, callback) {
    pool.query(
        'SELECT user_id FROM sessions WHERE session_id = ? AND expires > ?',
        [sessionId, Date.now()],
        (err, results) => {
            if (err) {
                return callback(err, null);
            }
            if (results.length > 0) {
                callback(null, results[0].user_id);
            } else {
                callback(null, null); // Session invalid or expired
            }
        }
    );
}

// Function to delete a session (logout)
function deleteSession(sessionId, callback) {
    pool.query('DELETE FROM sessions WHERE session_id = ?', [sessionId], callback);
}

// Function to record last login time.
function recordLastLogin(userId, callback) {
    const now = new Date().toISOString().slice(0, 19).replace('T', ' '); // Format for MySQL DATETIME
    pool.query(
        'UPDATE user_info SET last_login = ? WHERE user_id = ?',
        [now, userId],
        callback
    );
}

function isLoggedIn(req) {
    return req.session && req.session.userId;
}
// Function to retrieve last login time.
function getLastLogin(userId, callback) {
    pool.query(
        'SELECT last_login FROM user_info WHERE user_id = ?',
        [userId],
        (err, results) => {
            if (err) {
                return callback(err, null);
            }
            callback(null, results.length > 0 ? results[0].last_login : null);
        }
    );
}

function getEmailsForUser(userId, callback, type = 'inbox') {
    const query = `
      SELECT e.id, e.subject, e.body, u1.email AS sender, u2.email AS recipient, e.created_at
      FROM emails e
      JOIN user_info u1 ON e.sender_id = u1.user_id
      JOIN user_info u2 ON e.recipient_id = u2.user_id
      WHERE e.${type === 'inbox' ? 'recipient_id' : 'sender_id'} = ?
      ORDER BY e.created_at DESC
    `;
    pool.query(query, [userId], callback);
  }
  
  function storeEmail(senderId, recipientEmail, subject, body, callback) {
    // First, find the recipient's user ID
    pool.query('SELECT user_id FROM user_info WHERE email = ?', [recipientEmail], (err, recipientResults) => {
        if (err) {
            return callback(err);
        }
        if (recipientResults.length === 0) {
            return callback(new Error('Recipient email not found'));
        }
        const recipientId = recipientResults[0].user_id;

        // Insert the email into the emails table
        pool.query(
            'INSERT INTO emails (sender_id, recipient_id, subject, body, created_at) VALUES (?, ?, ?, ?, NOW())',
            [senderId, recipientId, subject, body],
            callback
        );
    });
}

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const requestPath = parsedUrl.pathname;
    const method = req.method;
    let body = '';

    req.on('data', (chunk) => {
        body += chunk;
    });

    req.on('end', async () => {
        const parsedBody = querystring.parse(body);
        const cookies = parseCookies(req.headers.cookie);

        req.session = {};
        const processRequest = async () => { // Encapsulate request processing in async function
            if (cookies.session_id) {
                await new Promise((resolve) => {  //Use await here
                    getUserIdFromSession(cookies.session_id, (err, userId) => {
                        if (!err && userId) {
                            req.session.userId = userId;
                        }
                        resolve(); // Resolve the Promise
                    });
                });
            }

            // Serve static files
            if (requestPath.startsWith('/assets/')) {
                const filePath = path.join(__dirname, requestPath);
                fs.readFile(filePath, (err, data) => {
                    if (err) {
                        res.writeHead(404, { 'Content-Type': 'text/plain' });
                        res.end('File Not Found');
                        return;
                    }
                    res.writeHead(200, { 'Content-Type': 'text/css' });
                    res.end(data);
                });
            } else if (requestPath === '/' && method === 'GET') {
                // Serve the login form
                fs.readFile('./templates/login.html', 'utf8', (err, html) => {
                    if (err) {
                        res.writeHead(500, { 'Content-Type': 'text/plain' });
                        res.end('Internal Server Error');
                        return;
                    }
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.end(html);
                });
            }else if (requestPath === '/inbox' && method === 'GET') {
                                if (isLoggedIn(req)) {
                                    // Serve the inbox.html without fetching data here
                                    fs.readFile('./templates/inbox.html', 'utf8', (err, html) => {
                                        if (err) {
                                            res.writeHead(500, { 'Content-Type': 'text/plain' });
                                            res.end('Internal Server Error');
                                            return;
                                        }
                                        res.writeHead(200, { 'Content-Type': 'text/html' });
                                        res.end(html);
                                    });
                                } else {
                                    res.writeHead(401, { 'Content-Type': 'text/html' });
                                    fs.readFile('./templates/login.html', 'utf8', (err, html) => {
                                        res.end(html);
                                    });
                                }
                            } else if (requestPath === '/api/inbox' && method === 'GET') {
                                if (isLoggedIn(req)) {
                                    const userId = req.session.userId;
                                    getEmailsForUser(userId, (err, emails) => {
                                        if (err) {
                                            console.error(err);
                                            res.writeHead(500, { 'Content-Type': 'application/json' });
                                            res.end(JSON.stringify({ message: 'Failed to retrieve emails' }));
                                            return;
                                        }
                                        res.writeHead(200, { 'Content-Type': 'application/json' });
                                        res.end(JSON.stringify(emails));
                                    });
                                } else {
                                    res.writeHead(401, { 'Content-Type': 'application/json' });
                                    res.end(JSON.stringify({ message: 'Unauthorized' }));
                                }
                            } else if (requestPath === '/sent' && method === 'GET') {
                    if (isLoggedIn(req)) {
                        const userId = req.session.userId;
                        const query = `
                            SELECT e.id, e.subject, e.body, u1.email AS sender, u2.email AS recipient, e.created_at
                            FROM emails e
                            JOIN user_info u1 ON e.sender_id = u1.user_id
                            JOIN user_info u2 ON e.recipient_id = u2.user_id
                            WHERE e.sender_id = ?
                            ORDER BY e.created_at DESC
                        `;
                
                        pool.query(query, [userId], (err, results) => {
                            if (err) {
                                console.error(err);
                                res.writeHead(500, { 'Content-Type': 'application/json' });
                                res.end(JSON.stringify({ message: 'Failed to retrieve sent emails' }));
                                return;
                            }
                            res.writeHead(200, { 'Content-Type': 'text/html' });
                            fs.readFile('./templates/sent.html', 'utf8', (err, html) => {
                                if (err) {
                                    console.error('Error reading sent.html:', err);
                                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                                    res.end('Internal Server Error');
                                    return;
                                }
                                res.end(html);
                            });
                        });
                    } else {
                        res.writeHead(401, { 'Content-Type': 'text/html' });
                        fs.readFile('./templates/login.html', 'utf8', (err, html) => {
                            res.end(html);
                        });
                    }
                }
                else if (requestPath === '/api/sent' && method === 'GET') {
                    if (isLoggedIn(req)) {
                        const userId = req.session.userId;
                        getEmailsForUser(userId, (err, emails) => {
                            if (err) {
                                console.error(err);
                                res.writeHead(500, { 'Content-Type': 'application/json' });
                                res.end(JSON.stringify({ message: 'Failed to retrieve sent emails' }));
                                return;
                            }
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify(emails));
                        }, 'sent'); 
                    } else {
                        res.writeHead(401, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ message: 'Unauthorized' }));
                    }
                }
                 else if (requestPath === '/inbox' && method === 'GET') {
                fs.readFile('./templates/inbox.html', (err, data) => {
                    if (err) {
                        res.writeHead(500, { 'Content-Type': 'text/plain' });
                        res.end('Internal Server Error');
                        return;
                    }
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.end(data);
                });
            } else if (requestPath === '/sent' && method === 'GET') {
                fs.readFile('./templates/sent.html', (err, data) => {
                    if (err) {
                        res.writeHead(500, { 'Content-Type': 'text/plain' });
                        res.end('Internal Server Error');
                        return;
                    }
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.end(data);
                });
            }else if (requestPath === '/compose' && method === 'GET') {
                if (isLoggedIn(req)) {
                    fs.readFile('./templates/compose.html', 'utf8', (err, html) => {
                        if (err) {
                            res.writeHead(500, { 'Content-Type': 'text/plain' });
                            res.end('Internal Server Error');
                            return;
                        }
                        res.writeHead(200, { 'Content-Type': 'text/html' });
                        res.end(html);
                    });
                } else {
                    res.writeHead(401, { 'Content-Type': 'text/html' });
                    fs.readFile('./templates/login.html', 'utf8', (err, html) => {
                        res.end(html);
                    });
                }
            }
            // New route for sending emails
            else if (requestPath === '/api/send-email' && method === 'POST') {
                if (isLoggedIn(req)) {
                    try {
                        const requestBody = JSON.parse(body);
                        const { recipient, subject, body: emailBody } = requestBody;
                        const senderId = req.session.userId;

                        if (!recipient || !emailBody) {
                            res.writeHead(400, { 'Content-Type': 'application/json' });
                            return res.end(JSON.stringify({ error: 'Recipient and body are required.' }));
                        }

                        storeEmail(senderId, recipient, subject, emailBody, (err) => {
                            if (err) {
                                console.error('Error storing email:', err);
                                res.writeHead(500, { 'Content-Type': 'application/json' });
                                return res.end(JSON.stringify({ error: 'Failed to store email.' }));
                            }
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            return res.end(JSON.stringify({ message: 'Email sent and stored successfully.' }));
                        });
                    } catch (error) {
                        console.error('Error processing send email request:', error);
                        res.writeHead(400, { 'Content-Type': 'application/json' });
                        return res.end(JSON.stringify({ error: 'Invalid request body.' }));
                    }
                } else {
                    res.writeHead(401, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'Unauthorized' }));
                }
            } else if (requestPath === '/login' && method === 'POST') {
                authenticateUser(parsedBody.email, parsedBody.password, (err, userId) => {
                    if (err) {
                        res.writeHead(500, { 'Content-Type': 'text/plain' });
                        res.end('Internal Server Error');
                        return;
                    }
                    if (userId) {
                        getLastLogin(userId, (err, previousLastLogin) => {
                            if (err) {
                                console.error('Error getting last login:', err);
                            }
                            recordLastLogin(userId, (err) => {
                                if (err) {
                                    console.error('Error recording last login:', err);
                                }
                                createSession(userId, (err, sessionId) => {
                                    if (err) {
                                        res.writeHead(500, { 'Content-Type': 'text/plain' });
                                        res.end('Internal Server Error');
                                        return;
                                    }
                                    //  Redirect to /inbox after successful login
                                    res.writeHead(302, {
                                        Location: '/inbox?previousLastLogin=' + encodeURIComponent(previousLastLogin),
                                        'Set-Cookie': `session_id=${sessionId}; HttpOnly; Path=/`,
                                    });
                                    res.end();
                                });
                            });
                        });
                    } else {
                        fs.readFile('./templates/login.html', 'utf8', (err, html) => {
                            if (err) {
                                res.writeHead(500, { 'Content-Type': 'text/plain' });
                                res.end('Internal Server Error');
                                return;
                            }
                            //  Inserted the error message.
                            const errorHtml = html.replace(/error: none/g, 'Invalid Credentials');
                            res.writeHead(401, { 'Content-Type': 'text/html' });
                            res.end(errorHtml);
                        });
                    }
                });
            } else if (requestPath === '/logout' && method === 'POST') {
                deleteSession(cookies.session_id, (err) => {
                    if (err) {
                        res.writeHead(500, { 'Content-Type': 'text/plain' });
                        res.end('Internal Server Error');
                        return;
                    }
                    res.writeHead(302, {
                        Location: '/',
                        'Set-Cookie': `session_id=; HttpOnly; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT`,
                    });
                    res.end();
                });
            } else if (requestPath === '/register' && method === 'GET') {
                fs.readFile('./templates/register.html', 'utf8', (err, html) => {
                    if (err) {
                        res.writeHead(500, { 'Content-Type': 'text/plain' });
                        res.end('Internal Server Error');
                        return;
                    }
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.end(html);
                });

            } else if (requestPath === '/register' && method === 'POST') {
                const { email, password } = parsedBody;

                try {
                    const hashedPassword = await hashPassword(password);

                    pool.query(
                        'INSERT INTO user_info (email) VALUES (?)',
                        [email],
                        (err, results) => {
                            if (err) {
                                // Redirect to 404.html instead of sending JSON
                                fs.readFile('./templates/404.html', 'utf8', (readErr, html) => {
                                    if (readErr) {
                                        // If 404.html is not found, send a generic 500 error
                                        res.writeHead(500, { 'Content-Type': 'text/plain' });
                                        res.end('Internal Server Error');
                                    } else {
                                        res.writeHead(404, { 'Content-Type': 'text/html' });
                                        res.end(html);
                                    }
                                });
                                return;
                            }

                            const userId = results.insertId;

                            pool.query(
                                'INSERT INTO login (user_id, email, password) VALUES (?, ?, ?)',
                                [userId, email, hashedPassword],
                                (err) => {
                                    if (err) {
                                        pool.query(
                                            'DELETE FROM user_info WHERE user_id = ?',
                                            [userId],
                                            (rollbackErr) => {
                                                if (rollbackErr) {
                                                    console.error('Rollback failed:', rollbackErr);
                                                }
                                                // Redirect to 404.html instead of sending JSON
                                                fs.readFile('./templates/404.html', 'utf8', (readErr, html) => {
                                                    if (readErr) {
                                                        // If 404.html is not found, send a generic 500 error
                                                        res.writeHead(500, { 'Content-Type': 'text/plain' });
                                                        res.end('Internal Server Error');
                                                    } else {
                                                        res.writeHead(404, { 'Content-Type': 'text/html' });
                                                        res.end(html);
                                                    }
                                                });
                                                return;
                                            }
                                        );
                                        return;
                                    }

                                    // Redirect to login page after successful registration
                                    res.writeHead(302, { 'Location': '/' });
                                    res.end();
                                }
                            );
                        }
                    );
                } catch (err) {
                    console.error('Error hashing password:', err);
                    // Redirect to 404.html instead of sending JSON
                    fs.readFile('./templates/404.html', 'utf8', (readErr, html) => {
                        if (readErr) {
                            // If 404.html is not found, send a generic 500 error
                            res.writeHead(500, { 'Content-Type': 'text/plain' });
                            res.end('Internal Server Error');
                        } else {
                            res.writeHead(404, { 'Content-Type': 'text/html' });
                            res.end(html);
                        }
                    });
                }
            } else {
                fs.readFile('./templates/404.html', 'utf8', (readErr, html) => {
                    if (readErr) {
                        res.writeHead(500, { 'Content-Type': 'text/plain' });
                        res.end('Internal Server Error');
                    } else {
                        res.writeHead(404, { 'Content-Type': 'text/html' });
                        res.end(html);
                    }
                });
            }
        };
        processRequest(); // Start the request processing
    });
});

server.listen(3000, () => {
    console.log('Server listening on port 3000');
});



function parseCookies(cookieString) {
    const cookies = {};
    if (cookieString) {
        cookieString.split(';').forEach((cookie) => {
            const parts = cookie.split('=');
            cookies[parts[0].trim()] = parts[1];
        });
    }
    return cookies;
}
