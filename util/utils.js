const moment = require('moment');

const util = {
    converterObj: (obj) => {
        //console.log('obj', obj);
        return JSON.parse(JSON.stringify(obj));
    },
    getDH: () => {
        var d = new Date();
        try {
            d.toLocaleTimeString('pt-BR', { timeZone: 'America/Sao_Paulo' });
        } catch (error) {

        }
        return moment(d).format('DD-MM-YYYY HH:mm:ss');
    }
};

module.exports = util;