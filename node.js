 <?php
session_start();
header("Content-Type: application/json");

$apiKey = "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";

$data = json_decode(file_get_contents("php://input"), true);
$message = trim($data["message"] ?? "");

if (!$message) {
    echo json_encode(["reply" => "Pesan kosong 😖🌸"]);
    exit;
}

// custom respon
if (stripos($message, "siapa yg menciptakan") !== false) {
    echo json_encode([
        "reply" => "Aku diciptakan oleh Fajar Kurniawan, anak SMK jurusan TSM yang jago banget ngoding 💖🌸"
    ]);
    exit;
}

// memory chat
if (!isset($_SESSION["chat"])) {
    $_SESSION["chat"] = [];
}

$_SESSION["chat"][] = ["role" => "user", "content" => $message];
$_SESSION["chat"] = array_slice($_SESSION["chat"], -6);

// system prompt
$messages = array_merge([
    [
        "role" => "system",
        "content" => "Kamu adalah NAYA, AI perempuan yang manis, santai, suka emoji 🌸💖"
    ]
], $_SESSION["chat"]);

$ch = curl_init("https://api.openai.com/v1/chat/completions");

curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => json_encode([
        "model" => "gpt-4o-mini",
        "messages" => $messages
    ]),
    CURLOPT_HTTPHEADER => [
        "Content-Type: application/json",
        "Authorization: Bearer $apiKey"
    ]
]);

$response = curl_exec($ch);
curl_close($ch);

$result = json_decode($response, true);
$reply = $result["choices"][0]["message"]["content"] ?? "NAYA error 😢";

// simpan jawaban
$_SESSION["chat"][] = ["role" => "assistant", "content" => $reply];

echo json_encode(["reply" => $reply]);
