import { SubscribeMessage, WebSocketServer, WebSocketGateway, WsResponse } from '@nestjs/websockets';
import { Client, Server } from 'socket.io';

@WebSocketGateway()
export class EventsGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('joinGame')
  handleMessage(client: any, payload: any): WsResponse<unknown> {
    console.log(payload);
    const event = 'joinGame';
    return { event, data: payload };
  }
}
