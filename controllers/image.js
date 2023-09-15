const clarifai = require('clarifai');

const PAT = process.env.CLARIFAI_PAT;
const USER_ID = 'clarifai';       
const APP_ID = 'main';
const MODEL_ID = 'face-detection';
const MODEL_VERSION_ID = '6dc7e46bc9124c5c8824be4822abe105';    

const handleApiCall = (req, res) => {
	const IMAGE_URL = req.body.input;
	const raw = JSON.stringify({
    "user_app_id": {
      "user_id": USER_ID,
      "app_id": APP_ID
    },
    "inputs": [
      {
	      "data": {
	        "image": {
	          "url": IMAGE_URL
	        }
        }
      }
    ]
	});

	const requestOptions = {
	    method: 'POST',
	    headers: {
	        'Accept': 'application/json',
	        'Authorization': 'Key ' + PAT
	    },
	    body: raw
	};
	
	fetch("https://api.clarifai.com/v2/models/" + MODEL_ID + "/versions/" + MODEL_VERSION_ID + "/outputs", requestOptions)
    .then(response => response.json())
    .then(result => res.json(result))
    .catch(error => res.status(400).json('unable to work with api'));
}

const handleImage = (req, res, db) => {
	const { id } = req.body;
	db('users').where('id', '=', id)
		.increment('entries', 1)
		.returning('entries')
		.then(entries => res.json(entries[0]))
		.catch(err => res.status(400).json('unable to get entries'));
}

module.exports = {
	handleApiCall,
	handleImage
}