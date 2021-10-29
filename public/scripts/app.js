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
        let resource = {
          resource_url: res.url,
          title: res.title,
          description: res.description,
          photo_url: res.thumbnail_url,
        };
        console.log(resource);
        return resource;
      })
      .then((resource) => {
        window.location.replace(`/resources/new?title=${resource.title}&photoUrl=${resource.photo_url}&resourceUrl=${resource.resource_url}&description=${resource.description}`);
      })
      .catch((err) => {
        console.log(err.message);
      });
  });

  //Resource view like toggle
  $('#likeHeartButton').on('click', function () {
    console.log("liked/unliked");
    console.log($(this).attr('value'));
    const resourceAndUserIds = $(this).attr('value');

    // $.post({'/update/:resourceId',
    // data: { resource_id: resourceAndUserIds[0], user_id: resourceAndUserIds[1] },
    //     dataType: "JSON",
    //     success: function (data) { alert("success"); },
    //     error: function (err) { }

  });

  //change event for view only resource rating
  $('#my-resource-rating').on('change', function (event) {
    console.log($('#my-resource-rating').val());
    event.preventDefault();
  });

});
