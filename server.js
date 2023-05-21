import express from 'express';
import bcrypt from 'bcrypt';
import cors from 'cors';

const app = express();
app.use(express.json()); //middleware to parse JSON format of the frontend, from latest versions built-in the express library, no need to import bodyParser library
app.use(cors());

const database = {
    users: [
        {
            id:"123",
            name: "john",
            email: "john123@gmail.com",
            password: "cookies",
            entries: 0,
            joined: new Date()
        },
        {
            id:"456",
            name: "sally",
            email: "sally456@gmail.com",
            password: "cakes",
            entries: 0,
            joined: new Date()
        }
    ]
}

app.get('/',(req, res) =>{
    res.send(database.users);
})

app.post('/signin', (req, res) => {
    if (req.body.email === database.users[0].email &&
        req.body.password === database.users[0].password){
            res.json(database.users[0]);
        }
    else res.status(400).json('Error log in')
})

app.post('/register', (req, res) =>{
   const {email, name, password} = req.body;
    database.users.push({
        id:"128",
        name: name,
        email: email,
        // password: password,
        entries: 0,
        joined: new Date()
   })
   res.json(database.users[database.users.length-1]);
})

app.get('/profile/:id', (req, res) =>{
    const {id} = req.params;
    const found = database.users.filter(user=>{
        return user.id === id;
    })
    if (found.length>0) res.json(found);
    else res.status(400).json('user not found');
})

app.put('/image', (req, res) =>{
    const {id} = req.body;
    let found = false;
    database.users.forEach(user =>{
        if (user.id === id) {
            found = true;
            user.entries++;
            return res.json(user.entries);
        }
    })
    if (!found) res.status(400).json('user not found');
})

app.listen(3000, ()=>{
    console.log('App is running on port 3000');
})


