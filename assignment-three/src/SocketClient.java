import java.io.*;
import java.net.*;
import java.util.Scanner;

public class SocketClient {
    public static void main(String[] args) throws IOException {

        final int PORT_NR = 1250;
        Scanner readFromTerminal = new Scanner(System.in);
        System.out.println("Name of server: ");
        String server = readFromTerminal.nextLine();

        Socket connection = new Socket(server, PORT_NR);
        System.out.println("Connection made with server.");

        InputStreamReader readingConnection = new InputStreamReader(connection.getInputStream());
        BufferedReader reader = new BufferedReader(readingConnection);
        PrintWriter writer = new PrintWriter(connection.getOutputStream(), true);

        String line1 = reader.readLine();
        String line2 = reader.readLine();
        System.out.println(line1 + "\n" + line2);

        String newLine = readFromTerminal.nextLine();
        while (!newLine.equals("")){
            writer.println(newLine);
            String response = reader.readLine();
            System.out.println("From server: " + response);
            newLine = readFromTerminal.nextLine();
        }

        reader.close();
        writer.close();
        connection.close();
    }
}