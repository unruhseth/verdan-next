'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '@clerk/nextjs';

interface WebSocketContextType {
  socket: Socket | null;
  connected: boolean;
  lastMessage: any;
}

const WebSocketContext = createContext<WebSocketContextType>({
  socket: null,
  connected: false,
  lastMessage: null,
});

export function WebSocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<any>(null);
  const { getToken } = useAuth();

  useEffect(() => {
    async function initializeSocket() {
      try {
        const token = await getToken();
        if (!token) {
          console.error("No authentication token available for WebSocket");
          return;
        }

        const socketInstance = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000', {
          transports: ['websocket'],
          autoConnect: true,
          auth: {
            token
          },
          extraHeaders: {
            Authorization: `Bearer ${token}`
          }
        });

        socketInstance.on('connect', () => {
          console.log('WebSocket connected');
          setConnected(true);
        });

        socketInstance.on('connect_error', (error) => {
          console.error('WebSocket connection error:', error);
          setConnected(false);
        });

        socketInstance.on('disconnect', (reason) => {
          console.log('WebSocket disconnected:', reason);
          setConnected(false);
        });

        socketInstance.on('error', (error) => {
          console.error('WebSocket error:', error);
        });

        socketInstance.on('message', (message) => {
          console.log('Received message:', message);
          setLastMessage(message);
        });

        setSocket(socketInstance);

        return () => {
          socketInstance.disconnect();
        };
      } catch (error) {
        console.error('Error initializing WebSocket:', error);
      }
    }

    initializeSocket();
  }, [getToken]);

  return (
    <WebSocketContext.Provider value={{ socket, connected, lastMessage }}>
      {children}
    </WebSocketContext.Provider>
  );
}

export function useWebSocket() {
  return useContext(WebSocketContext);
} 