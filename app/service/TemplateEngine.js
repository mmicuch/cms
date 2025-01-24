import {format, parse} from 'date-fns';
import nunjucks from 'nunjucks';

function initNunjucksEnv(app) {
    // Konfiguracia sablon
    const templateEnv = nunjucks.configure('templates', {
        autoescape: true,
        noCache: process.env.NODE_ENV !== 'prod',
        express: app
    })

    // Zaregistrovat filter pre formatovanie datumov
    templateEnv.addFilter('formatDate', function (date, dateFormat) {
        try {
            return format(date, dateFormat);
        } catch (error) {
            return 'Chybný formát dátumu: ' + date;
        }
    });

    // Custom filter pre zistovanie ake roly ma pridelene pouziatel
    templateEnv.addFilter('is_granted', (user, role) => {
        if (!user) return false;
        return user.roles ? user.roles.includes(role) : false;
    }, false);
}


export {initNunjucksEnv};