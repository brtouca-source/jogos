
window.Netcode = {
  connected:false,
  roomId:null,
  socket:null,

  connect(roomId){
    this.connected = true;
    this.roomId = roomId;

    console.log("[NETCODE] Connected to room:", roomId);
  },

  sendPlayerState(data){
    if(!this.connected) return;

    console.log("[NETCODE] sync", data);
  },

  disconnect(){
    this.connected = false;
    console.log("[NETCODE] disconnected");
  }
};
