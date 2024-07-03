$(document).ready(function () {
  $(".delete-Form ").on("submit", function (e) {
    var email = $('input[name="email"]').val();
    var password = $('input[name="password"]').val();
    if (email && password) {
      var confirmed = confirm("Are you sure you want to delete this user?");
      if (!confirmed) {
        e.preventDefault();
      }
    }
  });
});
