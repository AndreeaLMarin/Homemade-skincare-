// server/index.js
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(helmet())
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }))
app.use(express.json())
app.use(morgan('dev'))

// Routes
app.use('/api/auth',     require('./routes/auth'))
app.use('/api/products', require('./routes/products'))
app.use('/api/orders',   require('./routes/orders'))
app.use('/api/recipes',  require('./routes/recipes'))
app.use('/api/users',    require('./routes/users'))

app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date() }))

app.listen(PORT, () => console.log(`🌿 Homemade Skincare server running on port ${PORT}`))
