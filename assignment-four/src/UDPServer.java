import java.io.IOException;
import java.net.DatagramPacket;
import java.net.DatagramSocket;
import java.net.InetAddress;
import java.nio.charset.StandardCharsets;

public class UDPServer {

    public static void main(String[] args) {
        final int PORT_NR = 5000;
        try{
            final DatagramSocket serverSocket = new DatagramSocket(PORT_NR);
            DatagramPacket packetReceived;
            DatagramPacket packetSend;
            InetAddress address = InetAddress.getLocalHost();
            byte[] bytes;
            while (true){
                bytes = new byte[65535];
                System.out.println("Waiting for packet...");
                packetReceived = new DatagramPacket(bytes, bytes.length);
                serverSocket.receive(packetReceived);
                System.out.println("Packet received.");

                String input = new String(bytes, 0, bytes.length);
                if (input.equals("EXIT")){
                    break;
                }
                String result = Integer.toString(calculateExpression(input));
                byte[] bytesSend = result.getBytes(StandardCharsets.UTF_8);
                packetSend = new DatagramPacket(bytesSend, bytesSend.length, address, packetReceived.getPort());
                System.out.println("Sending calculation.");
                serverSocket.send(packetSend);
                System.out.println("Calculation sent.");
            }
            System.out.println("EXITING");
        } catch (IOException exception){
            System.out.println(exception.getMessage());
        }
    }

    public static int calculateExpression(String line) throws IOException{
        line = line.trim();
        System.out.println(line);
        String[] split = line.split("(?<=\\d)(?=\\D)|(?<=\\D)(?=\\d)");
        if (split.length % 2 == 0){
            throw new IOException("Math expression can only contain integers and operators.");
        }
        int result = Integer.parseInt(split[0]);
        for (int i = 1; i < split.length; i+=2){
            switch (split[i]) {
                case "+" -> result += Integer.parseInt(split[i + 1]);
                case "-" -> result -= Integer.parseInt(split[i + 1]);
                default -> throw new IOException("Math expression can only contain integers and operators.");
            }
        }
        return result;
    }
}
