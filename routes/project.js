const express = require('express');

const createProject =require('../controller/ProjectController')
const home = require('../controller/HomeController')
const router = express.Router();

router.route('/new').post( createProject.myDummyFunc,createProject.uploadPropertyImages,createProject.createProject)
router.route('/:id').delete(createProject.deleteProject)
.patch(createProject.updateProject)
.put(createProject.uploadPropertyImages,createProject.updateProject)
router.route('/').get(createProject.getAll)
router.route('/login').post(createProject.login)



router.route('/change').post(createProject.changePassword)
router.route('/getAbout').get(createProject.getAbout)
router.route('/updateAbout').post(createProject.updateAbout)


router.route('/home').get(home.getAll)
router.route('/home').post(home.uploadPropertyImages, home.createProject)
router.route('/home').patch(home.uploadPropertyImages, home.updateProject)
router.route('/home').put(home.updateProject)
router.route('/home/:id').delete(home.deleteProject)



module.exports = router;