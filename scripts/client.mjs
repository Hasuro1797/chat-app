import io from 'socket.io-client';
import axios from 'axios';
import { BadGatewayException, UnauthorizedException } from '@nestjs/common';

async function authenticate(username, password) {
  try {
    const response = await axios.post(`http://localhost:3000/api/auth/login`, {
      username,
      password,
    });
    return response.data.token;
  } catch (error) {
    throw new BadGatewayException('Failed to authenticate');
  }
}

async function startChat() {
  const token = await authenticate('mario12', 'Password123*');
  if (!token) throw new UnauthorizedException('Authentication failed');

  const socket = io('http://localhost:3000', {
    extraHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });

  socket.on('connect', () => {
    console.log('Connected to server');

    socket.emit('sendMessage', { content: 'Como estamos por dos' });

    socket.on('newMessage', (message) => {
      console.log(`New message from ${message.username}: ${message.content}`);
    });
  });

  socket.on('disconnect', () => {
    console.log('Disconnected from server');
  });
}

startChat();
