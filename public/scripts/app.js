// Client facing scripts here

//Ensure page is loaded first. Add event handlers in here.
$(function () {


  const getNoEmbed = function (url) {
    let noEmbedUrl = "http://noembed.com/embed?url=";
    if (url) {
      noEmbedUrl += url;
    }
    return $.ajax({
      url: noEmbedUrl,
    });
  };

  //Add new resource button functionality
  $('#urlSubmit').on('click', function () {
    const urlInput = $('#addResURLInput').val();
    console.log(urlInput);

    getNoEmbed(urlInput)
      .then((res) => {
        console.log(res);
      });
  });


});
