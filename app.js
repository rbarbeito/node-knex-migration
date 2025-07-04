require('module-alias/register');
const express = require('express');
const dotenv = require("dotenv").config()
const cors = require("cors")
const db = require('./db/knex')
const handlerError = require('./config/handler_error/handlerError')
const loggerMiddleware = require('./config/loggerMorgan');

const mainRouter = require('routes');
const notFound = require('./config/handler_error/notFound');

class App {

    constructor() {
        this.app = express()
        this.middlewares()
        // this.setupMorgan()
        this.listen()
    }

    middlewares() {
        this.app.use(express.json())
        this.app.use(express.urlencoded({extended: true}))
        this.app.use(cors())
        loggerMiddleware().forEach(mgn => this.app.use(mgn));

        //todas las rutas
        this.app.use(mainRouter)

        //manejo de rutas no existentes 
        this.app.use(notFound)
        
        //manejo de errores
        this.app.use(handlerError)

        this.app.use((req,res,next)=>{

        })
    }

    /*
    setupMorgan() {
        const logDirectory = path.join(__dirname, "logs")
        if (!fs.existsSync(logDirectory)) {
            fs.mkdirSync(logDirectory)
        }

        const accessLogWriteStream = fs.createWriteStream(path.join(logDirectory, "access.log"),
            {
                flags: "a"
            }
        )

        this.app.use(morgan("combined", { stream: accessLogWriteStream }));
        this.app.use(morgan('dev'))
    }
*/
    listen() {
        this.app.listen(process.env.PORT, () => {
            console.log(`Server is running on port ${process.env.PORT}`)
        })

    }

}

new App()