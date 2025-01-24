import express from 'express';
import * as Db from '../service/Database.js';
import * as ArticleRepository from '../repository/ArticleRepository.js';
import * as ArticleService from '../service/ArticleService.js';
import {authorize} from '../service/Security.js';

const router = express.Router();

/**
 * Zoznam clankov
 */
router.get("/", async (req, res) => {
    let articles = await Db.query('SELECT * FROM articles');
    res.render('article/index.html.njk', { articles: articles });
});

router.post("/edit/:articleId", authorize('admin'), async (req, res) => {
    let article = req.body;
    article.id = Number.parseInt(article.id); // Conversion of ID to number
    await ArticleService.saveArticle(article);
    res.redirect('/article');
});

/**
 * Upravit alebo vytvorit clanok
 */
router.get("/edit/:articleId", authorize('admin'), async (req, res) => {
    let articleId = req.params.articleId;
    let article = await ArticleRepository.find(articleId);
    if (article === null) {
        article = { id: 0, title: '', content: '' };
    }
    res.render('article/edit.html.njk', { article: article });
});

// Mazanie článku
router.get("/delete/:articleId", authorize('admin'), async (req, res) => {

    try {
        let articleId = Number.parseInt(req.params.articleId);
        console.log(`Attempting to delete article with ID: ${articleId}`); // Logging
        await ArticleRepository.deleteEvent(articleId);
        console.log(`Article with ID: ${articleId} deleted successfully`);
        res.redirect('/article');
    } catch (error) {
        console.error(`Error deleting article: ${error.message}`);
        res.status(500).send('Internal Server Error');
    }

});

export { router as ArticleController };
