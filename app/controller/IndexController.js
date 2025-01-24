import express from 'express';
import * as ArticleRepository from '../repository/ArticleRepository.js';
const router = express.Router();

/**
 * Uvodna stranka
 */
router.get("/", async (req, res) => {
    res.render('index/index.html.njk', {
        article: await ArticleRepository.findFirst()
    });
});

export {router as IndexController}