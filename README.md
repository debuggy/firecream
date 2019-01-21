# firecream
A RESTful server infrastructure

## Get started
### Run locally
- Create a data file firecream.db in ./data/ dir
- Run command ```yarn install``` (need global install yarn first) or ```npm install```
- Run command ```yarn dev``` or ```npm run dev```
- Test api server located in http://localhost:8080.
### Run with docker
- ```docker build -t firecream .```
- ```docker run -p 8080:8080 firecream```
- Test api server located in http://localhost:8080.

### Deploy in kubernetes
- ```kubectl create -f kubernetes.yaml```
- Api server is located in firecream service.

## API schema
The [api schema](./schemas/api_schema.yaml) use latest version of OpenAPI Specification, OpenAPI 3.0 (OAS 3.0).
