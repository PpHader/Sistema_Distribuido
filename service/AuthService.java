package service;

import model.Student;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.concurrent.CompletableFuture;

public class AuthService {
    private static final String BASE_URL = "https://auth.example.com/api";
    private static final HttpClient client = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(10))
            .build();

    /** Lanza el registro y devuelve un CompletableFuture con el mensaje de éxito */
    public static CompletableFuture<String> register(Student s) {
        String payload = s.toJson();
        HttpRequest req = HttpRequest.newBuilder()
                .uri(URI.create(BASE_URL + "/register"))
                .timeout(Duration.ofSeconds(10))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(payload))
                .build();

        return client.sendAsync(req, HttpResponse.BodyHandlers.ofString())
                .thenApply(resp -> {
                    if (resp.statusCode() == 201) {
                        return "Cuenta creada correctamente";
                    } else {
                        throw new RuntimeException(parseError(resp.body()));
                    }
                });
    }

    /** Extrae mensaje de error de la respuesta JSON */
    private static String parseError(String body) {
        // Por simplicidad, buscamos manualmente el campo "error"
        int i = body.indexOf("\"error\":");
        if (i >= 0) {
            int start = body.indexOf('"', i + 8) + 1;
            int end   = body.indexOf('"', start);
            if (start > 0 && end > start) {
                return body.substring(start, end);
            }
        }
        return "Error desconocido del servidor";
    }
}
