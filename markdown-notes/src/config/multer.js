'use strict'
const multer = require('multer')
const path = require('path')
const fs = require('fs-extra')

const uploadDir = path.join(__dirname, '../uploads')
fs.ensureDirSync(uploadDir)

const storage = multer.diskStorage({
  destiantion: (req, res, cb) => {
    cd (null, uploadDir)
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + unique + path.extname(file.originalname))
  }
})

const upload = multer({
  storege: storage,
  fileFilter: (req, file, cb) => {
    if ( path.extname(file.originalname).toLocaleLowerCase() !== '.md') {
      return cb (new Error('Only markdown files are allowed'))
    }
    cb (null, true)
  },
  limits: {
    fileSize: 1024 * 1024 * 5
  }
})

module.exports = upload
