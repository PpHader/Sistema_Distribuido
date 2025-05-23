package util;

import java.util.regex.Pattern;

public class Validator {
    private static final Pattern EMAIL = Pattern.compile("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$");

    /**
     * Valida los campos del formulario.
     * @return null si todo está OK, o mensaje de error en caso contrario.
     */
    public static String validate(String name, String email, String pass, String confirm) {
        if (name == null || name.isBlank()) {
            return "El nombre es obligatorio.";
        }
        if (email == null || email.isBlank()) {
            return "El email es obligatorio.";
        }
        if (!EMAIL.matcher(email).matches()) {
            return "Formato de email inválido.";
        }
        if (pass == null || pass.length() < 6) {
            return "La contraseña debe tener al menos 6 caracteres.";
        }
        if (!pass.equals(confirm)) {
            return "Las contraseñas no coinciden.";
        }
        return null;
    }
}
