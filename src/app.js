const _ = require('lodash')
const fs = require('fs-extra')
const cors = require('cors')
const express = require('express')
const schemaValidator = require('./schema-validator')

const app = express()

const Sequelize = require('sequelize')
const Op = Sequelize.Op

const sequelize = new Sequelize('sqlite:data/firecream.db')
const Step = sequelize.define('step', {
  id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  name: Sequelize.STRING,
  author: Sequelize.STRING,
  step_type: Sequelize.STRING,
  config: Sequelize.STRING,
  createdAt: Sequelize.DATE,
  updatedAt: Sequelize.DATE
})

async function main () {
  // init db
  await fs.ensureDir('data')
  await sequelize.sync()

  // cors
  app.use(cors())

  // body parser
  app.use(express.json())

  app.get('/api/echo', (req, res) => {
    res.status(200).send('Hello World')
  })

  app.get('/api/steps', async (req, res) => {
    try {
      const name = req.query.name
      const author = req.query.author
      let steps = null
      if (!_.isNil(name)) {
        if (!_.isNil(author)) {
          steps = await Step.findAll({
            where: {
              name: { [Op.eq]: name },
              author: { [Op.eq]: author }
            }
          })
        } else {
          steps = await Step.findAll({ where: {
            name: { [Op.eq]: name }
          } })
        }
      } else {
        steps = _.isNil(author) ? await Step.findAll() : await Step.findAll({ where: { author: { [Op.eq]: author } } })
      }
      if (!_.isNil(steps)) {
        // parse string to json
        steps.map(step => { step.config = JSON.parse(step.config) })
      }
      res.json(steps)
    } catch (err) {
      console.log(err)
      res.status(500).send('Internal error!')
    }
  })

  app.post('/api/steps', async (req, res) => {
    const stepConfig = req.body
    if (!schemaValidator(stepConfig)) {
      res.status(400).send('Invalid step config!')
    }
    const name = stepConfig.name
    let step = await Step.findOne({ where: { name: { [Op.eq]: name } } })
    if (!_.isNil(step)) {
      res.status(409).send('Step name already exists.')
    }
    try {
      // stringify json
      stepConfig.config = JSON.stringify(stepConfig.config)
      const step = await Step.create(stepConfig)
      res.status(201).json(step)
    } catch (error) {
      console.log(error)
      res.status(500).send('Internal error!')
    }
  })

  app.get('/api/steps/:id', async (req, res) => {
    const id = req.params.id
    if (_.isNil(id)) {
      res.status(400).send('No id specified!')
    }
    const step = await Step.findById(id)
    if (_.isNil(step)) {
      res.status(404).send('Step not found!')
    }
    // parse string to json
    step.config = JSON.parse(step.config)
    res.json(step)
  })

  app.put('/api/steps/:id', async (req, res) => {
    const id = req.params.id
    const stepConfig = req.body
    if (_.isNil(id)) {
      res.status(400).send('No id specified!')
    }
    if (!schemaValidator(stepConfig)) {
      res.status(400).send('Invalid step config!')
    }
    let step = await Step.findById(id)
    if (_.isNil(step)) {
      res.status(404).send('Step not found!')
    }
    try {
      // stringify json
      stepConfig.config = JSON.stringify(stepConfig.config)
      step.set(stepConfig)
      step = await step.save()
      // parse string to json
      step.config = JSON.parse(step.config)
      res.json(step)
    } catch (err) {
      console.log(err)
      res.status(500).send('Internal error!')
    }
  })

  app.delete('/api/steps/:id', async (req, res) => {
    const id = req.params.id
    if (_.isNil(id)) {
      res.status(400).send('No id specified!')
    }
    let step = await Step.findById(id)
    if (_.isNil(step)) {
      res.status(404).send('Step not found!')
    }
    try {
      await Step.destroy({ where: { id: { [Op.eq]: id } } })
      res.status(200).send('Delete successfully.')
    } catch (err) {
      console.log(err)
      res.status(500).send('Internal error!')
    }
  })
  app.listen(8080, () => { console.log('Api is on localhost:8080!') })
}

main().catch(err => { console.log(err) })
