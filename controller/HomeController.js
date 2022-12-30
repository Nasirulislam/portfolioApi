const multer = require('multer');
const path = require('path');
const Home = require('../model/home')
const catchAsync = require('../util/catch');
const { response } = require('express');
const videoStorage = multer.diskStorage({
    destination: 'public/home', // Destination to store video 
    filename: (req, file, cb) => {
        var name = file.fieldname + '_' + Date.now()
            + path.extname(file.originalname)
        console.log(req.body)
        req.body.images.push(name)
        cb(null, name)
        console.log(req.body)

        // req.body.images.push(name)

    }
});
const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image') || file.mimetype.startsWith('video')) {
        cb(null, true);
    } else {
        cb(new AppError('Not an image! Please upload only images.', 400), false);
    }
};
const upload = multer({
    storage: videoStorage,
    fileFilter: multerFilter,
});

exports.uploadPropertyImages = upload.fields([
    { name: 'imagess', maxCount: 15 },
]);

exports.createProject = catchAsync(async (req, res, next) => {
    const home = await Home.create(req.body);
    res.status(200).json({
        data: {
            home
        }
    })
})
exports.deleteProject = catchAsync(async (req, res, next) => {
    const del = await Home.findByIdAndDelete(req.params.id, { new: true })
    res.status(206).json({
        data: {
            del
        }
    })
})
exports.getAll = catchAsync(async (req, res, next) => {
    const home = await Home.find()


    res.status(210).json({
        data: {
            home
        }
    })
})
exports.updateProject = catchAsync(async (req, res, next) => {
    const home = await Home.findByIdAndUpdate(req.params.id, req.body, {
        new: true
    })
    res.status(225).json({
        data: {
            home
        }
    })
})