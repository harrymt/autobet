<?php

// Where the php.ini file is being read from
// echo phpinfo();
// Error reporting
ini_set('display_startup_errors', 1);
ini_set('display_errors', 1);
error_reporting(-1);
date_default_timezone_set("UTC");
echo "UTC: " . time() . '<br>';

// Build the header, the content-type can also be application/json if needed
$header[] = 'Content-length: 0';
$header[] = 'Content-type: application/json';
$header[] = 'Authorization: Basic ' . base64_encode("HM750432:gxI@99VliM");

// Get cURL resource
$curl = curl_init();

// Set some options - we are passing in a useragent too here
curl_setopt_array($curl, array(
    CURLOPT_URL => 'https://api.pinnaclesports.com/v1/feed?sportid=29',
    // CURLOPT_RETURNTRANSFER => 1,
    CURLOPT_SSL_VERIFYPEER => 0,
    CURLOPT_HTTPHEADER => $header,
    CURLOPT_CUSTOMREQUEST => 'GET'
));
echo file_get_contents('https://api.pinnaclesports.com/v1/feed?sportid=29');

echo '<br>Curl : ' . var_dump($curl) . '<br>';

// This fetches the initial feed result. Next we will fetch the update using the fdTime value and the last URL parameter
$resp = curl_exec($curl);

if(!curl_exec($curl)){
    echo 'Error: "' . curl_error($curl) . '" - Code: ' . curl_errno($curl) . '<br>';
}

echo 'resp : ';
echo var_dump($resp);

// Close request to clear up some resources
curl_close($curl);

// You need to pick an XML library that is suitable for you, in this case I am using the built-in simple XML feature of PHP.
//$xmlDocument = simplexml_load_string($resp);
// echo $xmlDocument;

?>
