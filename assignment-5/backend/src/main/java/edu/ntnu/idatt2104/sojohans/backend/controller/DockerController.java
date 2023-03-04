package edu.ntnu.idatt2104.sojohans.backend.controller;

import edu.ntnu.idatt2104.sojohans.backend.model.Code;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class DockerController {

    @PostMapping("/compile")
    public void compileAndRunCode(@RequestBody Code code){
        System.out.println(code.getCode() + "|"+ code.getLanguage());
    }
}
