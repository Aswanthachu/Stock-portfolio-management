import { io } from "../../index.js";
import User from "../../models/user.js";
export let activeUsers = []

export const initializeTicketEvents = (io)=>{
    io.on('connection',async(socket)=>{
        console.log("connected.");
        try {
            const existingUserIndex = activeUsers.findIndex((user) => user.userId === socket.userId);
            if (existingUserIndex !== -1) {
                // Update the socketId if the user is already present
                activeUsers[existingUserIndex].socketId = socket.id;
                // console.log('User updated:', activeUsers[existingUserIndex]);
            } else {
                // Add the user if not present
                activeUsers.push({ 'userId': socket.userId, 'socketId': socket.id });
                // console.log('New user connected',activeUsers);
            }
            // Fetch user IDs with roles 1 or 4 directly from the User collection
            const users = await User.find({ role: { $in: [1, 4] } }, { _id: 1 });
        
            if (users && users.length > 0) {
                const userIds = users.map((user) => user._id);
    
                // Emit activeUsers to the selected users
                userIds.forEach((userId) => {
                    emitDataToUser('activeUsers', userId, activeUsers);
                });
            }
        } catch (error) {
           console.log(error);
           socket.emit('error',{message:'An error occured',error}) 
        }
        
        socket.on('getSubadmins',async(category)=>{
            let role
        if(category === 'Financial'){
            role=2
        }else{
            role=3
        }
     const data =   await User.find({role:role},{username:1,lastSeen:1,email:1})
   
      
     socket.emit('getSubadmins',data)
        })

        socket.on('getOnlineUsers',async()=>{
            // const user = await User.findById(socket.userId)
            // console.log(user);
            socket.emit('activeUsers',activeUsers)
        })

        socket.on('disconnect',async()=>{
            console.log("disconnected.");
            activeUsers=activeUsers.filter((user)=> user.socketId !==socket.id)
            await User.findByIdAndUpdate(socket.userId,{lastSeen: new Date()})
            // console.log('A user disconnected')
            try {
                // Fetch user IDs with roles 1 or 4 directly from the User collection
                const users = await User.find({ role: { $in: [1, 4] } }, { _id: 1 });
        
                if (users && users.length > 0) {
                    const userIds = users.map((user) => user._id);
        
                    // Emit activeUsers to the selected users
                    userIds.forEach((userId) => {
                        emitDataToUser('activeUsers', userId, activeUsers);
                    });
                }
            } catch (error) {
                console.error('Error while emitting activeUsers:', error);
            }
        })
    })
}

export const emitDataToUser = (event, userId, data) => {

    // Find the user with the given userId in the activeUsers array
    const user = activeUsers.find(user => user.userId === userId.toString());
    if (user) {
        // Emit the message to the user's socket
        // user.socket.emit(event, data);
        io.to(user.socketId).emit(event,data)
    } else {
        // console.log(`User with userId ${userId} not found in activeUsers`);
    }
};

export const getActiveUsers = ()=> activeUsers