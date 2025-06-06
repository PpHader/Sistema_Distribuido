import javafx.application.Application;
import javafx.fxml.FXMLLoader;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.stage.Stage;

public class Main extends Application {
    @Override
    public void start(Stage primary) throws Exception {
        Parent root = FXMLLoader.load(getClass().getResource("/view/register.fxml"));
        primary.setTitle("Registro de Estudiante");
        primary.setScene(new Scene(root, 400, 300));
        primary.show();
    }

    public static void main(String[] args) {
        launch(args);
    }
}
