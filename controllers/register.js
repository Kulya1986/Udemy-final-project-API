const handleRegister = (db, bcrypt) =>(req, res) =>{
    const {email, name, password} = req.body;
    const saltRounds = 10;
    if( !email || !password || !name){
       return res.status(400).json('form submission with empty fields');
    }
    bcrypt.hash(password, saltRounds).then(hash => {
    // Store hash in your password DB.
        db.transaction(trx => {
            trx.insert({
                hash: hash,
                user_email: email
            })
            .into('logins')
            .returning('user_email')
            .then(loginEmail => {
                return trx('users')
                    .returning('*')
                    .insert({
                        user_email:loginEmail[0].user_email,
                        user_name:name,
                        join_date: new Date()
                    }).then(user => {
                        res.json(user[0]);
                    })
            }).then(trx.commit)
            .catch(trx.rollback)
        })
    })
    .catch(err => res.status(400).json('unable to register'));        
}

export default handleRegister;
