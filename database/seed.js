const { client, createUser, createEntry, getAllUsers } = require('./index')


async function createInitialUsers() {

    try {
        console.log("BEGINNING TO CREATE USERS");

        const kaylan = await createUser ({
            username: 'Kaylan', password: "me123", name: 'Kaylan'});

        const allyson = await createUser ({
             username: 'AllyCat', password: "ilovecats", name: 'Allyson'});

        console.log(kaylan);
        console.log(allyson)

        console.log('FINISHED CREATING USERS');
    } catch (error) {
        console.error('ERROR CREATING USERS!!');
        throw error;
    }
}


async function createInitialEntries() {
    
    try {
        const [kaylan, allyson] = await getAllUsers();

        console.log('STARTING TO CREATE ENTRIES');
        await createEntry({
            userID: kaylan.id,
            title: "A Court of Mist and Fury",
            author: "Sarah J. Maas",
            genre: "Fantasy Romance",
            rating: 5
        });

        await createEntry({
            userID: allyson.id,
            title: "Alice in Wonderland",
            author: "Lewis Carroll",
            genre: "Fantasy",
            rating: 5
        });

        console.log('FINISHED CREATING ENTRIES');

    } catch (error) {
        console.log('ERROR CREATING ENTRIES!!')
        throw error;
    }
}



async function dropTables() {

    try {
        console.log('STARTING TO DROP TABLES');

        await client.query(`
        DROP TABLE IF EXISTS entries;
        DROP TABLE IF EXISTS users;
        `);

        console.log("FINISHED DROPPING TABLES");
    } catch (error) {
        console.log('ERROR DROPPING TABLES!!');
        throw error;        
    }
}




async function createTables() {
    try {
        console.log('STARTING TO BUILD TABLES');

        await client.query(`
        CREATE TABLE users (
            id SERIAL PRIMARY KEY,
            username varchar(255) UNIQUE NOT NULL,
            password varchar(255) NOT NULL,
            name VARCHAR(255) NOT NULL
        );
        `);

        await client.query (`
        CREATE TABLE entries (
            id SERIAL PRIMARY KEY,
            "userID" INTEGER REFERENCES users(id),
            title VARCHAR(255) NOT NULL,
            author VARCHAR(255) NOT NULL,
            genre VARCHAR(255),
            rating NUMERIC
        )
        `);

        console.log('FINISHED BUILDING TABLES');


} catch (error) {
    console.error('ERROR BUILDING TABLES!!');
    throw error;

}
}

async function rebuildDatabase(){

    try {
    client.connect();

    await dropTables();
    await createTables();
    await createInitialUsers();
    await createInitialEntries();
    } catch (error) {
        console.log('ERROR DURING REBUILD!!')
    }

}

async function testDatabase() {

    try {
        console.log('STARTING TO TEST DATABASE');
        console.log('CALLING GETALLUSERS');

        const users = await(getAllUsers());
        console.log("RESULT OF GETALLUSERS", users)
        
    } catch (error) {
        
    }
}


// PLACEHOLDER FOR OTHER TEST FUNCTIONS


rebuildDatabase()
.then(testDatabase)
.catch(console.error)
.finally(() => client.end());