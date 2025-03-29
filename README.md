# Simple Email Application

A basic email application built with Node.js and MySQL.

## Features

* User registration and login.
* Sending and receiving emails.
* Displaying email inbox and sent emails.

## Prerequisites

* [Node.js](https://nodejs.org/) (version 18 or higher recommended)
* [npm](https://www.npmjs.com/) (usually comes with Node.js)
* [MySQL](https://www.mysql.com/)

## Setup Instructions

1.  **Clone the repository:**

    ```bash
    git clone <repository_url>
    cd <repository_name>
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Database Setup:**

    This application requires a MySQL database. Follow these steps to set it up:

    * **Install MySQL:** If you haven't already, download and install MySQL on your system.
    * **Create a Database:** Connect to your MySQL server using a client (e.g., MySQL Workbench, DBeaver, or the command-line client) and create a new database for this application. You can use the following SQL command (replace `your_database_name` with your desired name):

        ```sql
        CREATE DATABASE your_database_name;
        USE your_database_name;
        ```

    * **Create Database Tables:** Execute the following SQL commands to create the necessary tables:

        ```sql
        CREATE TABLE user_info (
            user_id INTEGER PRIMARY KEY AUTO_INCREMENT,
            email VARCHAR(255) UNIQUE NOT NULL,
            last_login TIMESTAMP NULL
        );

        CREATE TABLE login (
            id INTEGER PRIMARY KEY AUTO_INCREMENT,
            user_id INTEGER NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            FOREIGN KEY (user_id) REFERENCES user_info(user_id)
        );

        CREATE TABLE sessions (
            session_id VARCHAR(255) PRIMARY KEY,
            user_id INTEGER NOT NULL,
            expires BIGINT NOT NULL,
            FOREIGN KEY (user_id) REFERENCES user_info(user_id)
        );

        CREATE TABLE emails (
            id INTEGER PRIMARY KEY AUTO_INCREMENT,
            sender_id INTEGER NOT NULL,
            recipient_id INTEGER NOT NULL,
            subject VARCHAR(255) NOT NULL,
            body TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (sender_id) REFERENCES user_info(user_id),
            FOREIGN KEY (recipient_id) REFERENCES user_info(user_id)
        );
        ```

    * **Handling Database Errors:**

        * **Table Already Exists:** If you get an error that a table already exists, you can try dropping the existing tables first before running the `CREATE TABLE` commands:

            ```sql
            DROP TABLE IF EXISTS emails;
            DROP TABLE IF EXISTS sessions;
            DROP TABLE IF EXISTS login;
            DROP TABLE IF EXISTS user_info;
            ```

        * **Tablespace Exists:** If you encounter an error like `#1813 - Tablespace for table '...' exists`, you might need to discard the tablespace (if your MySQL version supports it - version 5.5 or later):

            ```sql
            DISCARD TABLESPACE your_database_name.table_name;
            ```

            If `DISCARD TABLESPACE` is not available (older MySQL versions), you might need to manually delete the tablespace files from the MySQL data directory. **This is a risky operation and should be done with caution. Ensure you have a backup if possible.** The process generally involves stopping the MySQL server, locating the data directory, deleting the `.ibd` files for the affected tables, and then restarting the server.

4.  **Configure Environment Variables:**

    Create a `.env` file in the root of your project (if it doesn't exist) and add your MySQL connection details:

    ```
    DB_HOST=localhost
    DB_USER=your_mysql_username
    DB_PASSWORD=your_mysql_password
    DB_NAME=your_database_name
    ```

    Replace the placeholders with your actual MySQL credentials.

5.  **Run the application:**

    ```bash
    npm start
    ```

    This will start the server, usually on `http://localhost:3000` (or a different port specified in your configuration).

## Usage

* Open your browser and navigate to the application URL.
* You should be able to register a new account or log in with an existing one.
* Once logged in, you can view your inbox, send new emails, and see your sent emails.

