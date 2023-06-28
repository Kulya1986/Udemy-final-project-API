
import { ClarifaiStub, grpc } from 'clarifai-nodejs-grpc';

const PAT = process.env.CLARIFAI_API;
const USER_ID = "kulya1986";       
const APP_ID = "facefinder";
// const MODEL_ID = "face-detection";

const stub = ClarifaiStub.grpc();
const metadata = new grpc.Metadata();
metadata.set("authorization", "Key " + PAT);


// JavaScript version of code - NOT WORKING  

// const returnClarifaiRequestOptions = (imageUrl) => {
//     // Your PAT (Personal Access Token) can be found in the portal under Authentification
// //   const PAT = '67332b3a08994dd28b520e626670f4df';
// //   // Specify the correct user_id/app_id pairings
// //   // Since you're making inferences outside your app's scope
// //   const USER_ID = 'kulya1986';       
// //   const APP_ID = 'facefinder';
//   // Change these to whatever model and image URL you want to use
//   // const MODEL_ID = 'face-detection';
//     const IMAGE_URL = imageUrl;

//     const raw = JSON.stringify({
//       "user_app_id": {
//           "user_id": USER_ID,
//           "app_id": APP_ID
//         },
//       "inputs": [
//           {
//               "data": {
//                   "image": {
//                       "url": IMAGE_URL
//                   }
//               }
//           }
//         ]
//     });

//     const requestOptions = {
//         method: 'POST',
//         headers: {
//             'Accept': 'application/json',
//             'Authorization': 'Key ' + PAT
//         },
//         body: raw
//     };
//     return requestOptions;
// }

// const handleApiCall = () =>(req, res) => {
//     console.log(req.body.input);
//     fetch("https://api.clarifai.com/v2/models/face-detection/outputs", returnClarifaiRequestOptions(req.body.input))
//         .then (response =>{
//             console.log(response);
//             res.json(response);
//         })
//         .catch(err =>{
//             console.log(err);
//             res.status(400).json('Clarifai model is not working');
//         })
// }

// gRPC version of code - working fine

const handleApiCall = (req,res) =>{
    stub.PostModelOutputs(
        {
            user_app_id: {
                "user_id": USER_ID,
                "app_id": APP_ID
            },
            model_id: "face-detection",
            // version_id: MODEL_VERSION_ID, // This is optional. Defaults to the latest model version
            inputs: [
                { data: { image: { url: req.body.input} } }
            ]
        },
        metadata,
        (err, response) => {
            if (err) {
                throw new Error(err);
            }

            if (response.status.code !== 10000) {
                throw new Error("Post model outputs failed, status: " + response.status.description);
            }

            // Since we have one input, one output will exist here
            // const output = response.outputs[0];

            // console.log("Predicted concepts:");
            // console.log(response);

            // console.log('For loop')
            // for (const region of output.data.regions) {
            //     console.log(region.region_info.bounding_box);
            // }
            res.json(response);
        }
    );

}


const handleImageDetect = (db) => (req, res) =>{
    const {id} = req.body;
    db('users').where('user_id','=',id)
        .increment('url_entries', 1)
        .returning('url_entries')
        .then(entries =>{
            res.json(entries[0].url_entries)
        })
        .catch(err => res.status(400).json('url entries failed to be updated'))
}


export {handleImageDetect, handleApiCall};