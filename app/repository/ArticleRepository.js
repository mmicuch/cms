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

export {findAll, findFirst, find};