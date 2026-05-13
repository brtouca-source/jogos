MUNDO MÁGICO MULTIPLAYER V4 - REALTIME

Incluído:
- Frontend com WebSocket real.
- Modo solo preservado.
- Coop ainda separado do solo.
- Nicknames continuam com texto branco e fundo preto 50%.
- Skins host/guest preservadas.
- Cloudflare Worker com Durable Object para salas.
- Convite agora usa ?room=CODIGO para funcionar melhor em GitHub Pages.

Arquivos importantes:
- HTML principal do jogo.
- cloudflare-worker.js
- wrangler.toml

Como publicar o backend:
1. Instale Wrangler:
   npm install -g wrangler

2. Faça login:
   wrangler login

3. Dentro da pasta do projeto:
   wrangler deploy

4. Copie a URL do Worker.
   Exemplo:
   https://mundo-magico-realtime.SEUNOME.workers.dev

5. No jogo, clique em "Config Worker" e cole:
   wss://mundo-magico-realtime.SEUNOME.workers.dev/room

6. Crie uma sala e mande o link para o amigo.

Estado:
- Rede realtime criada.
- Players enviam estado 20x por segundo.
- Inimigos/boss ainda não estão sincronizados nesta etapa.
