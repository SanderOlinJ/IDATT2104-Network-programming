import java.io.*;
import java.net.*;
import java.util.Scanner;

public class SocketClient {
    public static void main(String[] args) throws IOException {

        final int PORT_NR = 1337;
        Scanner readFromTerminal = new Scanner(System.in);
        System.out.println("Name of server: ");
        String server = readFromTerminal.nextLine();

        Socket connection = new Socket(server, PORT_NR);
        InputStreamReader readingConnection = new InputStreamReader(connection.getInputStream());
        BufferedReader reader = new BufferedReader(readingConnection);
        PrintWriter writer = new PrintWriter(connection.getOutputStream(), true);

        String line1 = reader.readLine();
        String line2 = reader.readLine();
        String line3 = reader.readLine();
        System.out.println(line1 + "\n" + line2 + "\n" + line3);

        String newLine = readFromTerminal.nextLine();
        while (newLine != null && !newLine.isEmpty()){
            writer.println(newLine);
            String response = reader.readLine();
            System.out.println("From server: " + response);
            System.out.println(reader.readLine());
            newLine = readFromTerminal.nextLine();
        }
        reader.close();
        writer.close();
        connection.close();
    }
}