function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $('#imageResult')
                .attr('src', e.target.result);
        };
        reader.readAsDataURL(input.files[0]);
    }
}

$(function () {
    $('#upload').on('change', function () {
        readURL(input);
    });
});

/*  ==========================================
    SHOW UPLOADED IMAGE NAME
* ========================================== */
var input = document.getElementById( 'upload' );
var infoArea = document.getElementById( 'upload-label' );

input.addEventListener( 'change', showFileName );
function showFileName( event ) {
  var input = event.srcElement;
  var fileName = input.files[0].name;
  infoArea.textContent = 'File name: ' + fileName;
}

/*=====
pbwappimages
arn:aws:s3:::animamundiappimages
*/

var detectionbucket = "animamundiappimages"
var bucketName = "pbwappimages";
var uploadfoldername = "uploaded"
var downloadfoldername = "detections"
var bucketRegion = "eu-west-2";
var IdentityPoolId = "eu-west-2:827977d6-6704-4ebf-8854-54526f23cb0b";

// Initialize the Amazon Cognito credentials provider
AWS.config.region = 'eu-west-2'; // Region
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: 'eu-west-2:827977d6-6704-4ebf-8854-54526f23cb0b',
});

function addPhoto() {
    s3url = null
    var files = document.getElementById("upload").files;
    if (!files.length) {
      return alert("Please choose a file to upload first.");
    }
    var file = files[0];
    var fileName = Date.now().toString()+ '_' + file.name;
    var uploadphotoKey = encodeURIComponent(uploadfoldername) + "/" + fileName;
    var downloadphotoKey = encodeURIComponent(downloadfoldername) + "/" + fileName;
    
  
    // Use S3 ManagedUpload class as it supports multipart uploads
    var upload = new AWS.S3.ManagedUpload({
      params: {
        Bucket: bucketName,
        Key: uploadphotoKey,
        Body: file,
        ACL: "public-read"
      }
    });
    
    var downloadparams = { Bucket: detectionbucket, Key: downloadphotoKey};
  
    var promise = upload.promise();
    promise.then(
      function(data) {
        alert("Successfully uploaded photo.");
        //get ready for download
        var download = new AWS.S3({
          apiVersion: "2006-03-01"
        });

        s3url = 'https://'+bucketName+'.s3.'+ bucketRegion+'.amazonaws.com/'+photoKey;
        //console.log(s3url);
        files = []
        clearFileInput(document.getElementById("upload"));
        document.getElementById("upload-label").innerHTML = 'Choose image';
        upload_response = await download.getObject(downloadparams).promise();
        upload_response.then(
          function(data){
            console.log(data)
          },
          function(down_err){
            console.log(down_err)
          }
        );

      },
      function(err) {
        console.log(err);
        return alert("There was an error uploading your photo: ", err.message);
      }
    );
  }


  function clearFileInput(ctrl) {
    try {
      ctrl.value = null;
    } catch(ex) { }
    if (ctrl.value) {
      ctrl.parentNode.replaceChild(ctrl.cloneNode(true), ctrl);
    }
  }