package edu.ntnu.idatt2104.sojohans.backend.controller;

import edu.ntnu.idatt2104.sojohans.backend.model.Code;
import edu.ntnu.idatt2104.sojohans.backend.service.DockerCompilerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class DockerController {

    @Autowired
    DockerCompilerService dockerCompilerService;

    @PostMapping("/compile")
    @ResponseBody
    public Code postCode(@RequestBody Code code){
        return this.dockerCompilerService.compileAndRunCode(code);
    }
}
