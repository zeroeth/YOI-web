$(document).ready (function ()
{
  /* Header Buttons ***************************************** */

  $('.sifter-fetch-top-button').on('click', function()
  {
    $('.filter-button').removeClass('button-active');
    $(event.target).addClass('button-active');

    startSift('top');
  });

  $('.sifter-fetch-recent-button').on('click', function()
  {
    $('.filter-button').removeClass('button-active');
    $(event.target).addClass('button-active');

    startSift('recent');
  });

  $('.sifter-fetch-popular-button').on('click', function()
  {
    $('.filter-button').removeClass('button-active');
    $(event.target).addClass('button-active');

   	startSift('popular');
  });

  $('.sifter-fetch-mine-button').on('click', function()
  {
    var target = event.target;

    controller.loginRequired (function ()
    {
      $('.filter-button').removeClass('button-active');
      $(target).addClass('button-active');
      startSift('mine')
    });
  });


  $('.sifter-show-login-button').on('click', function()
  {
    controller.showLoginView();
  });

  $('.sifter-show-upload-button').on('click', function()
  {
    if(CropHelper.canvas_jpeg_support ())
    {
      controller.loginRequired (function ()
      {
        controller.createNote();
      });
    }
    else { alert("This browser does not support uploading, please try Chrome"); }
  });

  $('.sifter-show-logout-button').on('click', function()
  {
    controller.logout();
  });



  /* Search and Filter change ******************************* */

  $('.sifter-filter-checkbox-input').on('change', function()
  {
    startSift('tags');
  });

  $('.sifter-filter-search-input').on('change', function()
  {
    startSift('search');
  });



  /* Create Note View *************************************** */ 

  /* Document event delegators since view is cloned where
     inline onClick events get cloned with their DOM element */

  /* FIXME Replacing this with a backbone view is ideal */
  $(document).on('change', '#imageFileInput', function()
  {
    handleImageFileSelect(this.files);
  });

  $(document).on('click', '#browseImage', clickBrowseImage);
  $(document).on('click', '#browseAudio', clickBrowseAudio);
  $(document).on('click', '#finishCrop',  function()
  {
    $('.new-dialog').removeClass('shrink');
    $('#crop_box').hide();
    $('#le-canvas').show();
  });

  $(document).on('click', '#le-canvas', function()
  {
    $('.new-dialog').addClass('shrink');
    $('#crop_box').show();
  });

  $(document).on('change', '#audioFileInput', function()
  {
    handleAudioFileSelect(this.files);
  });


  $(document).on('click', '#submitNote', submitNote);
  $(document).on('click', '#cancelNote, #cancelNoteOverlay', cancelNote);



  /* Login View ********************************************* */ 

  $(document).on('click', '#login',          clickLogin);  
  $(document).on('click', '#noAccount',      clickNoAccount);
  $(document).on('click', '#forgotPassword', clickForgotPassword);



  /* Join View ********************************************** */

  $(document).on('click', '#signUp',        clickSignUp);
  $(document).on('click', '#viewLoginPage', clickViewLoginPage);



  /* Forgot View ******************************************** */
  $(document).on('click', '#forgot', clickEmailPassword);


  /* About View ********************************************* */
  $('.show-about').on('click', function()
  {
    controller.showAbout();
  });

  /* Map Center ********************************************* */
  $('.sifter-center-map').on('click', function()
  {
    var bascom_hill = new google.maps.LatLng(43.0753, -89.4041);
    model.views.gmap.setCenter(bascom_hill);
    model.views.gmap.setZoom(14);
  });

});
