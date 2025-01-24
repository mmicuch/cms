import express from 'express';
import * as Db from '../service/Database.js';
import * as ArticleRepository from '../repository/ArticleRepository.js';
import * as ArticleService from '../service/ArticleService.js';
import {authorize} from '../service/Security.js';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { rename } from 'fs/promises';
import { stat } from 'fs/promises';

// Pomocne funkcie
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Adresar kam sa budu ukladat subory
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../public/uploads/'));
    },
    filename: (req, file, cb) => {
        const articleId = req.body.id || 0;
        cb(null, `${articleId}.jpg`);
    }
});

const upload = multer({ storage: storage });

const router = express.Router();

router.use(express.urlencoded({ extended: true }));

/**
 * Zoznam clankov
 */
router.get("/", async (req, res) => {
    let articles = await Db.query(
        'SELECT * FROM articles'
    );

    res.render('article/index.html.njk', {
        articles: articles
    });
});

router.post("/edit/:articleId", authorize('admin'), upload.single('image'), async (req, res) => {
    let article = req.body;
    // pozor, z formulara pride ID ako retazec
    article.id = Number.parseInt(article.id);

    let insertId = await ArticleService.saveArticle(article);

    if (article.id === 0) {
        try {
            let oldName = path.join(__dirname, '../public/uploads/') + `0.jpg`;
            let newName = path.join(__dirname, '../public/uploads/') + `${insertId}.jpg`;
            await rename(oldName, newName); 
        } catch {
        }
    }

    res.redirect('/article');
});

/**
 * Upravit alebo vytvorit clanok
 */
router.get("/edit/:articleId", authorize('admin'), async (req, res) => {
    let articleId = req.params.articleId;

    let article = await ArticleRepository.find(articleId);

    // ak sa clanok nenasiel, vytvorim novy
    if (article === null) {
        article = {
            id: 0,
            title: '',
            content: ''
        }
    }

    res.render('article/edit.html.njk', {
        article: article
    });
});

/**
 * Vymazat clanok
 */
router.get("/delete/:articleId", authorize('admin'), async (req, res) => {
    const articleId = parseInt(req.params.articleId, 10);

    if (isNaN(articleId)) {
        res.status(400).send('Invalid article ID');
        return;
    }

    try {
        const deleted = await ArticleService.deleteArticle(articleId);
        if (deleted) {
            res.redirect('/article'); // Presmerovanie po úspešnom vymazaní
        } else {
            res.status(404).send('Article not found');
        }
    } catch (error) {
        console.error('Error deleting article:', error);
        res.status(500).send('Server error while deleting the article');
    }
});

router.get("/", async (req, res) => {
    const sortBy = req.query.sortBy || 'event_date';
    const sortOrder = req.query.sortOrder || 'ASC';
    const articles = await Db.query(
        `SELECT * FROM articles WHERE event_date >= NOW() ORDER BY ${sortBy} ${sortOrder}`
    );

    res.render('article/index.html.njk', {
        articles: articles
    });
});

router.get("/", async (req, res) => {
    const articles = await Db.query(
        'SELECT * FROM articles WHERE event_date >= NOW() ORDER BY event_date ASC'
    );

    res.render('article/index.html.njk', {
        articles: articles
    });
});

router.get("/:articleId", async (req, res) => {
    const articleId = req.params.articleId;
    const article = await ArticleRepository.find(articleId);
    const comments = await Db.query('SELECT * FROM comments WHERE article_id = ?', [articleId]);

    res.render('article/detail.html.njk', {
        article: article,
        comments: comments
    });
});

router.post("/:articleId/comments", async (req, res) => {
    const articleId = req.params.articleId;
    const { author, content } = req.body;

    await Db.query('INSERT INTO comments (article_id, author, content) VALUES (?, ?, ?)', [articleId, author, content]);

    res.redirect(`/article/${articleId}`);
});

export {router as ArticleController}