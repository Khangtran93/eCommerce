import path from 'path'
import express from 'express'
import multer from 'multer'

const router = express.Router();

const storage = multer.diskStorage({
    //specify destination for uploaded images
    destination(req, file, cb) {
        cb(null, 'uploads/');
    },

    //create a unique name for each uploaded image
    filename(req, file, cb) {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

//validate the uploaded image
function checkFileTypes(file, cb) {
    const filetypes = /jpg|jpeg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
        return cb(null, true);
    }
    else {
        cb('Images only!')
    }
}

const upload = multer({
    storage,
});

router.post('/', upload.single('image') , (req, res) => {
    res.send({
        message: "Image uploaded",
        image: `/${req.file.path}`,
    });
});

export default router;