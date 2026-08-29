const path = require('path');

const express = require('express');
const multer = require('multer');
const { body } = require('express-validator');

const adminController = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'images');
    },
    filename: (req, file, cb) => {
      cb(null, new Date().toISOString() + "-" + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

const uploadProductImage = multer({
    storage: fileStorage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }
}).single('image');

// /admin/add-product => GET
router.get('/add-product', isAuth, adminController.getAddProduct);

// /admin/products => GET
router.get('/products', isAuth, adminController.getProducts);

// /admin/add-product => POST
router.post('/add-product',
    uploadProductImage,
    [
        body('title').isString().isLength({ min: 3 }).trim(),
        body('price').isFloat({ gt: 0 }),
        body('description').isLength({ min: 5, max: 400 }).trim(),
    ],
    isAuth, adminController.postAddProduct);

router.get('/edit-product/:productId', isAuth, adminController.getEditProduct);

router.post('/edit-product',
    uploadProductImage,
    [
        body('title').isString().isLength({ min: 3 }).trim(),
        body('price').isFloat({ gt: 0 }),
        body('description').isLength({ min: 5, max: 400 }).trim(),
    ],
    isAuth, adminController.postEditProduct);

router.delete('/product/:productId', isAuth, adminController.deleteProduct);

module.exports = router;