package edu.ntnu.idatt2104.sojohans.backend.model;

public class Code {
    private final String code;
    private String compiled;
    private final String language;
    private String error;

    public Code(String string, String language){
        this.code = string;
        this.language = language;
    }

    public String getCode() {
        return code;
    }

    public void setCompiled(String compiled) {
        this.compiled = compiled;
    }

    public String getCompiled() {
        return compiled;
    }

    public String getLanguage() {
        return language;
    }

    public void setError(String error) {
        this.error = error;
    }

    public String getError() {
        return error;
    }
}
