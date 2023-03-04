package edu.ntnu.idatt2104.sojohans.backend.service;

import edu.ntnu.idatt2104.sojohans.backend.model.Code;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

@Service
public class DockerCompilerService {

    public Code compileAndRunCode(Code code) {
        String[] cmd = getCommand(code);

        try {
            Process process = Runtime.getRuntime().exec(cmd);
            StringBuilder stringBuilder = new StringBuilder();

            code.setError("");
            BufferedReader readError = new BufferedReader(new InputStreamReader(process.getErrorStream()));
            String error = readError.readLine();
            while (error != null){
                stringBuilder.append(error);
                error = readError.readLine();
            }
            code.setError(stringBuilder.toString());

            stringBuilder = new StringBuilder();
            BufferedReader readCompiled = new BufferedReader(new InputStreamReader(process.getInputStream()));
            String compiled = readCompiled.readLine();
            while (compiled != null){
                stringBuilder.append(compiled);
                compiled = readCompiled.readLine();
            }

            try {
                process.waitFor();
            } catch (InterruptedException exception) {
                code.setError(exception.getMessage());
            }
            code.setCompiled(stringBuilder.toString());

        } catch (IOException exception){
            code.setError(exception.getMessage());
        }
        return code;
    }

    private String[] getCommand(Code code){
        String strCode = code.getCode().replace("\"", "'");
        return switch (code.getLanguage()) {
            case "Python" -> new String[]{"docker", "run", "--rm", "python:latest", "python", "-c", strCode};
            //case "Java"
            //case "C++"
            default -> null;
        };
    }
}