export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/room") {
      const roomId = (url.searchParams.get("room") || "TESTE").toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 8);
      const id = env.ROOM.idFromName(roomId);
      const obj = env.ROOM.get(id);
      return obj.fetch(request);
    }

    return new Response(
      "MUNDO MAGICO realtime worker online. Use /room?room=CODIGO via WebSocket.",
      { status: 200, headers: { "content-type": "text/plain;charset=UTF-8" } }
    );
  }
};

export class Room {
  constructor(state, env) {
    this.state = state;
    this.env = env;
    this.sessions = new Map();
    this.players = {};
  }

  async fetch(request) {
    const upgrade = request.headers.get("Upgrade");
    if (upgrade !== "websocket") {
      return new Response("Expected WebSocket", { status: 426 });
    }

    const url = new URL(request.url);
    const nick = (url.searchParams.get("nick") || "Jogador").slice(0, 12);

    const pair = new WebSocketPair();
    const client = pair[0];
    const server = pair[1];

    server.accept();

    const id = crypto.randomUUID().slice(0, 8);
    const role = this.sessions.size === 0 ? "host" : "guest";

    this.sessions.set(id, server);
    this.players[id] = {
      nickname: nick,
      skin: role,
      x: 120,
      y: 180,
      hp: 100,
      dir: 1,
      attacking: false
    };

    server.send(JSON.stringify({ type: "welcome", id, role }));
    this.broadcastPlayers();

    server.addEventListener("message", event => {
      let msg;
      try {
        msg = JSON.parse(event.data);
      } catch {
        return;
      }

      if (msg.type === "state" && msg.state) {
        this.players[id] = {
          ...this.players[id],
          ...msg.state,
          nickname: this.players[id].nickname,
          skin: this.players[id].skin
        };

        this.broadcast({
          type: "state",
          id,
          state: this.players[id]
        }, id);
      }

      if (msg.type === "hello" && msg.state) {
        this.players[id] = {
          ...this.players[id],
          ...msg.state,
          nickname: nick,
          skin: role
        };
        this.broadcastPlayers();
      }
    });

    server.addEventListener("close", () => this.leave(id));
    server.addEventListener("error", () => this.leave(id));

    return new Response(null, { status: 101, webSocket: client });
  }

  leave(id) {
    try {
      this.sessions.delete(id);
      delete this.players[id];
      this.broadcast({ type: "leave", id });
      this.broadcastPlayers();
    } catch {}
  }

  broadcastPlayers() {
    this.broadcast({ type: "players", players: this.players });
  }

  broadcast(obj, exceptId = null) {
    const data = JSON.stringify(obj);
    for (const [id, ws] of this.sessions) {
      if (id === exceptId) continue;
      try {
        ws.send(data);
      } catch {
        this.leave(id);
      }
    }
  }
}
