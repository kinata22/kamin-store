<?
$path = "files-all.txt"; // Путь до файла
$filearray = file($path); // считываем текстовый файл в массив
 

foreach ($filearray as $value) {
	$value = trim($value);
	$tmp =explode('/', $value);
	$name = $tmp[count($tmp)-1];
	if(strlen($name) > 5) {
     $res = copy($value, $name);
	 if($res) echo "$name $value - ок <br/>";  else   echo "$name $value - wrong <br/>";
	}
}

echo "123";

/*		$handler = fopen($value, "r");
		if($handler) {
			$handlew = fopen($name, "w");
			$contents = fread($handler, filesize($value));
			fwrite($handlew, $contents);
			fclose($handler);
			fclose($handlew);
*/

?>