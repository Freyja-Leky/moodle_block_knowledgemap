<?php

//require ('../../config.php');

function test($id){
    global $DB;

    return $DB->get_record('course',array('id'=>$id));
}

