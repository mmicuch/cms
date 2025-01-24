import express from 'express';
import * as ArticleRepository from '../repository/ArticleRepository.js';
const router = express.Router();

/**
 * Uvodna stranka
 */
router.get("/", async (req, res) => {
    console.log(req.session)
    res.render('index/index.html.njk', {
        article: await ArticleRepository.findFirst(),
        user: req.session.user
    });
});

export {router as IndexController}