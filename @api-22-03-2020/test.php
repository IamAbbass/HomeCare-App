<html>
  <head>
    <title>Untitled</title>
  </head>
  <body>
<?php
$serverName = "pahs.com.pk"; //serverName\instanceName
$connectionInfo = array( "Database"=>"pahs_homecare", "UID"=>"pahs_user_homecare", "PWD"=>"P@kistan1");
$conn = sqlsrv_connect( $serverName, $connectionInfo);

if( $conn ) {
     echo "Connection established.<br />";
}else{
     echo "Connection could not be established.<br />";
     die( print_r( sqlsrv_errors(), true));
}
?>
  </body>
</html>
