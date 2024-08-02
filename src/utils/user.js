const users = [];

const addUser = ({id, username, room}) =>{
    username = username.trim().toLowerCase();
    room = room.trim().toLowerCase();

    //validating the data
    if(!username || !room){
        return {
            error:`username and room are required`
        };
    };

    // check for existing user
    const existingUser = users.find((user)=>{
        return user.room === room && user.username === username;
    });

    // validate username
    if(existingUser){
        return{
            error:`Username is already in use!`
        };
    };

    // Store user
    const user = {id,username,room};
    users.push(user);
    return {user};

};

const removeUser = (id) => {
    const index = users.findIndex((user)=>user.id  === id);
    if(index!==-1){
        return users.splice(index,1)[0];
    };
};

const getUser  = (id) => {
    const user = users.find((user) => user.id === id);
    return user;
};

const getUsersInRoom = (room) => {
    const user = users.filter((user) => user.room === room);
    return user;
};

addUser({
    id:12,
    username:'siddh',
    room:'101'
});
addUser({
    id:12,
    username:'anonymonuse',
    room:'101'
});

console.log(users);
// console.log(getUser(12));
// console.log(getUsersInRoom('101'));

module.exports={
    addUser, getUser, removeUser, getUsersInRoom
};


