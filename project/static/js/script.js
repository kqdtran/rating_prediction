(function() {
  var MAX_SENT = 100;
  var MIN_SENT = 0;
  var TIMEOUT = 20000;

    /* Since sentiment is a value between [-1.0, 1.0], we adjust it by adding 1.0, 
    but then scale down by dividing by two */
    var scaleSentiment = function(score) {
      var scaled = (MAX_SENT - MIN_SENT) * (score - (-1.0)) / (1 - (-1));
      return Math.round(scaled);
    };

    var getSentimentText = function(score) {
      if (score <= -0.70){
        return {text: "Very negative", css: "very-negative"};
      } else if (score <= -0.2){
        return {text: "Negative", css: "negative"};
      } else if (score >= 0.70){
        return {text: "Very positive", css: "very-positive"};
      } else if (score >= 0.2){
        return {text: "Positive", css: "positive"};
      } else{
        return {text: "Neutral", css: "neutral"};
      }
    };

    var getSentimentElement = function(score){
      var data = getSentimentText(score);
      var elem = "<span class='sentiment " + data.css + "'>" +
      data.text +  " (" + scaleSentiment(score) + ")" +
      "</span>";
      return elem;
    };

    var getSubjectivityText = function(score) {
      if (score <= 0.3){
        return {text: "Objective", css: "negative"};
      } else if (score >= 0.7){
        return {text: "Subjective", css: "positive"};
      } else{
        return {text: "Neutral", css: "neutral"};
      }
    };

    var getSubjectivityElement = function(score){
      var data = getSubjectivityText(score);
      var elem = "<span class='sentiment " + data.css + "'>" +
      data.text +  " (" + Math.round(score*100) + "%)" +
      "</span>";
      return elem;
    };

    var errored = function(xml, status, message, $elem){
      if (status === "timeout"){
        $elem.html("Timed out. Try again.");
      } else {
        $elem.html("Something went wrong. Try again.");
      }
      return null;
    };

    var updateValue = function(url, text, $elem, success){
      $.ajax({
        url: url,
        type: "POST",
        timeout: TIMEOUT,
        data: {"text": text},
        dataType: "json",
        success: success,
        error: function(xml, status, message){
          errored(xml, status, message, $elem);
        }
      });
    };

    var updateSentiment = function(text){
      $sentValue = $("#sentimentValue");
      $("#sentencesSentiment").hide();
      updateValue("/sentiment", text, $sentValue, function(res) {
        $sentValue.empty();
        if (!text){
          $sentValue.append("<em>No text.</em>");
        } else {
          $sentValue.append(getSentimentElement(res.result));
        }
      });
    };

    var updateSubjectivity = function(text){
      $subValue = $("#subjectivityValue");
      updateValue("/subjectivity", text, $subValue, function(res) {
        $subValue.empty();
        if (text){
          $subValue.append(getSubjectivityElement(res.result));
        }
      });
    };

    // Click handlers
    $("#analyzeSentiment").on("click", function(e) {
      e.preventDefault();
      var text = $("textarea[name='text']")[0].value;
      updateSentiment(text);
      updateSubjectivity(text);
    });

    /*var toggleSentences = function() {
        var $sentDiv = $("#sentencesSentiment");
        $sentBtn = $("#breakdownBtn");
        if ($sentDiv.is(":visible")){
            $sentDiv.hide();
            $sentBtn.removeClass("active");
        } else{
            var text = $("textarea[name='text']")[0].value;
            $sentDiv.show();
            var $sentTable = $("#sentencesSentiment table");
            var $tbody = $sentTable.children("tbody");
            updateValue("/sentiment/sentences", text, $tbody, function(res) {
                $sentBtn.addClass("active");
                $tbody.empty();
                var sentences = res.result;
                if (sentences.length <= 0){
                    $sentTable.append("No sentences.");
                } else {
                    sentences.forEach(function(elem, index){
                        $tbody.append(  "<tr>" +
                                          "<td>" + elem.sentence + "</td>" +
                                          "<td>" + getSentimentElement(elem.sentiment) + "</td>" +
                                        "</tr>");
                    });
                }
            });
        }
    };

    $("#breakdown").on('click', function(e){
        e.preventDefault();
        toggleSentences();
      });*/
}).call(this);