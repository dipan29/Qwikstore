const router = require("express").Router();
const Keys = require('../models/Keys');
require('dotenv').config();

router.post('/create', async (req, res) => {
    let owner = req.body.owner ? req.body.owner : null;
    let api_key = get_api_key();
    const client_ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    Keys.findOne({ api_key })
        .then(async key => {
            if (!key) {
                const newKey = new Keys({ id: get_random(6), owner: owner, api_key: api_key, client_ip: client_ip });
                await newKey.save();
            } else {
                api_key = get_api_key();
                const newKey = new Keys({ id: get_random(6), owner: owner, api_key: api_key, client_ip: client_ip });
                await newKey.save();
            }
            console.log("\x1b[33m%s\x1b[0m", `API Key Created - ${api_key} | req.IP - ${client_ip}`);
            res.status(200).json({
                "message": "Success",
                "api_key": api_key,
                "additional_text": "New API Key was created successfully. Do not lose this key. Store it in a safe place."
            });
        }).catch(err => {
            res.status(500).json({
                "message": "Server Error",
                "additional_text": err
            })
        });
});

router.post('/delete', async (req, res) => {
    const { api_key, owner } = req.body;

    Keys.findOneAndDelete({ api_key, owner }).then(async key => {
        if (key) {
            // Delete all variables here - TODO
            console.log("\x1b[33m%s\x1b[0m", `API Key Deleted - ${api_key}`);
            res.status(200).json({
                "message": "Success",
                "additional_text": "API Key Removed Successfully."
            });
        } else {
            res.status(403).json({
                "message": "Data Mismatch",
                "additional_text": "The parameters provided might not exist at all or there was a mismatch of information provided."
            })
        }
    }).catch(err => {
        res.status(500).json({
            "message": "Server Error",
            "additional_text": err
        })
    });
});

router.post('/list', async (req, res) => {
    const { access_key } = req.body;
    if (access_key === process.env.access_key) {
        Keys.find({})
            .then(keys => {
                res.status(200).send(keys);
            })
    } else {
        res.status(403).json({
            "message": "Forbidden",
            "additional_text": "You don't have appropriate permissions to view the requested resource."
        })
    }
})

router.post('/stats', async (req, res) => {
    const { api_key, owner } = req.body;
    Keys.findOne({ api_key, owner })
        .then(key => {
            if (key) {
                res.status(200).json({
                    "message": "Success",
                    api_key,
                    "Variables": key.count,
                    "last_used": key.last_used?key.last_used:null
                });
            } else {
                res.status(404).json({
                    "message": "Not Found",
                });
            }
        })
        .catch(err => {
            res.status(500).json({
                "message": "Forbidden",
                "additional_text": "You don't have appropriate permissions to view the requested resource."
            })
        })

})

function get_random(n) {
    let random_string = "";
    const charset = "0A1B2C3D4E5F6G7H8I9J0K1L2M3N4O5P6Q7R8S9T0U1V2W3X4Y5Z6A7B8C9";
    for (let i = 0; i < n; i++)
        random_string += charset.charAt(Math.floor(Math.random() * charset.length));
    return random_string;
}

function get_api_key() {
    let random_string = "";
    const charset = "0A1B2C3D4E5F6G7H8I9J0K1L2M3N4O5P6Q7R8S9T0U1V2W3X4Y5Z6A7B8C9";
    for (let i = 0; i < 4; i++)
        random_string += charset.charAt(Math.floor(Math.random() * charset.length));
    random_string += '-';
    for (let i = 0; i < 6; i++)
        random_string += charset.charAt(Math.floor(Math.random() * charset.length));
    random_string += '-';
    for (let i = 0; i < 4; i++)
        random_string += charset.charAt(Math.floor(Math.random() * charset.length));

    return random_string;
}

module.exports = router;