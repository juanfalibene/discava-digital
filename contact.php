<?php
// Configura los headers para permitir la solicitud desde tu frontend
header('Access-Control-Allow-Origin: https://dev.juanfalibene.com/discava/'); // Cambia * por tu dominio en producción (ej. https://discava.juanfalibene.com)
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Si es una solicitud OPTIONS (preflight), terminamos aquí
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Verifica que la solicitud sea POST
if ($_SERVER["REQUEST_METHOD"] == "POST") {

    // Decodifica el JSON recibido de JS
    $data = json_decode(file_get_contents("php://input"), true);

    // Si los datos vienen por formulario tradicional en vez de JSON
    if (!$data) {
        $data = $_POST;
    }

    // Validación y sanitización básica
    $name = isset($data['name']) ? strip_tags(trim($data['name'])) : '';
    $email = isset($data['email']) ? filter_var(trim($data['email']), FILTER_SANITIZE_EMAIL) : '';
    $message = isset($data['message']) ? strip_tags(trim($data['message'])) : '';

    // Honeypot básico (campo oculto para bots). Si está lleno, es un bot.
    $honeypot = isset($data['website']) ? $data['website'] : '';
    if (!empty($honeypot)) {
        // Engañamos al bot diciendo que fue exitoso
        echo json_encode(["status" => "success", "message" => "Message sent."]);
        exit;
    }

    // Verifica que los campos obligatorios no estén vacíos
    if (empty($name) || empty($message) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Please complete all fields with a valid email."]);
        exit;
    }

    // Configuración del correo
    $recipient = "juanignaciofalibene@gmail.com"; // REEMPLAZA ESTO CON TU EMAIL REAL
    $subject = "New contact from Discava!: $name";

    // Construye el cuerpo del mensaje
    $email_content = "Name: $name\n";
    $email_content .= "Email: $email\n\n";
    $email_content .= "Message:\n$message\n";

    // Construye los encabezados
    $email_headers = "From: Discava Contact <noreply@juanfalibene.com>\r\n";
    $email_headers .= "Reply-To: $email";

    // Envía el correo
    if (mail($recipient, $subject, $email_content, $email_headers)) {
        http_response_code(200);
        echo json_encode(["status" => "success", "message" => "Thank you! Your message has been sent."]);
    } else {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Oops! Something went wrong and we couldn't send your message."]);
    }

} else {
    // No es una solicitud POST
    http_response_code(403);
    echo json_encode(["status" => "error", "message" => "There was a problem with your submission, please try again."]);
}
?>