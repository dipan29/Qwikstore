const router = require("express").Router();
const startTime = new Date();
const supported_types = ['number', 'string', 'boolean'];
const Keys = require('../models/Keys');
const Values = require('../models/Values');

router.get('/', async (req, res) => {
    // console.log("\x1b[31m%s\x1b[0m", '\nDatabase Update Started.\n');
    res.status(200).send(`QwikStore API Running Successfully.<br/><br/>Last refresh at ${startTime}`);
});

// Get Values of Entities - GET, POST both supported /api-key/entity or POST /content
router.all('/:api_key/:entity', async (req, res) => {
    const { api_key } = req.params;
    const { entity } = req.params;
    // console.log({api_key, entity});
    Values.findOne({ api_key, entity }).then(value => {
        if (value) {
            // res.status(200).json({
            //     "message": "Success",
            //     "content": value.content
            // });
            res.send(value.content);
        } else {
            res.status(404).json({
                "message": "Not Found",
                "content": null
            });
        }
    });
});
router.post('/content', async (req, res) => {
    const { api_key } = req.body;
    const { entity } = req.body;
    Values.findOne({ api_key, entity }).then(value => {
        if (value) {
            res.status(200).json({
                "message": "Success",
                "content": value.content
            });
        } else {
            res.status(404).json({
                "message": "Not Found",
                "content": null
            });
        }
    });
});

// Main Functions
router.post('/create', async (req, res) => {
    const { api_key } = req.body
    // TODO Update count of api key - Check if api key is valid even
    Keys.findOne({ api_key }).then(key => {
        if (key) {
            const { entity } = req.body;
            const { content } = req.body;
            let type = req.body.type ? req.body.type : (typeof content);
            if (supported_types.includes(type.toLowerCase())) {
                Values.findOne({ api_key, entity }).then(async value => {
                    if (value) {
                        value.type = type;
                        value.content = content;
                        await value.save();
                        res.status(202).json({
                            "message": "Accepted",
                            "additional_text": "The entry already exists. It has been updated.",
                            "entity_id": value.id
                        });
                    } else {
                        entity_id = get_random(6);
                        const newValue = new Values({ id: entity_id, entity, type, content, api_key });
                        await newValue.save();
                        res.status(200).json({
                            "message": "Success",
                            "entity": entity,
                            "additional_text": "New Entity has been successfully created."
                        });
                    }
                });
            } else {
                res.status(405).json({
                    "message": "Method Not Allowed",
                    "additional_text": `The provided type - ${type} is not supported yet.`
                })
            }
        } else {
            res.status(403).json({
                "message": "Forbidden",
                "additional_text": "You don't have permissions to create the requested resource. API Key invalid."
            })
        }
    }).catch(err => {
        res.status(500).json({
            "message": "Server Error",
            "additional_text": err
        })
    });
});

router.post('/set', async (req, res) => {
    const { api_key } = req.body;
    const { entity } = req.body;
    const { content } = req.body;

    Values.findOne({ api_key, entity }).then(async value => {
        if (value.type === (typeof content).toLowerCase()) {
            value.content = content,
                await value.save();
            res.status(200).json({
                "message": "Success",
                "entity_id": value.id,
                "additional_text": `Entity '${entity}' has been updated to ${content}`
            });
        } else {
            res.status(409).json({
                "message": "Mismatch / Conflict",
                "additional_text": "There was a mismatch in the resource information provided."
            })
        }
    }).catch(err => {
        res.status(404).json({
            "message": "Not Found",
            "additional_text": `Entity ${entity} does not exists or you don't have the appropriate permissions.`
        })
    });
});

// Set Data - GET Method
router.get('/set/:api_key/:entity/:value', async (req, res) => {
    const { api_key } = req.params;
    const { entity } = req.params;
    const content = req.params.value;

    Values.findOne({ api_key, entity }).then(async value => {
        // TODO Parse Content Field as it's coming from url compare with existing table.
        value.content = content,
            await value.save();
        res.status(200).json({
            "message": "Success",
            "entity_id": value.id,
            "additional_text": `Entity '${entity}' has been updated to ${content}`
        });
    }).catch(err => {
        res.status(404).json({
            "message": "Not Found",
            "additional_text": `Entity ${entity} does not exists or you don't have the appropriate permissions.`
        })
    });
});

router.post('/list-entities', async (req, res) => {
    const { api_key } = req.body;
    const { owner } = req.body;

    Keys.findOne({ api_key, owner }).then(async key => {
        if (key) {
            Values.find({ api_key })
                .then(values => {
                    res.status(200).send(values);
                });
        } else {
            res.status(404).json({
                "message": "Resource Not Found",
                "additional_text": "The requested data is not found."
            });
        }
    }).catch(err => {
        res.status(500).json({
            "message": "Server Error",
            "additional_text": err
        })
    });
});

// Delete Entity
router.post('/delete', async (req, res) => {
    const { api_key } = req.body;
    const { entity } = req.body;
    Values.findOneAndDelete({ api_key, entity }).then(async value => {
        if (value) {
            res.status(200).json({
                "message": "Success",
                "additional_text": `${entity} Removed Successfully.`
            });
        } else {
            res.status(403).json({
                "message": "Data Mismatch",
                "additional_text": "The resource contains conflicting information. Skipping Delete."
            })
        }
    }).catch(err => {
        res.status(500).json({
            "message": "Server Error",
            "additional_text": err
        })
    });
});

function get_random(n) {
    let random_string = "";
    const charset = "0A1B2C3D4E5F6G7H8I9J0K1L2M3N4O5P6Q7R8S9T0U1V2W3X4Y5Z6A7B8C9";
    for (let i = 0; i < n; i++)
        random_string += charset.charAt(Math.floor(Math.random() * charset.length));
    return random_string;
}

module.exports = router;