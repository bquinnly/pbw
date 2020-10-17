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

var s3 = new AWS.S3({
  apiVersion: "2006-03-01",
  params: { Bucket: bucketName }
});

function addPhoto() {
    s3url = null
    var files = document.getElementById("upload").files;
    if (!files.length) {
      return alert("Please choose a file to upload first.");
    }
    var file = files[0];
    var fileName = Date.now().toString()+ '_' + file.name;
    var albumPhotosKey = encodeURIComponent(uploadfoldername) + "/";
    
    var photoKey = albumPhotosKey + fileName;
  
    // Use S3 ManagedUpload class as it supports multipart uploads
    var upload = new AWS.S3.ManagedUpload({
      params: {
        Bucket: bucketName,
        Key: photoKey,
        Body: file,
        ACL: "public-read"
      }
    });
  
    var promise = upload.promise();
  
    promise.then(
      function(data) {
        alert("Successfully uploaded photo.");
        
        s3url = 'https://'+bucketName+'.s3.'+ bucketRegion+'.amazonaws.com/'+photoKey;
        files = []
        clearFileInput(document.getElementById("upload"));
        console.log(s3url);
        document.getElementById("upload-label").innerHTML = 'Choose image';
        //const { ContentType } = await s3.getObject(params).promise();
        /*$.ajax({
          method: 'POST',
          url: 'https://18.133.189.143:5000/detect',
          data: {"url" : s3url},
          contentType: false,
          processData: false,
      }).done(function(data, textStatus, jqXHR){
        console.log('results!!!');
        console.log(data);
          //$('#result').text(data);
      }).fail(function(data){
          alert('error!');
      }); */

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