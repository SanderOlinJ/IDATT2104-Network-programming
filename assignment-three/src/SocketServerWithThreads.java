import java.io.IOException;
import java.net.ServerSocket;

public class SocketServerWithThreads {

    public static void main(String[] args) {
        final int PORT_NR = 1337;
        int nrOfConnections = 0;
        try (ServerSocket serverSocket = new ServerSocket(PORT_NR)){
            System.out.println("Server is online");
            while (true) {
                new SocketThread(serverSocket.accept()).start();
                nrOfConnections++;
                System.out.println("New connection: " + nrOfConnections);
            }
        } catch (IOException exception){
            System.out.println(exception.getMessage());
        }
    }
}
