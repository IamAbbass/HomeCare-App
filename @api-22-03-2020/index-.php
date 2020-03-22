<?php
    header("Access-Control-Allow-Origin: *");

    error_reporting(0);
    require("connection/config.php");

    $action = $_REQUEST['action'];
    $arr    = array();

    if($action == "signup" || $action == "set_password" || $action == "forget"){

        //signup
        $type     = $_GET['type'];
        $name     = $_GET['name'];
        $phone    = $_GET['phone'];
        $token    = $_GET['token'];
        $password = $_GET['password'];

        if($type == "patient"){
            if($action == "signup"){


                $row = sql($conn, "select count(*) FROM Users where PhoneNo = ? and isActive = ?", array($phone,"1"), "rows");
                if($row[0][0] > 0){
                    $arr['success'] = false;
                    $arr['msg']   = "Phone $phone already exists, please try another phone number!";
                }else{

                    $code = rand(1,9).rand(0,9).rand(0,9).rand(0,9).rand(0,9).rand(0,9);
                    $msg = "$code is the verification code.";
                    //$url = "http://bsms.telecard.com.pk/SMSPortal/Customer/ProcessSMS.aspx?userid=adamjee&pwd=adamjee123&msg=$msg&mobileno=$phone";
                    //$url = "http://developer.zeddevelopers.com/hamza/twilio/twilloSMS/?request=allow_me&n=$phone&m=$msg";
                    $url = "https://pahs.com.pk/app/sms.php?number=$phone&message=$msg&mask=PAHCS";

                    $CSRFToken = md5(uniqid(rand(), true)).md5(uniqid(rand(), true));

                    $unverified_exists = sql($conn, "select count(*) FROM Users where PhoneNo = ? and isActive = ?", array($phone,"0"), "rows");
                    if($unverified_exists[0][0] == 0){
                        $row = sql($conn, "insert into Users (UserName,PhoneNo,LoginID,isActive,CSRFToken,SIMserial,ServiceID) values (?,?,?,?,?,?,?)",
                        array($name,$phone,$phone,"0",$CSRFToken,$code,"1"), "rows");

                        $UserID = $conn->lastInsertId();

                        sql($conn, "insert into PatientMaster (UserID) values (?)", array($UserID), "rows");

                        $PatientID = "M".$conn->lastInsertId();

                        sql($conn, "update PatientMaster set PatientID = ? where UserID = ?", array($PatientID,$UserID), "rows");
                    }else{
                        $row = sql($conn, "update Users set CSRFToken = ?, SIMserial = ? where PhoneNo = ?", array($CSRFToken,$code,$phone), "rows");
                    }

                    $arr['success'] = true;
                    $arr['url']     = $url;
                    $arr['token']   = $CSRFToken;

                    $arr['title']   = "Welcome, $name!";
                    $arr['msg']     = "We have sent you an SMS on $phone with a 6-Digit verification code (OTP) [$code].";

                }
            }else if($action == "set_password"){
                $row = sql($conn, "select count(*) FROM Users where CSRFToken = ? ", array($token), "rows");
                if($row[0][0] == 0){
                    $arr['success'] = false;
                    $arr['msg']     = "Invalid request, no account is linked with that request";
                }else{
                    $row = sql($conn, "update Users set Password = ? where CSRFToken = ?", array($password,$token), "rows");
                    $arr['success'] = true;
                    $arr['token']   = $token;
                    $arr['msg']     = "Password set successfully!";
                }
            }else if($action == "forget"){
                $row = sql($conn, "select count(*) FROM Users where PhoneNo = ? ", array($phone), "rows");
                if($row[0][0] == 0){
                    $arr['success'] = false;
                    $arr['msg']     = "Invalid request, no account is linked with that request";
                }else{
                    $row = sql($conn, "select * from Users where PhoneNo = ?", array($phone), "rows");


                    $code = rand(1,9).rand(0,9).rand(0,9).rand(0,9).rand(0,9).rand(0,9);
                    $msg = "$code is the verification code.";
                    //$url = "http://bsms.telecard.com.pk/SMSPortal/Customer/ProcessSMS.aspx?userid=adamjee&pwd=adamjee123&msg=$msg&mobileno=$phone";
                    //$url = "http://developer.zeddevelopers.com/hamza/twilio/twilloSMS/?request=allow_me&n=$phone&m=$msg";
                    $url = "https://pahs.com.pk/app/sms.php?number=$phone&message=$msg&mask=PAHCS";

                    sql($conn, "update Users set SIMserial = ? where PhoneNo = ?", array($code,$phone), "rows");

                    $arr['success'] = true;
                    $arr['url']     = $url;
                    $arr['token']   = $row[0]['CSRFToken'];

                    $arr['msg']     = "We have sent you an SMS on $phone with a 6-Digit verification code (OTP) [$code].";

                }

            }
        }else if($type == "doctor"){
            $arr['success'] = false;
            $arr['msg']   = "Doctor registration is currently unavailable!";
        }else if($type == "service"){
            $arr['success'] = false;
            $arr['msg']   = "Service registration is currently unavailable!";
        }else{
            $arr['success'] = false;
            $arr['msg']   = "Invalid user type. Please select patient, doctor or service!";
        }
    }
    else if($action == "sms_verify"){
        $token      = $_GET['token'];
        $otp        = $_GET['otp'];

        //echo "select count(*) FROM Users where CSRFToken = '$token' and SimSerial = '$otp'"  ;

        $row = sql($conn, "select count(*) FROM Users where CSRFToken = ? and SimSerial = ?", array($token,$otp), "rows");
        if($row[0][0] > 0){
            $arr['success'] = true;
            $arr['msg']     = "Phone number verified!";
            $arr['token']   = $token;
            $row = sql($conn, "update Users set isActive = ? where CSRFToken = ?", array("1",$token), "rows");

        }else{
            $arr['success'] = false;
            $arr['msg']   = "Invalid OTP Code";
        }
    }
    else if($action == "signin"){
        $phone      = $_GET['phone'];
        $password   = $_GET['password'];

        $row = sql($conn, "select count(*) FROM Users where (PhoneNo = ? or LoginID = ?) and Password = ? ", array($phone,$phone,$password), "rows");
        if($row[0][0] == 0){
            $arr['success'] = false;
            $arr['msg']     = "Invalid login credentials!";
        }else{
            $row = sql($conn, "select * from Users where (PhoneNo = ? or LoginID = ?)", array($phone,$phone), "rows");
            $arr['success'] = true;
            $arr['token']   = $row[0]['CSRFToken'];
            $arr['UserID']  = $row[0]['UserID'];

            if($arr['UserID'] == "2"){
                $arr['UserID']  = 1;
                $arr['type']    = "doctor";
            }else{
                $arr['type'] = "patient";
            }

            $arr['name']    = $row[0]["UserName"];
        }
    }
    else if($action == "speciality"){
        $search = $_GET['search'];
        $token  = $_GET['token'];
        $type   = $_GET['type'];

        if(strlen($search) > 0){
            $row = sql($conn, "select * from TblSpeciality where type = ? and Name like ?", array($type,"%".$search."%"), "rows");
        }else{
            $row = sql($conn, "select * from TblSpeciality where type = ?", array($type,), "rows");
        }

        if(strlen($token) == 0){
            $arr['success'] = false;
            $arr['msg']     = "Missing token in request!";
        }else{
            if(count($row) > 0){
                $arr['success'] = true;
                $arr['count']   = count($row);
                $arr['data']    = $row;
            }else{
                $arr['success'] = false;
                $arr['count']   = count($row);
                $arr['msg']     = "Sorry, no specialities found!";
            }
        }

    }
    else if($action == "doctors"){
        $search = $_GET['search'];
        $s_id   = $_GET['s_id'];
        $token  = $_GET['token'];

        if(strlen($s_id) > 0){
            //$row = sql($conn, "select * from Doctors where SpecialityID = ?", array($s_id), "rows");
            $row = sql($conn, "select * from Doctors where SpecialityID = ?", array($s_id), "rows");
        }else if(strlen($search) > 0){
            $row = sql($conn, "select * from Doctors where DoctorName like ?", array("%".$search."%"), "rows");
        }else{
            //$row = sql($conn, "select * from Doctors", array(), "rows");
        }

        if(strlen($token) == 0){
            $arr['success'] = false;
            $arr['msg']     = "Missing token in request!";
        }else{
            if(count($row) > 0){
                $arr['success'] = true;
                $arr['count']   = count($row);
                $arr['data']    = $row;
            }else{
                $arr['success'] = false;
                $arr['count']   = count($row);
                $arr['msg']     = "Sorry, no doctors found!";
            }
        }
    }
    else if($action == "doctor_schedule"){
        $doc_id = $_GET['doc_id'];
        $token  = $_GET['token'];

        //[pahs_homecare].[user_bizsolpkhomecare].[tbl_doc_schedule_detail]

        if(strlen($doc_id) > 0){
            $row = sql($conn, "select * from tbl_doc_schedule_detail where DoctorID = ?", array($doc_id), "rows");
            $doc_schedule = array();
            $i = 0;

            foreach($row as $r){
                $doc_schedule[$i]['schedule_id']    = $r['doc_schedule_detail_id'];
                $doc_schedule[$i]['day']            = $r['Day'];
                $doc_schedule[$i]['shift']          = $r['Shift'];
                $doc_schedule[$i]['time']           = $r['Time'];
                //$doc_schedule['active']         = $r['Isactive'];
                $i++;
            }

            $row_2 = sql($conn, "select * from Rates where DoctorID = ?", array($doc_id), "rows");
            $doc_rate = array();
            $i = 0;
            foreach($row_2 as $r){
                $doc_rate[$i]['rate_id']        = $r['Doc_rate_id'];
                $doc_rate[$i]['text']           = $r['Description'];
                $doc_rate[$i]['amount']         = $r['Rate'];
                $i++;
            }



        }

        if(strlen($token) == 0){
            $arr['success'] = false;
            $arr['msg']     = "Missing token in request!";
        }else{
            if(count($row) > 0){
                $arr['success'] = true;
                $arr['count']   = count($row);
                $arr['data']    = $doc_schedule;
                $arr['rates']   = $doc_rate;
            }else{
                $arr['success'] = false;
                $arr['count']   = count($row);
                $arr['msg']     = "Doctor schedule is not defined!";
            }
        }
    }
    else if($action == "doctor_availability" || $action == "book_appointment"){



        //sql($conn, "delete from tbl_Appointments_reservation where UserID = ?",