package edu.ntnu.idatt2104.sojohans.backend.controller;

import edu.ntnu.idatt2104.sojohans.backend.model.Code;
import edu.ntnu.idatt2104.sojohans.backend.service.DockerCompilerService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class DockerController {

    @Autowired
    DockerCompilerService dockerCompilerService;

    private Logger logger = LoggerFactory.getLogger(DockerController.class);

    @PostMapping("/compile")
    @ResponseBody
    public Code postCode(@RequestBody Code code){
        logger.info("Code received: " + code.getCode());
        this.dockerCompilerService.compileAndRunCode(code);
        if (!code.getError().equals("")){
            logger.info("Code error: " + code.getError());
        } else {
            logger.info("Code output: " + code.getCompiled());
        }
        return code;
    }
}
