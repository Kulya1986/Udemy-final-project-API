const handleSignin = (req, res, db, bcrypt) => {
    const {email, password} = req.body;
    if( !email || !password){
        return res.status(400).json('form submission with empty fields');
    }
    db.select('user_email','hash').from('logins')
        .where('user_email','=', email)
        .then(data => {
                bcrypt.compare(password, data[0].hash).then(result => {
                // result == true
                if (result){
                    return db.select('*').from('users')
                        .where('user_email', '=', data[0].user_email)
                        .then(user =>{
                            res.json(user[0]);
                        })
                        .catch(err => res.status(400).json('unable to get user'))    
                    }
                else{
                    res.status(400).json('no user with such credentials')
                }       
            });
        }).catch(err => {
            res.status(400).json('Something went wrong when retrieving user')
        })
}

export default handleSignin;