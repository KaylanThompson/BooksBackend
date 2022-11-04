const { Client } = require('pg')

const client = new Client ('postgres://localhost:5432/books')


async function createUser( {username, password, name}) {

try { 
    const { rows: [users] } = await client.query(`
    INSERT INTO users(username, password, name)
    VALUES ($1, $2, $3)
    ON CONFLICT (username) DO NOTHING
    RETURNING *;
    `, [username, password, name]);
    return users

} catch (error) {
    throw error;  
}

}

async function createEntry({userID, title, author, genre, rating}){
    try {
        const { rows: [entry] } = await client.query(`
        INSERT INTO entries("userID", title, author, genre, rating)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
        `, [userID, title, author, genre, rating]);

        return entry
    } catch (error) {
        throw error;        
    }
}











module.exports = {
    client,
    createUser,
    createEntry
}