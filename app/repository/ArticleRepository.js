import * as Db from '../service/Database.js';

/**
 * Najst vsetky clanky
 */
async function findAll() {
    return await Db.query(
        'SELECT * FROM articles'
    );
}

/**
 * Najst clanok podla ID
 */
async function find(articleId) {
    let result =  await Db.query(
        'SELECT * FROM articles WHERE id=:articleId',
        { articleId: articleId }
    );

    return result.length > 0 ? result.pop() : null;
}

/**
 * Najst prvy clanok
 */
async function findFirst() {
    let articles = await Db.query(
        'SELECT * FROM articles LIMIT 1'
    );

    return articles.pop();
}
async function deleteEvent(eventId){
    await Db.query("DELETE FROM articles WHERE id = :id", {
        id: eventId,
    });
}

export {findAll, findFirst, find, deleteEvent};