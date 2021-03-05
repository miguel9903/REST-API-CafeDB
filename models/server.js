const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const { dbConnection } = require('../database/config');

class RestServer {

    constructor() {
        
        this.app = express();
        this.port = process.env.PORT || 3000;

        // Routes paths
        this.paths = {
            auth: '/api/auth/',
            categories: '/api/categories/',
            users: '/api/users/',
            products: '/api/products/',
            search: '/api/search/',
            upload: '/api/uploads/'
        };

        // Connecting to database
        this.databaseConnection();

        // Middlewares
        this.middlewares();

        // Routes
        this.routes();
    }

    routes() {
        // User routes
        this.app.use(this.paths.users, require('../routes/user'));

        // Auth routes
        this.app.use(this.paths.auth, require('../routes/auth'));

        // Category routes
        this.app.use(this.paths.categories, require('../routes/category'));

        // Product routes
        this.app.use(this.paths.products, require('../routes/product'));

        // Search route
        this.app.use(this.paths.search, require('../routes/search'));

        // Upload files route
        this.app.use(this.paths.upload, require('../routes/upload'));
    }

    listen() {        
        this.app.listen(this.port, () => {
            console.log(`App listening on port ${ this.port }`);
        });
    }

    middlewares() {
        //  CORS
        this.app.use(cors());

        // Serialize to JSON format
        this.app.use(express.json());

        // Public directory
        this.app.use(express.static('public'));

        // File uploads
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath: true
        }));
    }

    async databaseConnection () {
        await dbConnection();
    }

}

module.exports = RestServer;