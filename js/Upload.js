 $(".cancelUploading").hide();
 $(document).ready(function($) {
    $('.tab_content').hide();
    $('.tab_content:first').show();
    $('.tabs li:first').addClass('active');
    $('.tabs li').click(function(event) {
        $('.tabs li').removeClass('active');
        $(this).addClass('active');
        $('.tab_content').hide();

        var selectTab = $(this).find('a').attr("href");

        $(selectTab).fadeIn();
    });
});
//                                                                        $(".calender-box .custom-date-holder span input[type = 'text']").mask("99/99/9999", {placeholder: 'dd/mm/yyyy'});
var theme = parseFloat('12.5');
var del=parseFloat('12.5');
var uploadDocs = [];
var i;
function UploadDocs(flag) {
   // alert($("#messageSpan").html(theme));
    var selectUpload = $("#selectuplaodtype").find('li.active').find("span").text();

    debugger;
    $("#" + flag + "File").click();
    $("#" + flag + "File").unbind("change");
    $("#" + flag + "File").on("change", function() {
        var form_data = new FormData();
        var fileAttr = new Object();
        var fileObj = $("#" + flag + "File").prop("files")[0];
        var filesize = ((fileObj.size / 1024) / 1024).toFixed(4); // MB
        if (filesize <= 10) {
            var filePath = $("#" + flag + "File").val();
            fileAttr.Name = filePath.substring(filePath.lastIndexOf("\\") + 1, filePath.length);
            fileAttr.Extension = filePath.substring(filePath.lastIndexOf("."), filePath.length);
            fileAttr.NameOnly = fileAttr.Name.substring(0, fileAttr.Name.lastIndexOf("."));
            fileAttr.ExtensionOnly = fileAttr.Extension.substring((fileAttr.Extension, fileAttr.Extension.indexOf(".")) + 1);
            // var dt = new Date();
            var ext = fileAttr.ExtensionOnly;
            if (ext === "pdf" || ext === "jpg" || ext === "jpeg" || ext === "tiff" || ext === "tif" || ext === "png" || ext === "doc" || ext === "docx" || ext === "odt" || ext === "ods" || ext === "txt") {
//                        var fileName = flag + "DOC" + "__" + dt.getHours() + "_" + dt.getMinutes() + "_" + dt.getSeconds() + fileAttr.Extension;
                form_data.append("pinstid",lopData.PINSTID);
                form_data.append("fileName", fileAttr.Name);
                form_data.append("doctype", flag + "DOC");
                form_data.append("applicationId", lopData.APPID);
                console.log(form_data);
                form_data.append("docExtension", fileAttr.ExtensionOnly);
                form_data.append("fileSize", filesize);
                form_data.append("file", fileObj);
//                            form_data.append("fileTime", dt.getDate() + "-" + (dt.getMonth() + 1) + "-" + dt.getFullYear() + "  " + dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds());
                console.log(form_data);
                debugger;
                $.ajax({
                    url: "/asset-portal/UploadDocs",
                    dataType: 'script',
                    cache: false,
                    contentType: false,
                    processData: false,
                    type: 'post',
                    data: form_data,
                    success: function(response) {
                        debugger;
                        if (response !== 'null') {
                                                     
                              individualprogressbar(flag,fileAttr.Name);
                            
                            if (uploadDocs.length > 0) {
                                    if (uploadDocs.indexOf(selectUpload) == -1) {
                                       uploadDocs.push(selectUpload);
                                       theme = progeressbar(theme);
                                      
                                    }
                                    else {
                                        console.log("uploadDocs.indexOf(selectUpload)" +uploadDocs.indexOf(selectUpload));
                                    }
                            }
                            
                            else {
                                uploadDocs.push(selectUpload);
                                theme = progeressbar(theme);
                            }
                              alert("File uploaded successfully.");   
                            // $("#email").val(theme+10);
                            //  alert( "Emsailnfgjfn" +document.getElementById("email").value);
                            $("#" + flag + "DOCName").html("     <b>" + fileAttr.Name + "</b>   ");

                  
                        }
                    },
                    error: function() {
                        alert("Some Error while Uploading File.");
                    }
                });
            } else {
                alert("This file type is not allowed. Kindly upload correct file.");
            }
        } else {
            alert("Please upload files of size upto 10MB.");
        }
    });


}
function progeressbar(theme) {
    debugger;
    if (parseFloat(theme) === parseFloat(theme)) {       
        $("#upload").progressbar({
            value: parseFloat(theme)
                    });
                 
        $("#upload").progressbar('disable');
        ($("#messageSpan").html(theme))
        var message = jQuery("#theme").val();
        jQuery("#messageSpan").text(message).append("%");
        
        return theme + 12.5;
    }
} 

function progeressbardelete(del) {
    debugger;
           alert("loop"+del);
        $("#upload").progressbar({
            value:  parseFloat(del) - 12.5
                    });
                 
        $("#upload").progressbar('disable');
//        ($("#messageSpan").html(del))
        var message = parseFloat(del) - 12.5;
        $("#messageSpan").text(message).append("%");
        alert("loop:::"+del- 12.5);
    if(theme<=0){
        theme=parseFloat(del) - 12.5;
//        return 0.0;
    }
    else{
        theme=parseFloat(del) - 12.5;
    }
        //var t= theme1 - 12.5;
//        return  parseFloat(del) - 12.5;

} 
function individualprogressbar(flag,name){
   $("#"+flag).parent("div").parent("div").next().find("div").children("div").children("div").children("div").children("div").children("div").closest("div.cancelUploading").show();
  
    $("#"+flag).parent("div").parent("div").next().find("div").children("div").children("div").children("div").children("div").children("div").animate({ width: "200%" }, 'slow');
   //    $("#"+flag).closest("div.documents-list").find("div.progress-bar").slice(0, 1).css("width","100%");                                                                        				                                                                                                                                                                
       $("#"+flag).parent("div").parent("div").next().find("div").find("div").first().append('<div class="clearfix row" ><span><a  href="javascript:void(0)">'+name+'</a></span><a class="deleteIcon" onclick="imagedelete(this);"><strong><img src="resources/images/delete.png" alt="deleteImg"></strong></a></div>');
    setTimeout(function(){$("#"+flag).parent("div").parent("div").next().find("div").children("div").children("div").children("div").children("div").children("div").closest("div.cancelUploading").hide();},1000)        
}
function imagedelete(event){
$(event).closest("div").remove();
alert(del);
alert(theme);

      progeressbardelete(theme-del);
}
function deleteprogress(id){
    debugger;
    $("#"+id).hide();
}
function showModell() {
                                            $("#model-bkg").show();
                                            $("#model").show();
                                            $("#model-success").show();
                                        }

                                        function closeModel() {
                                            $("#model-bkg").hide();
                                            $("#model").hide();
                                            window.location.replace("https://www.icicibank.com/");
                                        }
