$(document).ready(function(){

  var $screen = $('#calculator-screen');
  var $result = $('#calculator-result');
  var ws_scheme = window.location.protocol == "https:" ? "wss" : "ws";
  var chatsock = new ReconnectingWebSocket(ws_scheme + '://' + window.location.host + "/chat" + window.location.pathname);
  
  var scroll_bottom = function(){
    var scroll = $('#chat-panel');
    scroll.scrollTop(scroll.prop("scrollHeight"));
  };
  scroll_bottom();
  chatsock.onmessage = function(message) {
      var data = JSON.parse(message.data);
      var chat = $("#chat")
      var ele = $('<tr></tr>')

      ele.append(
          $("<td></td>").text(data.timestamp)
      )
      ele.append(
          $("<td></td>").text(data.handle)
      )
      ele.append(
          $("<td></td>").text(data.message)
      )
      
      chat.append(ele)
      scroll_bottom();
    };
  
  $('#clear').on('click', function() {
    $screen.text('');
    $result.text('');
  });

  $('#equals').on('click', function() {
    var expression = $screen.text();

    if (expression === 'Error') {
      return;
    }
    var total;
    try{
      total = eval(expression); 
    }
    catch(err){
      total = 'Error'
      $screen.text('Error');
      $result.text('Error');
      return;
    }
    $result.text(total.toString());
    scroll_bottom();
    var message = {
            handle: $('#handle').val(),
            message: expression + ' = ' + total.toString(),
    }
    chatsock.send(JSON.stringify(message));
  });

  $('#calc-board').on('click', 'span:not(#clear):not(#equals)', function(event) {
    var screen = $screen.text();
    if (screen === 'Error') {
      return;
    }

    var nextScreen = screen + event.target.textContent;
    $screen.text(nextScreen);
  });
});
