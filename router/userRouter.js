
const controller = require('../controller/userController');
const auth = require('../middlewares/auth');

const router = require('express').Router();


const path = require("path");

const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../uploads'))
    },
    filename: function (req, file, cb) {
        const match = ["image/png", "image/jpeg"];
    
        if (match.indexOf(file.mimetype) === -1) {
          var message = `${file.originalname} is invalid. Only accept png/jpeg.`;
          return callback(message, null);
        }
        cb(null, file.fieldname + '-' + Date.now() + '.jpg')
    }
})
const upload = multer({storage: storage})
const imgUpload = upload.fields([{name: 'profImage', maxCount: 1}]);


router.post('/login', controller.login);
router.post('/register', controller.registration);
router.post('/pin', auth, controller.pinConfirmation);
router.post('/pin-reset', controller.pinRest);
router.put('/user-Details', auth, imgUpload, controller.regUserDetails);
router.put('/change-Password', controller.changePassword);
router.get('/get-user', controller.getUser);
router.put('/put-details',auth, controller.putUserDetails);
router.get('/me', auth, controller.me);
router.put('/update', auth, controller.updateDetails);
router.put('/forgotten-password', controller.forgottenPassword);

module.exports = router