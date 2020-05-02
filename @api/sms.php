<?php
  header("Access-Control-Allow-Origin: *");

    ini_set("soap.wsdl_cache_enabled", 0);

    $number   = $_GET['number'];
    $message  = $_GET['message'];
    $mask     = $_GET['mask'];

    if(strlen($number) == 0){
      die("Number is required");
    }else if(strlen($message) == 0){
      die("Message is required");
    }
    $date = date("m/d/Y h:i:s a",strtotime(date("m/d/Y h:i:s a"))-86400);

    if($mask == ""){
      $mask = "PAHCS";
    }

    $url         = 'http://cbs.zong.com.pk/ReachCWSv2/CorporateSmsV2.svc?wsdl';
    $client     = new SoapClient($url, array("trace" => 1, "exception" => 0));

    $resultBulkSMS = $client->BulkSmsv2(
                    array('objBulkSms' =>
                array(	'LoginId'=>  '923152643530', //here type your account name
                        'LoginPassword'=>'Zong@123', //here type your password
                        'Mask'=>$mask, //PAHCS //here set allowed mask against your account or you will get invalid mask
    										'Message'=>$message, //Welcome to PakPAK AMerican Home Care
    										'UniCode'=>'0',
    										'CampaignName'=>uniqid(), // Any random name or type uniqid() to generate random number, you can also specify campaign name here if want to send no to any existing campaign, numberCSV parameter will be ignored
    										'CampaignDate'=> $date, //07/24/2019 12:35:00 pm // data from where sms will start sending, if not sure type current date in m/d/y hh:mm:ss tt format.
    										'ShortCodePrefered'=>'n',
    										'NumberCsv'=> $number //923452099067
    									)));
    echo "<pre>";
    echo "<br>REQUEST:\n" . htmlentities($client->__getLastRequest()) . "\n";
    print_r($resultBulkSMS);
?>
