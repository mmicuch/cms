import express from 'express';
import {authenticate} from '../service/Security.js';
const router = express.Router();

/**
 * Prihlasovaci formular
 */
router.get("/login", function (req, res) {
    res.render('user/login.html.njk');
});

/**
 * Kontrola prihlasovacich udajov a prihlasenie pouzivatela
 */
router.post("/check", async function (req, res) {
    let user = await authenticate(req.body.username, req.body.password);
    if (user) {
        req.session.user = user; // Uložíme používateľa do session
        req.session.save(() => { // Ensure session is saved before redirect
            res.flash('info', 'Boli ste prihlásený.'); // Flash message
            res.redirect('/'); // Presmerovanie na hlavnú stránku po úspešnom prihlásení
            console.log('Prihlásený používateľ:', req.session.user.username);  // Správne vypíše meno prihláseného používateľa
        });
    } else {
        console.log('Login failed');  // Vypíše do terminálu, ak sa prihlásenie nezrealizuje
        res.flash('error', 'Nesprávne meno alebo heslo.');  // Flash message
        res.redirect('/user/login');  // Presmerovanie na login stránku
    }
});


/**
 * Odhlasenie pouzivatela
 */
router.get("/logout", function (req, res) {
    let sessionName = req.session.name;
    req.session.destroy(function(err) {
        if (err) {
            console.error(err);
        } else {
            console.log('Logout OK');
            res.clearCookie(sessionName);
            res.redirect('/');
        }
    });
});


export {router as UserController}