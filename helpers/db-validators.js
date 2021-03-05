const Role = require('../models/role');
const User = require('../models/user');
const Category = require('../models/category');
const Product = require('../models/product');

const existUserRole = async (role = '') => {
    const existRole = await Role.findOne({ role: role });
    if(!existRole) {
        throw new Error(`${ role } role is not registred`);
    }
}

const existUserEmail = async (email = '') => {
    const existEmail = await User.findOne({ email: email });
    if(existEmail) {
        throw new Error(`The email ${ email } already registered`);
    }
}

const existUserId = async (id = '') => {
    const existUser = await User.findById(id);
    if(!existUser) {
        throw new Error('The user does not exist');
    }
}

const existCategoryName = async (name = '') => {
    const existCategory = await Category.findOne({ name: name.toUpperCase() });
    if(existCategory) {
        throw new Error(`The category ${ name } already exist`);
    }
}

const existCategoryId = async (id = '') => {
    const existCategory = await Category.findById(id);
    if(!existCategory) {
        throw new Error('The category does not exist');
    }
}

const existProductName = async (name = '') => {
    const existProduct = Product.findOne({ name });
    if(existProduct) {
        throw new Error(`The product ${ name } already exist`);
    }
}


const existProductId = async (id ='') => {
    const existProduct = await Product.findById(id);
    if(!existProduct) {
        throw new Error('The product does not exist');
    }
}

const validateCollections = (collection = '', allowedCollections = []) => {
    if(!allowedCollections.includes(collection)){
        throw new Error(`The ${ collection } collection is not allowed`);
    }
    return true;
}

const validateQueryParam = (queryParam) => {
    if(queryParam) {
        if(isNaN(queryParam)) {
            throw new Error(`The parameter ${ queryParam } must be of type number`);
        }
    }
}

module.exports = {
    existUserRole,
    existUserEmail,
    existUserId,
    existCategoryName,
    existCategoryId,
    existProductName,
    existProductId,
    validateCollections,
    validateQueryParam
};