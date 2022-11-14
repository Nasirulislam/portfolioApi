const multer = require('multer');
const sharp = require('sharp');
const Project = require("../model/projectModel")
const catchAsync=require('../util/catch')

const multerStorage = multer.memoryStorage();
const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
      cb(null, true);
    } else {
      cb(new AppError('Not an image! Please upload only images.', 400), false);
    }
  };
  const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
  });

  exports.uploadPropertyImages = upload.fields([
    { name: 'images', maxCount: 6 },
  ]);

  exports.resizeProjectImages = catchAsync(async (req, res, next) => {
    console.log(req)
    if (!req.files.images) return next();
  
    //Images
    req.body.images = [];
  
    await Promise.all(
      req.files.images.map(async (file, i) => {
        const filename = `project-${Date.now()}-${
          i + 1
        }.jpeg`;
  
        await sharp(file.buffer)
        //   .resize(2000, 1333)
          .toFormat('jpeg')
          .jpeg({ quality: 90 })
          .toFile(`public/img/projects/${filename}`);
  
        req.body.images.push(filename);
      })
    );
  
    next();
  });
//Update Images
  exports.resizeUpdatedImages = catchAsync(async (req, res, next) => {
    console.log(req)
    if (!req.files.images) return next();
  
    //Images
    // req.body.images = [];
  
    await Promise.all(
      req.files.images.map(async (file, i) => {
        const filename = `project-${Date.now()}-${
          i + 1
        }.jpeg`;
  
        await sharp(file.buffer)
        //   .resize(2000, 1333)
          .toFormat('jpeg')
          .jpeg({ quality: 90 })
          .toFile(`public/img/projects/${filename}`);
  
        req.body.images.push(filename);
      })
    );
  
    next();
  });
exports.createProject=catchAsync(async(req,res,next)=>{
    const newProject=await Project.create(req.body);
    res.status(200).json({
        data:{
            newProject
        }
    })
})
exports.deleteProject=catchAsync(async(req,res,next)=>{
    const del=await Project.findByIdAndDelete(req.params.id,{ new: true })
    res.status(206).json({
        data:{
            del
        }
    })
})

exports.getAll=catchAsync(async(req,res,next)=>{
    const projects=await Project.find()
    let sortedProjects = projects.sort((r1, r2) => (r1.index > r2.index) ? -1 : (r1.index < r2.index) ? 1 : 0);

    console.log("Students sorted based on ascending order of their roll numbers are:")
    
    res.status(210).json({
        data:{
            sortedProjects
        }
    })
})

exports.updateProject=catchAsync(async(req,res,next)=>{
    const updated=await Project.findByIdAndUpdate(req.params.id,req.body,{
        new:true
    })
    res.status(225).json({
        data:{
            updated
        }
    })
})