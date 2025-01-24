import * as Db from './Database.js';

/**
 * Ulozit clanok do databazy
 * @param article
 */
async function saveArticle(article) {
    if (article.id === 0) {
        // novy clanok
        await Db.query("INSERT INTO articles (title, content, typPodujatia, datum, miesto, region) VALUES (:title, :content, :typPodujatia, :datum, :miesto, :region)", {
                title: article.title,
                content: article.content,
                typPodujatia: article.typPodujatia,
                datum: article.datum,
                miesto: article.miesto,
                region: article.region,
            });
    } else {
        // aktualizacia clanku
        await Db.query("UPDATE articles SET title = :title, content = :content, typPodujatia = :typPodujatia, datum = :datum, miesto = :miesto, region = :region  WHERE id = :id", {
            id: article.id,
            title: article.title,
            content: article.content,
            typPodujatia: article.typPodujatia,
            datum: article.datum,
            miesto: article.miesto,
            region: article.region,
        });
    }
}
async function deleteArticle(articleId) {
    if (!articleId || typeof articleId !== 'number') {
        throw new Error('Invalid article ID');
    }

    const result = await Db.query("DELETE FROM articles WHERE id = ?", {
        id: articleId,
    });

    return result.affectedRows > 0; // Return true if article is deleted
}

export {saveArticle,deleteArticle}