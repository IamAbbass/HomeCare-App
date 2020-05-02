<?php
    //$serverName = "sqlserver.example.com";
    //$database = "myDbName";
    //$uid = 'sqlserver_username';
    //$pwd = 'password';
    date_default_timezone_set('Asia/Karachi'); 


    $serverName = "rs1.win.arvixe.com";
    $database = "pahs_homecare";
    $uid = 'pahs_user_homecare';
    $pwd = 'P@kistan1';

	//$serverName = "palm.arvixe.com";
    //$database = "Bizsolhomecare";
    //$uid = 'user_bizsolpkhomecare';
    //$pwd = 'P@kistan1';

    try {
        $conn = new PDO(
            "sqlsrv:server=$serverName;Database=$database",
            $uid,
            $pwd,
            array(
                //PDO::ATTR_PERSISTENT => true,
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
            )
        );
    }
    catch(PDOException $e) {
        die("Error connecting to SQL Server: " . $e->getMessage());
    }


    function sql($DBH, $query, $params, $return) {
		try {
			// Prepare statement
			$STH = $DBH->prepare($query);
			// Execute statement
			$STH->execute($params);
			// Decide whether to return the rows themselves, or just count the rows
			if ($return == "rows") {
				return $STH->fetchAll();
			}
		  	elseif ($return == "count") {
				return $STH->rowCount();
			}
		}
		catch(PDOException $e) {
			file_put_contents('PDOErrors.txt', $e->getMessage(), FILE_APPEND); # Errors Log File
		}
	}

?>
