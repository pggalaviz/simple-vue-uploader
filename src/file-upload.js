'use scrict';

import Config from '../config';
import * as axios from 'axios';

const BASE_URL = Config.url || 'http://localhost:3000';

const upload = function(formData) {
    // Set URL to upload file to
    const url = `${BASE_URL}/upload`;

    // Send promise based request
    return axios.post(url, formData)
        // Get data
        .then(x => {
            return x.data;
        })
        .then(file => {
            // Return an object with url field.
            return Object.assign({}, file, {url: `${BASE_URL}/files/${file.id}`});
        })
        .catch(err => {
            return err.message; 
        });
};

export { upload };
