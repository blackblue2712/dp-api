class User {
    constructor() {
        this.users = [];
    }
    
    GetUserById(id) {
        return this.users.filter( u => u.sid === id )[0];
    }


    AddConnectedChanelUser(sid, uid, name, photo, room) {
        this.users.push( {sid, uid, name, photo, room} );
    }

    GetConnectedChanelUser(room) {
        let inRoomUsers = this.users.filter( u => u.room === room);
        return inRoomUsers;
    }
    GetUidConnectedChanelUser(room) {
        let inRoomUsers = this.users.filter( u => u.room === room);
        return inRoomUsers.map( user => {
            return user.uid;
        });
    }

    RemoveDisconnectdChanelUser(id) {
        let userDisconnect = this.GetUserById(id);
        
        if(userDisconnect) {
            this.users = this.users.filter( u => u.sid !== id );
            return userDisconnect;
        }
    }

}

module.exports = User;