const toysController = require('../controller/toysController');
const auth = require('../middlewares/auth');

const router = require('express').Router();
const path = require("path");

const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../uploads'))
    },
    filename: function (req, file, cb) {
        const match = ["image/png",, "image/jpg", "image/jpeg"];
    
        if (match.indexOf(file.mimetype) === -1) {
          var message = `${file.originalname} is invalid. Only accept png/jpeg.`;
          return callback(message, null);
        }
        cb(null, file.fieldname + '-' + Date.now() + '.jpg')
    }
})
const upload = multer({storage: storage})
const imgUpload = upload.fields([{name: 'imageOne', maxCount: 1}, {name: 'imageTwo', maxCount: 1}])


router.post('/add-toy', auth, imgUpload,  toysController.addToy);
router.get('/get-toys', auth, toysController.getToys);
router.get('/swap-toys', auth, toysController.getSwapToys);
router.get('/gift-toys', auth, toysController.getGiftToys);
router.put('/update-toy', auth, toysController.updateToy);
router.get('/given', auth, toysController.given);
router.get('/swaped', auth, toysController.swaped);
router.get('/myToys', auth, toysController.myToys);
router.get('/myGiftToys', auth, toysController.myGiftToys);
router.get('/mySwapToys', auth, toysController.mySwapToys);

router.post('/search', auth, toysController.searchToy);
router.post('/add-WishList/:toyId', auth, toysController.addWishList);
router.get('/get-WishList', auth, toysController.getWishList);
router.get('/wishlist-details/:id', auth, toysController.wishlistDetails);


module.exports = router;