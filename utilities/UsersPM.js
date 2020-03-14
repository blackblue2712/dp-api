class User {
    constructor() {
        this.users = [];
    }
    
    GetUserById(id) {
        return this.users.filter( u => u.id === id )[0];
    }


    AddConnectedUser(id) {
        if(this.users.indexOf(id) === -1) {
            this.users.push(id);
        }
    }

    GetConnectedUser() {
        return this.users;
    }

    RemoveDisconnectedUser(id) {
        let userDisconnect = this.GetUserById(id);
        console.log("userDisconnectu", userDisconnect)
        if(userDisconnect) {
            this.users = this.users.filter( u => u.id !== id );
            return userDisconnect;
        }
    }

}

module.exports = User;