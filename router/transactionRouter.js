
const transactionController = require('../controller/transactionController');

const auth = require('../middlewares/auth');

const router = require('express').Router();

router.post('/get-toy/:id', auth, transactionController.GetToy);
router.post('/swap-toy/:idOne/:idTwo', auth, transactionController.SwapToys);
router.put('/reject-transaction',transactionController.RejectTransaction)
router.get('/get-Request', auth, transactionController.getRequest);
router.get('/get-Chat', auth, transactionController.getChat);

router.post('/accept-gift-request/:id', auth, transactionController.AcceptingGiftTransaction);
router.post('/decline-request/:id', auth, transactionController.RejectTransaction);

module.exports = router