const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const Project = require("../model/projectModel")
const Admin = require('../model/admin')
const catchAsync = require('../util/catch');
const { response } = require('express');
const AppError = require('../util/appError');

const multerStorage = multer.memoryStorage();
const videoStorage = multer.diskStorage({
  destination: 'public/projects', // Destination to store video 
  filename: (req, file, cb) => {
    var name = file.fieldname + '_' + Date.now()
      + path.extname(file.originalname)
    console.log(req.body)
	if(req.body.images[0]==''){
	req.body.images.splice(0,1)
}
    req.body.images.push(name)
    cb(null, name)
    console.log(req.body)

    // req.body.images.push(name)

  }
});
exports.myDummyFunc = (req, res, next) => {
  // req.body.images=[]
  next()
}
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
      const filename = `project-${Date.now()}-${i + 1
        }.${ext}`;
      console.log("here")
      console.log(file)

      req.body.images.push(filename);
    })
  );

  next();
});
//Update Images
exports.resizeUpdatedImages = catchAsync(async (req, res, next) => {
  console.log(req.files)

  if (!req.files.images) return next();

  //Images
  // req.body.images = [];

  await Promise.all(
    req.files.images.map(async (file, i) => {
      const ext = file.mimetype.split('/')[1];
      const filename = `project-${Date.now()}-${i + 1
        }.${ext}`;

      await sharp(file.buffer)
        //   .resize(2000, 1333)
        // .toFormat('jpeg')
        // .jpeg({ quality: 90 })
        .toFile(`public/img/projects/${filename}`);
      console.log("here")
      console.log(file)

      req.body.images.push(filename);
    })
  );

  next();
});
exports.createProject = catchAsync(async (req, res, next) => {
  const newProject = await Project.create(req.body);
  res.status(200).json({
    data: {
      newProject
    }
  })
})
exports.deleteProject = catchAsync(async (req, res, next) => {
  const del = await Project.findByIdAndDelete(req.params.id, { new: true })
  res.status(206).json({
    data: {
      del
    }
  })
})

exports.login = catchAsync(async (req, res, next) => {
  if (req.body.user == 'admin' && req.body.password === process.env.password) {
    res.status(210).json({
      status: 'ok'
    })
  }
  else {
    console.log(process.env.password)
    res.status(220).json({
      status: 'not_ok'
    })
  }

})
exports.changePassword = catchAsync(async (req, res, next) => {
  if (req.body.user == 'admin' && req.body.password === process.env.password) {
    if (req.body.newpass != '') {
      process.env.password = req.body.newPass;
      console.log(process.env.password)
      res.status(210).json({
        status: 'success'
      })
    }
    else {
      res.status(435).json({
        status: 'Failed'
      })
    }
  }
  else {
    res.status(220).json({
      status: 'failed, Invalid user or old password'
    })
  }
})
// })
// title = 'David Ellis'
// subTitle = 'PHOTOGRAPHER / DIRECTOR'
// loctText = 'BASED IN VANCOUVER'
// email = 'EMAIL@THEDAVIDELLIS.COM'
// instagramUrl = 'https://www.instagram.com/davidellis'
// repText = '_REPRESENTED BY'
// repName = "WALTER SCHUPEER MANAGEMENT"
// repEmail = 'WALTER@WSCHUPFER.COM'
exports.getAbout = (req, res, next) => {
  const about={
    title:process.env.title,
    detail: process.env.subTitle,
    locTxt: process.env.loctText,
    email:process.env.email,
    instaUrl:process.env.instagramUrl,
    repTxt:process.env.repText,
    repName:process.env.repName,
    repEmail:process.env.repEmail
  }
  res.status(210).json({
    data: about
  })
}
exports.updateAbout=(req,res,next)=>{
  process.env.title = req.body.title || '';
  process.env.subTitle = req.body.detail || ''
  process.env.loctText = req.body.locTxt || ''
  process.env.email = req.body.email || ''
  process.env.instagramUrl = req.body.instaUrl || ''
  process.env.repText = req.body.repTxt || ''
  process.env.repName = req.body.repName || ''
  process.env.repEmail = req.body.repEmail || ''


  res.status(210).json({
    data: {
      msg:'successfully updated'
    }
  })
}

exports.getAll = catchAsync(async (req, res, next) => {
  const projects = await Project.find()
  let sortedProjects = projects.sort((r1, r2) => (Number(r1.index) > Number(r2.index)) ? 1 : (Number(r1.index) < Number(r2.index)) ? -1 : 0);


  res.status(210).json({
    data: {
      sortedProjects
    }
  })
})

exports.updateProject = catchAsync(async (req, res, next) => {
  const updated = await Project.findByIdAndUpdate(req.params.id, req.body, {
    new: true
  })
  res.status(225).json({
    data: {
      updated
    }
  })
})
