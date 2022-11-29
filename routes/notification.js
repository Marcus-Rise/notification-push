var express = require('express');
var router = express.Router();
const webPush = require('web-push');

if (!process.env.VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY) {
    console.log("You must set the VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY "+
        "environment variables. You can use the following ones:");
    console.log(webPush.generateVAPIDKeys());
    return;
}

webPush.setVapidDetails(
    process.env.VAPID_DOMAIN,
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
);

router.get(`/vapidPublicKey`, (req, res) => {
    res.send(process.env.VAPID_PUBLIC_KEY);
});

router.post(`/register`, (req, res) => {
    res.sendStatus(201);
});

router.post(`/sendNotification`, (req, res) => {
    const subscription = req.body.subscription;
    const payload = req.body.payload;
    const options = {
        TTL: req.body.ttl
    };

    setTimeout(() => {
        webPush.sendNotification(subscription, payload, options)
            .then(() => {
                res.sendStatus(201);
            })
            .catch((error) => {
                console.log(error);
                res.sendStatus(500);
            });
    }, req.body.delay * 1000);
});

module.exports = router;
