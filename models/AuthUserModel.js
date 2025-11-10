const db = require('../db')

module.exports = class User {
    constructor(username, first_name, last_name, password) {
        this.user_id = undefined
        this.user_name = username
        this.first_name = first_name
        this.last_name = last_name
        this.password = password
    }

    static async fetchByUsername(username, password, checked) {
        if(checked){
            let usrPassResults = await dbGetUserByNamePass(username, password)
            let usrResults = await dbGetUserByName(username)
            if(usrPassResults.length === 0){
                if(usrResults.length === 0){
                    return "Netočno korisničko ime."
                }
                else{
                    return "Netočna lozinka."
                }
            }
            return "Uspješna prijava."
        }
        else{
            let usrResults = await dbGetUserByName(username)
            if(usrResults.length === 0){
                return "Netočno korisničko ime ili lozinka."
            }
            else{
                let usrPassResults = await dbGetUserByNamePass(username, password)
                if(usrResults[0].failed_attempts >= 4){
                    if(usrPassResults.length === 0){
                        //Opet kriva lozinka
                        let newLockTime = new Date(Date.now() + 1*60*1000);
                        await dbUpdateFailedAndLock(5,newLockTime,username)
                        return "Prijava za ovog korisnika je zaključana idućih 1 minuta."
                    }
                    else{
                        //Dobra prijava, provjeri vrijeme
                        if (usrPassResults[0].locked_until.getTime() > Date.now()) {
                            return 'Račun je trenutno zaključan.';
                        } else {
                            await dbUpdateFailedAndLock(0, new Date(Date.now()), username)
                            return "Uspješna prijava"
                        }
                    }
                }else{
                    if(usrPassResults.length !== 0){
                        //Restartiraj neuspjele pokusaje i zakljucanost
                        await dbUpdateFailedAndLock(0,new Date(Date.now()),username)
                        return "Uspješna prijava."
                    }
                    else{
                        let newFailedAttempts = usrResults[0].failed_attempts + 1
                        await dbUpdateFailedAndLock(newFailedAttempts,usrResults[0].locked_until,username)
                        return "Netočno korisničko ime ili lozinka."
                    }
                }
            }
        }
        return "Nepredviđena greška."
    }

}

dbUpdateFailedAndLock = async (failed_attempts, locked_until, user_name) => {
    const sql = `UPDATE users SET failed_attempts = $1, locked_until = $2 WHERE user_name = $3`;
    try {
        const result = await db.query(sql, [failed_attempts, locked_until, user_name]);
        return result.rows;
    } catch (err) {
        console.log(err);
        throw err
    }
};

dbGetUserByName = async (user_name) => {
    const sql = `SELECT user_id, user_name, first_name, last_name, password, failed_attempts, locked_until 
    FROM users WHERE user_name = $1`;
    try {
        const result = await db.query(sql, [user_name]);
        return result.rows;
    } catch (err) {
        console.log(err);
        throw err
    }
};

dbGetUserByNamePass = async (user_name, password) => {
    const sql = `SELECT user_id, user_name, first_name, last_name, password, failed_attempts, locked_until
    FROM users WHERE user_name = $2 AND password = $1`;
    try {
        const result = await db.query(sql, [password, user_name]);
        return result.rows;
    } catch (err) {
        console.log(err);
        throw err
    }
};

