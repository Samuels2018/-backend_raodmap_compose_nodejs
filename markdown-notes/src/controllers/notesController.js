'use strict'
const Note = require('../models/Note')
const fs = require('fs')
const path = require('path')
const {marked} = require('marked')
//const GrammarChecker = require('grammar-checker')
const { title } = require('process')

const saveNote = async (req, res) => {
  try {
    const {tilte, content} = req.body

    if (!title || !content) {
      return res.status(400).json({error: 'Title and content are required'})
    }

    const note = new Note({
      title,
      content
    })

    await note.save()

    res.status(201).json({
      message: 'Note saved successfully',
      note: {
        title: note.title,
        content: note.content,
      }
    })

  }catch (err) {
    console.error(err)
    res.status(500).json({error: 'Internal server error'})
  }
}

const listNotes = async (req, res) => {
  try {
    const notes = await Note.find().sort({createdAt: -1})

    if (notes.length === 0) {
      return res.status(404).json({message: 'No notes found'})
    }

    res.status(200).json(notes)

  }catch (err) {
    console.error(err)
    res.status(500).json({error: 'Internal server error'})
  }
}

const renderNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id)
    if (!note) {
      return res.status(404).json({error: 'Note not found'})
    }

    const htmlContent = marked(note.content)

    res.json({
      title: note.title,
      html: htmlContent,
      original: note.content,
    })

  }catch (err) {
    console.error(err)
    res.status(500).json({error: 'Internal server error'})
  }
}

const checkGrammar = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text is required for grammar check' });
    }
    //const errors = GrammarChecker.check(text);

    res.json({
      originalText: text,
      //errors: errors,
      //errorCount: errors.length
    });

  }catch (err) {
    console.error(err)
    res.status(500).json({error: 'Internal server error'})
  }
}

module.exports = {
  saveNote,
  listNotes,
  renderNote,
  checkGrammar
}