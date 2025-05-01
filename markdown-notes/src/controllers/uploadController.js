'use strict'
const Note = require('../models/Note')
const fs = require('fs')
const path = require('path')
const { marked } = require('marked')

// Custom renderer for marked to add classes to HTML elements
const renderer = new marked.Renderer()
renderer.heading = (text, level) => {
  return `<h${level} class="heading-${level}">${text}</h${level}>`
}

marked.setOptions({
  renderer,
  breaks: true,
  gfm: true
})

const uploadMarkdown = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' })
    }

    const fileContent = fs.readFileSync(req.file.path, 'utf8')
    const title = req.file.originalname.replace('.md', '')

    const note = new Note({
      title,
      content: fileContent,
      filename: req.file.filename
    })

    await note.save()

    res.status(201).json({
      message: 'File uploaded and saved successfully',
      note: {
        id: note._id,
        title: note.title,
        createdAt: note.createdAt
      }
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  uploadMarkdown
}