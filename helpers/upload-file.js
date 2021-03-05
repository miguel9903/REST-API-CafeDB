const path = require('path');
const { v4: uuidv4 } = require('uuid');

const uploadFile = (files, directory, validExtensions = ['png', 'jpg', 'jpeg', 'gif']) => {

    return new Promise((resolve, reject) => {

        const { file } = files;
        const splitName = file.name.split('.');
        const fileExtension = splitName[splitName.length-1];

        // Validate file extension
        if(!validExtensions.includes(fileExtension)) {
            return reject(`Invalid file extension. The file extension must be: ${ validExtensions }`);
        }

        const tempName = uuidv4() + '.' +  fileExtension;
        const uploadPath = path.join(__dirname, '../uploads/', directory, tempName);
      
        file.mv(uploadPath, (err) => {
          if (err) {
            reject(err);
          }
          resolve(tempName);
        }); 

    });

}

module.exports = { 
    uploadFile 
};