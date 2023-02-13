import java.io.*;
import java.net.*;

public class SocketServer {
    public static void main(String[] args) throws IOException {

        final int PORT_NR = 1250;
        ServerSocket server = new ServerSocket(PORT_NR);
        System.out.println("Waiting for connection...");
        Socket connection = server.accept();
        System.out.println("Connection made with client");

        InputStreamReader readingConnection = new InputStreamReader(connection.getInputStream());
        BufferedReader reader = new BufferedReader(readingConnection);
        PrintWriter writer = new PrintWriter(connection.getOutputStream(), true);

        writer.println("Connection has been made between client and server.");
        writer.println("Write whatever you want, and server will repeat");

        String line = reader.readLine();
        while (line != null){
            System.out.println("Client wrote: " + line);
            writer.println("You wrote: " + line);
            line = reader.readLine();
        }

        writer.close();
        reader.close();
        connection.close();
    }
}