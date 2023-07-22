const controller = require('../controller/preferenceController');
const auth = require('../middlewares/auth');

const router = require ('express').Router();


router.post('/add-preference', auth, controller.addPreference);
router.get('/get-preferece',auth, controller.getPreference);
router.put('/update-preference', auth, controller.updatePreference);


module.exports = router;