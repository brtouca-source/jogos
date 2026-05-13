
window.PlayerManager = {
  players: {},

  createPlayer(id, data = {}) {
    this.players[id] = {
      id,
      x: data.x || 0,
      y: data.y || 0,
      hp: data.hp || 100,
      direction: data.direction || 1,
      attacking: false
    };

    return this.players[id];
  },

  getPlayer(id) {
    return this.players[id];
  },

  removePlayer(id) {
    delete this.players[id];
  }
};
