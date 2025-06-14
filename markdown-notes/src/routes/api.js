const express = require('express')
const router = express.Router()
const upload = require('../config/multer')
const notesController = require('../controllers/notesController')
const uploadController = require('../controllers/uploadController')

// File upload route
router.post('/upload', upload.single('markdownFile'), uploadController.uploadController)

// Note management routes
router.post('/notes', notesController.saveNote)
router.get('/notes', notesController.listNotes)
router.get('/notes/:id/render', notesController.renderNote)
router.post('/grammar-check', notesController.checkGrammar)

module.exports = router