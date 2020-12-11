// load libraries
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const aws = require('aws-sdk')
const multer = require('multer')
const fs = require('fs')

// declare an instance of express and multer
const app = express()
const upload = multer({dest: `${__dirname}/uploads/`})

// declare port
const PORT = parseInt(process.argv[2]) || parseInt(process.env.PORT) || 3000

// use cors headers
app.use(cors())

// log requests using morgan
app.use(morgan('combined'))

// endpoint for S3
const ENDPOINT = new aws.Endpoint('fra1.digitaloceanspaces.com')
const s3 = new aws.S3({
    endpoint: ENDPOINT,
    accessKeyId: process.env.DIGITALOCEAN_ACCESS_KEY,
    secretAccessKey: process.env.DIGITALOCEAN_SECRET_ACCESS_KEY
})
app.get('/download/:key', (req, resp) => {
    const params = {
        Bucket: 'yeebinrong',
        Key: req.params.key
    }
    s3.getObject(params, (err, result) => {
        console.info(result)
        resp.set({
            'X-Original-Name':result.Metadata.originalname,
            'X-Create-Time':result.Metadata.createdtime,
            'X-Uploader':result.Metadata.uploadedby,
            'X-Notes':result.Metadata.notes
        })
        if (err) console.log(err, err.stack);
        let fileData= result.Body.toString('base64');
        resp.type('text/plain')
        console.info(fileData)
        resp.send(fileData);
    })
})

app.post('/upload', upload.single('image_file'),
    (req, resp) => {
        console.info(req.file)
        fs.readFile(req.file.path, (err, imgFile) => {
            const KEY = req.file.filename + '_' + req.file.originalname;
            const params = {
                Bucket: 'yeebinrong',
                Key: KEY,
                Body: imgFile,
                ACL: 'public-read',
                ContentType: req.file.mimetype,
                ContentLength: req.file.size,
                Metadata: {
                    originalName: req.file.originalname,
                    createdTime: '' + (new Date()).getTime(),
                    uploadedBy: req.body.uploadedBy,
                    notes: req.body.notes
                }
            }
            s3.putObject(params, (err, result) => {
                fs.unlink(req.file.path, () => {
                    return resp.status(200)
                        .type('application/json')
                        .json({'key':KEY})
                })
            })
        })
    }
)

app.listen(PORT, () => {
    console.info(`Application is listening on PORT ${PORT} at ${new Date()}.`)
})
