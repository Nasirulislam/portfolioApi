const express = require('express');

const createProject =require('../controller/ProjectController')
const router = express.Router();

router.route('/new').post( createProject.uploadPropertyImages,createProject.resizeProjectImages,createProject.createProject)
router.route('/:id').delete(createProject.deleteProject)
.patch(createProject.updateProject)
.put(createProject.uploadPropertyImages,createProject.resizeUpdatedImages,createProject.updateProject)
router.route('/').get(createProject.getAll)
router.route('/login').post(createProject.login)

router.route('/change').post(createProject.changePassword)
module.exports = router;