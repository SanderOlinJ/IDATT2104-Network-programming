import java.io.IOException;
import java.net.DatagramPacket;
import java.net.DatagramSocket;
import java.net.InetAddress;
import java.nio.charset.StandardCharsets;

public class UDPThread {
    DatagramSocket socket;
    public UDPThread(DatagramSocket socket) throws IOException {
        this.socket = socket;
    }

    public void run(){
        try{
            DatagramPacket packetReceived;
            DatagramPacket packetSend;
            InetAddress address = InetAddress.getLocalHost();
            byte[] bytes;
            while (true){
                bytes = new byte[65535];
                System.out.println("Waiting for packet...");
                packetReceived = new DatagramPacket(bytes, bytes.length);
                socket.receive(packetReceived);
                String input = new String(bytes, 0, bytes.length);

                System.out.println("Packet received: " + input.trim());
                if (input.trim().equals("EXIT")){
                    break;
                }
                String result = calculateExpression(input);
                System.out.println("Calculation of: " + input.trim() + ", gives: " + result);
                byte[] bytesSend = result.getBytes(StandardCharsets.UTF_8);
                packetSend = new DatagramPacket(bytesSend, bytesSend.length, address, packetReceived.getPort());
                System.out.println("Sending calculation.");
                socket.send(packetSend);
                System.out.println("Calculation sent.");
                System.out.println("-----------------");
            }
            System.out.println("EXITING");
        } catch (IOException exception){
            System.out.println(exception.getMessage());
        }
    }

    public static String calculateExpression(String line) throws IOException{
        line = line.trim();
        String[] split = line.split("(?<=\\d)(?=\\D)|(?<=\\D)(?=\\d)");
        if (split.length % 2 == 0){
            throw new IOException("Math expression can only contain integers and operators.");
        }
        double result = Double.parseDouble(split[0]);
        for (int i = 1; i < split.length; i+=2){
            switch (split[i]) {
                case "+" -> result += Double.parseDouble(split[i + 1]);
                case "-" -> result -= Double.parseDouble(split[i + 1]);
                case "*" -> result *= Double.parseDouble(split[i + 1]);
                case "/" -> result /= Double.parseDouble(split[i + 1]);
                default -> {
                    return  "Math expression can only contain integers and operators.";
                }
            }
        }
        return Double.toString(result);
    }
}
