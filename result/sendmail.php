<?php
	use PHPMailer\PHPMailer\PHPMailer;
	use PHPMailer\PHPMailer\Exception;

	require 'phpmailer/src/Exception.php';
	require 'phpmailer/src/PHPMailer.php';

	$mail = new PHPMailer(true);
	$mail->CharSet = 'UTF-8';
	$mail->setLanguage('ru', 'phpmailer/language/');
	$mail->IsHTML(true);

	//От кого письмо
	$mail->setFrom('titokr@gmail.com', 'Сайт ресторана t-zeez');
	//Кому отправить
	$mail->addAddress('titokr@gmail.com');
	//Тема письма
	$mail->Subject = 'Запрос на заказ столика';

	//Тело письма
	$body = '<h1>Требуется столик</h1>';
	
	if(trim(!empty($_POST['name']))){
		$body.='<p><strong>Имя:</strong> '.$_POST['name'].'</p>';
	}
	if(trim(!empty($_POST['email']))){
		$body.='<p><strong>E-mail:</strong> '.$_POST['email'].'</p>';
	}
	if(trim(!empty($_POST['date']))){
		$body.='<p><strong>Дата:</strong> '.$_POST['date'].'</p>';
	}
	if(trim(!empty($_POST['time']))){
		$body.='<p><strong>Время:</strong> '.$_POST['time'].'</p>';
	}	
	if(trim(!empty($_POST['specialRecuest']))){
		$body.='<p><strong>Специальные пожелания:</strong> '.$_POST['specialRecuest'].'</p>';
	}
	
	$mail->Body = $body;

	//Отправляем
	if (!$mail->send()) {
		$message = 'Ошибка отправки данных на почту.';
	} else {
		$message = 'Данные отправлены!';
	}

	$response = ['message' => $message];

	header('Content-type: application/json');
	echo json_encode($response);
?>