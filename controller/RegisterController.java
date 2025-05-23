package controller;

import javafx.fxml.FXML;
import javafx.scene.control.Alert;
import javafx.scene.control.PasswordField;
import javafx.scene.control.TextField;
import model.Student;
import service.AuthService;
import util.Validator;

public class RegisterController {

    @FXML private TextField txtName;
    @FXML private TextField txtEmail;
    @FXML private PasswordField txtPassword;
    @FXML private PasswordField txtConfirm;

    @FXML
    private void initialize() {
        // Cualquier inicialización extra
    }

    @FXML
    private void onRegisterClicked() {
        String name     = txtName.getText();
        String email    = txtEmail.getText();
        String password = txtPassword.getText();
        String confirm  = txtConfirm.getText();

        String error = Validator.validate(name, email, password, confirm);
        if (error != null) {
            showAlert(Alert.AlertType.ERROR, "Error de validación", error);
            return;
        }

        Student s = new Student(name, email, password);
        AuthService.register(s)
                .thenAccept(successMsg -> showAlert(Alert.AlertType.INFORMATION, "¡Éxito!", successMsg))
                .exceptionally(ex -> {
                    showAlert(Alert.AlertType.ERROR, "Fallo al registrar", ex.getMessage());
                    return null;
                });
    }

    private void showAlert(Alert.AlertType type, String title, String msg) {
        Alert a = new Alert(type);
        a.setTitle(title);
        a.setHeaderText(null);
        a.setContentText(msg);
        a.showAndWait();
    }
}
