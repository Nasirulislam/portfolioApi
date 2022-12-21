const multer = require('multer');
const sharp = require('sharp');
const Project = require("../model/projectModel")
const Admin=require('../model/admin')
const catchAsync=require('../util/catch');
const { response } = require('express');

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
    { name: 'images', maxCount: 15 },
  ]);

  exports.resizeProjectImages = catchAsync(async (req, res, next) => {
    if (!req.files.images) return next();
  
    //Images
    req.body.images = [];
    console.log("---------------------------------")
    console.log("---------------------------------")
    console.log(req.files)

    console.log("---------------------------------")

    await Promise.all(
      req.files.images.map(async (file, i) => {
        const ext = file.mimetype.split('/')[1];
        const filename = `project-${Date.now()}-${
          i + 1
        }.${ext}`;
  
        await sharp(file.buffer)
          .jpeg({ quality: 90 })
          .toFile(`public/img/projects/${filename}`);
  
        req.body.images.push(filename);
      })
    );
  
    next();
  });
//Update Images
  exports.resizeUpdatedImages = catchAsync(async (req, res, next) => {
	console.log('-------------------------')
	console.log('-------------------------')
	console.log('-------------------------')
	console.log('-------------------------')
	console.log('-------------------------')
	console.log('-------------------------')
console.log(req.files)	
	console.log('-------------------------')
	console.log('-------------------------')
	console.log('-------------------------')
	console.log('-------------------------')

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

exports.login=catchAsync(async(req,res,next)=>{
  if(req.body.user=='admin'&&req.body.password===process.env.password){
    res.status(210).json({
      status:'ok'
    })
  }
  else{
    console.log(process.env.password)
    res.status(220).json({
      status:'not_ok'
    })
  }

})
exports.changePassword=catchAsync(async(req,res,next)=>{
  if(req.body.user=='admin'&&req.body.password===process.env.password){
    if(req.body.newpass!=''){
      process.env.password=req.body.newPass;
      console.log(process.env.password)
      res.status(210).json({
        status:'success'
      })
    }
    else{
      res.status(435).json({
        status:'Failed'
      })
    }
  }
  else{
    res.status(220).json({
      status:'failed, Invalid user or old password'
    })
  }
})
exports.getAll=catchAsync(async(req,res,next)=>{
    const projects=await Project.find()
    let sortedProjects = projects.sort((r1, r2) => (Number(r1.index) > Number(r2.index)) ? 1 : (Number(r1.index) < Number(r2.index)) ? -1 : 0);

    
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