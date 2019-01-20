const Ajv = require('ajv')
const requestSchema = require('../schemas/step_request.json')
const stepSchemas = [
  require('../schemas/conda_install.json'),
  require('../schemas/custom_command.json'),
  require('../schemas/git_clone.json'),
  require('../schemas/hdfs_download.json'),
  require('../schemas/install_conda.json'),
  require('../schemas/install_git.json'),
  require('../schemas/install_python.json'),
  require('../schemas/pip_install.json')
]

function schemaValidator (stepReq) {
  const ajv = new Ajv()
  const validate = ajv.addSchema(stepSchemas).compile(requestSchema)
  const valid = validate(stepReq)
  return valid
}

module.exports = schemaValidator
