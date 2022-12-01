let btn = $("#test");

btn.click(function () {
    let table = [
        {"name":111,"category":222},
        {"name":"微分","category":"微分"}
    ];

    let data = "node=" + JSON.stringify(table);

    console.log(data);

    $.ajax({
        type: "post",
        url: "../test/dbtest.php?query=111",
        async:false,
        data: data,
        // contentType: "application/json; charset=utf-8",
        // dataType: "json",
        success: function (data) {
            console.log(data);
        }
    });

})


