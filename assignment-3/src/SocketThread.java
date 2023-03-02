import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.Socket;

public class SocketThread extends Thread{
    private final Socket socket;

    public SocketThread(Socket socket){
        this.socket = socket;
    }

    @Override
    public void run() {
        try {
            InputStreamReader readingConnection = new InputStreamReader(socket.getInputStream());
            BufferedReader reader = new BufferedReader(readingConnection);
            PrintWriter writer = new PrintWriter(socket.getOutputStream(), true);
            writer.println("Connection has been made between client and server.");
            writer.println("Type empty string and enter to quit.");
            writer.println("Input complete math expression (only adding and subtracting): ");
            try {
                String line = reader.readLine();
                while (line != null && !line.isEmpty()) {
                    line = line.replaceAll("\\s", "");
                    System.out.println("Client wrote: " + line);
                    int result;
                    try {
                        result = calculateExpression(line);
                        writer.println(line + " = " + result);
                    } catch (IOException exception){
                        writer.println(exception.getMessage());
                    }
                    writer.println("Input complete math expression (only adding and subtracting): ");
                    line = reader.readLine();
                }
            } catch (IOException exception){
                writer.println(exception.getMessage());
            }
            writer.close();
            reader.close();
            socket.close();
        } catch (IOException exception){
            exception.printStackTrace();
        }
    }
    public static int calculateExpression(String line) throws IOException{
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
