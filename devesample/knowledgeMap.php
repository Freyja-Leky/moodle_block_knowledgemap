<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
<!--    <meta http-equiv="X-UA-Compatible" content="IE=edge">-->
    <meta name="viewport" content="width=device-width, initial-scale=1">
<!--    <title>Knowledge Map</title>-->

    <!-- Bootstrap -->
    <link rel="stylesheet" href="lib/bootstrap/css/bootstrap.min.css" >
<!--    <link rel="stylesheet" href="lib/bootstrap/css/bootstrap.rtl.css" >-->

    <!-- Bootstrap -->
    <script src="lib/bootstrap/js/bootstrap.bundle.min.js"></script>
    <!-- echarts -->
    <script src="lib/echarts.min.js"></script>
    <!-- Vis -->
    <script src="lib/vis.js"></script>
    <script src="lib/vis-network.min.js"></script>

</head>
<body>
    <div class="container">
        <header class="d-flex align-items-center pb-3 mb-4 pt-5 border-bottom">
            <span class="fs-3 fw-bold" id="pageHeader"></span>
        </header>

        <ul class = "nav nav-tabs mx-3">
            <li class="nav-item">
                <a class="nav-link fw-light" href="#" id = "aCourse">Course</a>
            </li>
            <li class="nav-item">
                <a class="nav-link active fw-light " aria-current="page" href="#">Map</a>
            </li>
        </ul>

        <br />
        <br />

        <div class = "row">

            <div class="col-7">
                <div id="chart" style="width: 100%;height: 600px;border: 1px solid"></div>
            </div>

            <div class="col-4 offset-1" style="height: 600px">

                <br />
                <br />

                <h4>Manage Map by upload files:</h4>

                <div class="input-group">
                    <input type="file" class="form-control" id="mapDataInput">
                    <button class="btn btn-secondary" type="button" id="upload">Upload</button>
                </div>


                <p></p>

                <button class = "btn btn-outline-secondary" id = "download" style="width: 100%" type="button">
                    Download Map Data Here
                </button>

                <br />
                <br />

                <h4>Add Elements:</h4>

                <div class="input-group">
                    <span class="input-group-text">Node</span>
                    <input type="text" maxlength="15" class="form-control" placeholder="Node Name" id="nodeName">
                </div>
                <div class="input-group">
                    <span class="input-group-text">Field&nbsp</span>
                    <input type="text" maxlength="15" class="form-control" placeholder="Field Name" id="fieldName">
                </div>
                <button class="btn btn-secondary" id="addNode" style="width: 100%">Add Node</button>

                <p></p>

                <div class="input-group">
                    <span class="input-group-text"">FROM</span>
                    <select class="form-select" id="fromSelect"></select>
                </div>
                <div class="input-group">
                    <span class="input-group-text">&nbsp&nbspTO&nbsp&nbsp</span>
                    <select class="form-select" id="toSelect"></select>
                </div>
                <button class="btn btn-secondary" id="addEdge" style="width: 100%">Add Edge</button>

            </div>

        </div>
    </div>


<script>

    //set Title
    let shortName = "<?php
        $shortname = $_POST["courseShortName"];
        echo $shortname;
        ?>"

    document.title = shortName;

    //set PageHeader
    let fullName = "<?php
        $fullName = $_POST["courseFullName"];
        echo $fullName;
        ?>"

    let pageHeader = document.getElementById("pageHeader");
    pageHeader.innerHTML = fullName;

    //set Course/Go back
    let url = "<?php
        $url = $_POST["url"];
        echo $url;
        ?>"

    let aCourse = document.getElementById("aCourse");
    aCourse.href = url;

</script>

<?php
require('../../config.php');

$courseID = $_POST["courseID"];

$test = $DB->get_record('course',array('id'=>$courseID));
$shortname = $test->shortname;
$array = json_encode(array('a'=>'1','b'=>'2'));

//echo $array;
?>

</body>
</html>