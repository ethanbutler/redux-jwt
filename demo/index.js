const chalk      = require('chalk')
const express    = require('express')
const expressJwt = require('express-jwt')
const bodyParser = require('body-parser')
const jwt        = require('jsonwebtoken')
const path       = require('path')
const app        = express()
const Sequelize  = require('sequelize')
const DataTypes  = require('sequelize/lib/data-types')
const JWT_SECRET = process.env.SECRET || 'redux-jwt'
const PORT       = process.env.PORT || 3000

sequelize = new Sequelize({
  'dialect': 'sqlite',
  'storage': './db.sqlite'
})

const User = sequelize.define('User', {
  email: {
    type: DataTypes.STRING,
    unique: true,
    validate: {
      isEmail: true,
      notEmpty: true
    }
  },
  password: {
    type: DataTypes.STRING,
    validate: {
      notEmpty: true
    }
  }
}, {
  instanceMethods: {
    toJSON: function() {
      const values = Object.assign({}, this.get)
    }
  }
})

sequelize
.sync({ force: true })
.then(() => console.log(chalk.white('DB synced and running!')))
.catch((err) => {
  console.log(chalk.white('Error syncing database'))
  console.log(chalk.red(err))
})


app
.use(express.static('dist'))
.use(bodyParser.json())

app.post('/api/user', (req, res) => {
  const { email, password } = req.body
  if(!email || !password){
    console.log(chalk.red('Failed to create user with data:'))
    console.log(chalk.white(req))
    return res.status(400).json({
      error: "All fields are required"
    })
  }

  User.create(req.body)
  .then((user) => {
    console.log(
      chalk.green('User created! Email: '),
      chalk.white(user.email),
      chalk.green(', Password: '),
      chalk.white(user.password)
    )
    const token = jwt.sign({
      email: user.email,
      id: user.id
    }, JWT_SECRET)

    delete user.password

    return res.status(201).json({
      user,
      auth: {
        token,
        userId: user.id
      }
    })
  })
  .catch((error) => res.status(500).json({ error }))
})

app.post('/api/auth', (req, res) => {
  const { email, password } = req.body
  if(!email || !password) {
    return res.status(400).json({
      error: "All fields are required"
    })
  }

  User.findOne({
    where: {
      email
    }
  })
  .then((user) => {
    if(password === user.password){
      const token = jwt.sign({
        email: user.email,
        id: user.id
      }, JWT_SECRET)

      console.log(
        chalk.green('Authorization from user: '),
        chalk.white(user.email)
      )

      return res.status(200).json({
        auth: {
          token,
          userId: user.id
        }
      })
    } else {
      console.log(
        chalk.red('Bad password from user: '),
        chalk.white(user.email)
      )

      return res.status(401).json({
        error: "Incorrect password"
      })
    }
  }).catch((error) => {
    console.log(error)
    res.status(500).json({ error })
  })
})

app.get(
  '/api/authenticated-endpoint',
  expressJwt({secret: JWT_SECRET}),
  (req, res) => {
    console.log(chalk.green('Good request!'))

    const { email } = req.user

    res.status(200).json({
      message: `Authenticated as user: ${email}!`
    })
  }
)

app.get('/', (req, res) => {
  const PATH = path.join(
    __dirname,
    'dist/index.html'
  )
  return res.status(200).sendFile(PATH)
})


app.listen(PORT, () => {
  console.log(chalk.white(`Serving at localhost:${PORT}`))
})
