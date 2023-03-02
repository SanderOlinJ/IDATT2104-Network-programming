import java.io.IOException;
import java.net.DatagramSocket;

public class UDPServer {

    public static void main(String[] args) {
        final int PORT_NR = 5000;

        try (DatagramSocket serverSocket = new DatagramSocket(PORT_NR)){
            System.out.println("Server is online");
            System.out.println("----------------");
            while (true) {
                new UDPThread(serverSocket).run();
            }
        } catch (IOException exception){
            System.out.println(exception.getMessage());
        }
    }
}
