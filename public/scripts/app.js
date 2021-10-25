// Client facing scripts here

//Ensure page is loaded first. Add event handlers in here.
$(function () {

  //API call to iframely
  const getiFramely = function (url) {
    let frameUrl = 'https://iframe.ly/api/oembed?url=';
    if (url) {
      frameUrl += url;
      frameUrl += '&api_key=bd8442cc8e3c1361c9b41e';
    }
    return $.ajax({
      url: frameUrl,
      dataType: "json"
    });
  };

  //Add new resource button functionality to populate resource page with iframely
  $('#urlSubmit').on('click', function (submitURL) {
    submitURL.preventDefault();
    console.log("click");
    const urlInput = $('#addResURLInput').val();
    console.log(urlInput);

    getiFramely(urlInput)
      .then((res) => {
        console.log(res);
        let urlObj = {
          resourceUrl: res.url,
          title: res.title,
          description: res.description,
          photoUrl: res.thumbnail_url,
        };
        console.log(urlObj);
        return urlObj;
      })
      .then((urlObj) => {
        window.location.replace(`/resources/new?title=${urlObj.title}&photoUrl=${urlObj.photoUrl}&resourceUrl=${urlObj.resourceUrl}&description=${urlObj.description}`);
      })
      .catch((err) => {
        console.log(err.message);
      });
  });

  //Resource view like toggle
  $('#likeHeartButton').on('click', function () {
    console.log("liked/unliked");
  });

  //change event for view only resource rating
  $('#my-resource-rating').on('change', function () {
    console.log($('#my-resource-rating').val());
  });

});
