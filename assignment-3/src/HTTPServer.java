import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.ServerSocket;
import java.net.Socket;

public class HTTPServer {
    public static void main(String[] args) {

        final int PORT_NR = 80;

        try {
            ServerSocket serverSocket = new ServerSocket(PORT_NR);
            System.out.println("Waiting for client to connect to port 80...");
            while (true){
                    Socket socket = serverSocket.accept();
                    BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(socket.getInputStream()));
                    StringBuilder stringBuilder = new StringBuilder();
                    System.out.println("Client connected");
                    String openingMessage = """
                            HTTP/1.1 200 OK
                            Content-Type: text/html; charset=utf-8

                            <html><body><h1>Welcome to the web-server!</h1>""";
                    socket.getOutputStream().write(openingMessage.getBytes());
                    String headerFromClient = "Header from client is:\n<ul>";
                    stringBuilder.append(headerFromClient);
                    String line = bufferedReader.readLine();
                    while (line != null && !line.isEmpty()){
                        String newLine = "<li>" + line + "</li>";
                        stringBuilder.append(newLine);
                        line = bufferedReader.readLine();
                    }
                    stringBuilder.append("</ul></body></html>");
                    socket.getOutputStream().write(stringBuilder.toString().getBytes());
                    bufferedReader.close();
                    serverSocket.close();
                }
            } catch (IOException exception){
            System.out.println(exception.getMessage());
        }
    }
}
