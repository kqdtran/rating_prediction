(function() {
  var TIMEOUT = 20000;
  var loadingImg = '<img id="loadingImage" src="/static/img/ajax-loader.gif" />';

    var getText = function(score) {
      if (score == 1) {
        return "&#9733;&#9734;&#9734;&#9734;&#9734;";
      } else if (score == 2) {
        return "&#9733;&#9733;&#9734;&#9734;&#9734;";
      } else if (score == 3) {
        return "&#9733;&#9733;&#9733;&#9734;&#9734;";
      } else if (score == 4) {
        return "&#9733;&#9733;&#9733;&#9733;&#9734;";
      } else if (score == 5) {
        return "&#9733;&#9733;&#9733;&#9733;&#9733;";
      } else {
        return "Sorry, something went wrong.";
      }
    };

    var getStar = function(score) {
      var data = getText(score);
      var elem = "<span class='big-star'>" + data + "</span>";
      return elem;
    };

    var errored = function(xml, status, message, $elem) {
      if (status === "timeout") {
        $elem.html("Timed out. Try again.");
      } else {
        $elem.html("Something went wrong. Try again.");
      }
      return null;
    };

    var updateValue = function(url, text, $elem, success) {
      $elem.append(loadingImg);
      $.ajax({
        url: url,
        type: "POST",
        timeout: TIMEOUT,
        data: {"text": text},
        dataType: "json",
        success: success,
        error: function(xml, status, message) {
          errored(xml, status, message, $elem);
        }
      });
    };

    var updateStar = function(text) {
      $sentValue = $("#starRating");
      text = text.trim();  // trim whitespace

      updateValue("/classify", text, $sentValue, function(res) {
        $sentValue.empty();
        if (!text) {
          $sentValue.append("<em>No review :(</em>");
        } else {
          $sentValue.append(getStar(res.result));
        }
      });
    };

    // Click handlers
    $("#analyzeStar").on("click", function(e) {
      e.preventDefault();
      var text = $("textarea[name='text']")[0].value;
      updateStar(text);
    });
}).call(this);