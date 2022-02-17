const db = require("../models");

const etfDataManager = {
    bulkUpdate: async function (newdata,where, updateArchive = false) {
        try {
            const recs = await db["etfdata"].update( newdata, where);
            if (updateArchive) {
                const recs = await db["etfdataarchive"].update(newdata, where);
            }
        } catch (err) {
            console.log(err);
        }
    },
};

module.exports = etfDataManager;
