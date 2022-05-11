#!/usr/bin/env node

process.env.HTTP_PORT = process.env.HTTP_PORT || 8888
process.env.NODE_ENV = process.env.NODE_ENV || 'production'

const path = require('path')
const express = require('express')
const open = require('open')
const app = express()

// Log request
app.use((req, res, next) => {
  console.log(new Date(), `[${req.method}]`, req.originalUrl)
  next()
})

// Log errors
app.use((error, req, res, next) => {
  console.log(new Date(), `[ERR]`, error.message)
  res.status(500).json({ error: error.message })
})

// Serve static files
app.use('/', express.static(path.join(__dirname, '..', 'client', 'build')))

// Start HTTP server
app.listen(process.env.HTTP_PORT, () => {
  console.log(new Date(), `HTTP server is up and running on port ${process.env.HTTP_PORT}`)
  if (process.env.NODE_ENV === 'production') {
    open(`http://localhost:${process.env.HTTP_PORT}`, {
      app: { name: open.apps.chrome }
    })
  }
})
