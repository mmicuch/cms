import * as Db from '../service/Database.js';

/**
 * Ulozit clanok do databazy
 * @param article
 */
async function saveArticle(article) {
    let result;

    if (article.id === 0) {
        // novy clanok
        result = await Db.query("INSERT INTO articles (title, content, event_type, event_date, location, region, public) VALUES (:title, :content, :event_type, :event_date, :location, :region, :public)", {
                title: article.title,
                content: article.content,
                event_type: article.event_type,
                event_date: article.event_date || new Date(), // alebo nastavte požadovaný dátum
                location: article.location,
                region: article.region,
                public: article.public || 1
            });
    } else {
        // aktualizacia clanku
        result = await Db.query("UPDATE articles SET title = :title, content = :content, event_type = :event_type, event_date = :event_date, location = :location, region = :region, public = :public WHERE id = :id", {
            id: article.id,
            title: article.title,
            content: article.content,
            event_type: article.event_type,
            event_date: article.event_date || new Date(), // alebo nastavte požadovaný dátum
            location: article.location,
            region: article.region,
            public: article.public || 1
        });
    }

    return result.insertId;
}

/**
 * Vymazat clanok z databazy
 * @param articleId
 */
async function deleteArticle(articleId) {
    if (!articleId || typeof articleId !== 'number') {
        throw new Error('Invalid article ID');
    }

    const result = await Db.query("DELETE FROM articles WHERE id = :id", {
        id: articleId,
    });

    return result.affectedRows > 0; // Vrati true, ak bol clanok vymazany, inak false
}

export { saveArticle, deleteArticle };
