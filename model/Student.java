package model;

import com.google.gson.Gson;

public class Student {
    private String name;
    private String email;
    private String password;

    public Student(String name, String email, String password) {
        this.name     = name;
        this.email    = email;
        this.password = password;
    }

    /** Serializa este objeto a JSON usando Gson */
    public String toJson() {
        return new Gson().toJson(this);
    }

    // Getters y setters (si los necesitas)
}
