<?php
header("Access-Control-Allow-Origin: *");
$lastName = $_POST["lastName"];
$firstName = $_POST["firstName"];
$tel = $_POST["tel"];
$city = $_POST["city"];
$program = $_POST["program"];

if (!$lastName) {
  die("{\"success\": false}");
}

$subject = "Заявка с сайта mirum.kz";
$message =
  '
<html>
<head>
  <title>Заявка с сайта</title>
</head>
<body>
  <p>Новая заявка</p>
  <table cellpadding="8px">
    <tbody>
      <tr>
        <th>Фамилия</th>
        <th>Имя</th>
        <th>Город</th>
        <th>Программа</th>
        <th>Телефон</th>
      </tr>
      <tr>
        <td>' .
  $lastName .
  '</td>
        <td>' .
  $firstName .
  '</td>
        <td>' .
  $city .
  '</td>
        <td>' .
  $program .
  '</td>
        <td>' .
  $tel .
  '</td>
      </tr>
  </tbody></table>
</body>
</html>
';

$headers = "MIME-Version: 1.0" . "\r\n";
$headers .= "Content-Type: text/html; charset=UTF-8" . "\r\n";

// Additional headers
$headers .= "To: Mirum Requests <mirum.requests@gmail.com>" . "\r\n";
$headers .= "From: noreply <noreply@mirum.kz>" . "\r\n";

// Mail it
if (mail($to, $subject, $message, $headers)) {
  echo "{\"success\": true}";
} else {
  echo "{\"success\": false}";
}
