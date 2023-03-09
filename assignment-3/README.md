# Assignment 3

This is the third obligatory assignment in the course IDATT2104 Network Programming.

The assignment was split into 3 tasks:
  - Create a client/server program using sockets, where the client sends a math equation and the server solves it.
  - Expanding on the first task, use threads so the server may handle multiple clients.
  - Create a simple web-server.

The assignment was solved with Java using Socket and ServerSocket from java.net. On expanding the server to handle multiple clients, SocketThreads were implemented.
They extend Thread and are instantiated everytime a client tries to connect to the server.
