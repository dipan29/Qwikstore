const router = require("express").Router();
const startTime = new Date();


router.get('/', async (req, res) => {
    // console.log("\x1b[31m%s\x1b[0m", '\nDatabase Update Started.\n');
    res.status(200).send(`Qwikstore API Running Successfully.<br/><br/>Last refresh at ${startTime}`);
});


module.exports = router;