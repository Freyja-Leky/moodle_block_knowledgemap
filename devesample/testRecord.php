<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Knowledge Map</title>
</head>
<body>

<?php
//require('../../config.php');
//    require_once($CFG->libdir . '/tablelib.php');
//    $mform = new report_form();
//    $ff = $mform->get_data();
//    $t = $ff->group;
//    echo $t;
//    $group = $_POST["group"];
//    echo $group;

$courseID = $_POST["courseID"];
echo $courseID;
//    $test = "<script>document.write(mapData);</script>";
//    echo $test;
$test = $DB->get_record('course',array('id'=>$courseID));
$shortname = $test->shortname;
echo $shortname;
$array = json_encode(array('a'=>'1','b'=>'2'));
echo $array;




//?>

<script>
    console.log("Hello World");

    function getQueryVariable(variable)
    {
        var query = decodeURI(window.location.search.substring(1));
        var vars = query.split("&");
        for (var i=0;i<vars.length;i++) {
            var pair = vars[i].split("=");
            if(pair[0] == variable){return pair[1];}
        }
        return(false);
    }

    // let form = document.getElementById("testform");
    // let formData = new FormData(form);
    // console.log(formData);

    // console.log(getQueryVariable("url"));
    // let f = new FormData(form);
    // let g = f.get('group');
    // console.log(g);

    let mapData = "<?php
        $mapData = $_POST["mapData"];
        $mapData = json_decode($mapData);
        //        $test = file_get_contents("php://input");
        //        $json = json_decode($test);
        //
        //        echo $json->{'a'};
        echo $mapData;
        ?>"
    console.log(mapData);

    let url = "<?php
        $url = $_POST["url"];
        echo $url;
        ?>"
    console.log(url);

    let shortname = "<?php
        echo $shortname;
        ?>"

    console.log(shortname);

    let ab = <?php
        echo $array;
        ?>

        console.log(ab);

    let fruits = ['Apple', 'Banana'];
</script>

<button type = "button" onclick="window.location.href = url">
    Click Me!
</button>

<?php
echo "<script>document.writeln(fruits);</script>";
?>


</body>
</html>