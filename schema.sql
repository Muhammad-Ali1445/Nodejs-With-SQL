CREATE TABLE user(
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(50) UNIQUE,
    email VARCHAR(50) NOT NULL,
    password VARCHAR(50) NOT NULL
);

-- INSERT INTO user(id,name,email,password)
-- VALUES
-- ()