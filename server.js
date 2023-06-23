import express from 'express';
import bcrypt from 'bcrypt';
import cors from 'cors';
import knex from 'knex';
import handleRegister from './controllers/register.js';
import handleSignin from './controllers/signin.js';
import handleProfileRequest from './controllers/profile.js';
import {handleApiCall, handleImageDetect} from './controllers/imageCheck.js';

const db = knex({
    client: 'pg',
    connection: {
        host : '127.0.0.1',
        // port : 5432,
        user : 'postgres',
        password : 'Kulya86',
        database : 'brain-db'
  }
})


// db.select('*').from('users')
//     .then(response =>{
//     console.log(response);
// });

const app = express();
app.use(express.json()); //middleware to parse JSON format of the frontend, from latest versions built-in the express library, no need to import bodyParser library
app.use(cors());

app.get('/',(req, res) =>{ res.json(db.users)})
    // db.select('*').from('users').then(data => {
    //     res.json(data);
    // }).catch(err => {
    //     res.status(400).json('failed to load users')
    // })
    


app.post('/signin', (req, res) => {handleSignin(req, res, db, bcrypt)}) //1st way of syntax

app.post('/register', handleRegister(db, bcrypt)) //2nd way of syntax

app.post('/imageurl', (req, res) => {handleApiCall(req, res)})

app.get('/profile/:id', handleProfileRequest(db))

app.put('/image', handleImageDetect(db))

app.listen(3000, ()=>{
    console.log('App is running on port 3000');
})
