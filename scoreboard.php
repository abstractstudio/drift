<?php

$username = 'drift';
$password = '8r?+LSFp$_k&2*%r';
$servername = 'localhost';

// Convenience.
function display($result) {
    $json = array();
    while ($row = mysqli_fetch_row($result)) $json[] = [$row[0], $row[1]];
    echo json_encode($json);
}

if (isset($_POST["mode"])) $mode = $_POST["mode"];
else if (isset($_GET["mode"])) $mode = $_GET["mode"];
else $mode = "normal";

// Create connection.
$conn = new mysqli($servername, $username, $password, "drift");
if ($conn->connect_error) { die("Connection failed: " . $conn->connect_error); }

// Add the score.
if (isset($_POST["score"]) && isset($_POST["name"])) {
    $stmt = $conn->prepare("INSERT INTO " . $mode . " (name, score) VALUES (?, ?);");
    $stmt->bind_param("ss", $name, $score);
    $name = (string)$_POST["name"];
    $score = (string)$_POST["score"];
    $result = $stmt->execute();
}

// Remove the lowest if more than 10 and display.
//if ($result->num_rows > 10) $result = $conn->query("DELETE FROM " . $mode . " ORDER BY score LIMIT 1;");
$result = $conn->query("SELECT * FROM " . $mode . " ORDER BY score DESC LIMIT 10;");
display($result);

// Close connection.
$conn->close();

?>

