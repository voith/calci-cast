$(document).ready(function(){

  var $screen = $('#calculator-screen');
  var $result = $('#calculator-result');
  var ws_scheme = window.location.protocol == "https:" ? "wss" : "ws";
  var chatsock = new ReconnectingWebSocket(ws_scheme + '://' + window.location.host + "/chat" + window.location.pathname);
  var scrollBottom = function(){
    var scroll = $('#chat-panel');
    scroll.scrollTop(scroll.prop("scrollHeight"));
  };
  
  scrollBottom();
  
  chatsock.onmessage = function(message) {
      var data = JSON.parse(message.data);
      var chat = $("#chat");
      var ele = $('<tr></tr>');
      var logCount;

      ele.append(
          $("<td></td>").text(data.timestamp)
      );
      ele.append(
          $("<td></td>").text(data.handle)
      );
      ele.append(
          $("<td></td>").text(data.message)
      );
      
      chat.append(ele);
      
      logCount = chat.find('tr').length;
      if(logCount >= 10){
        chat.find('tr').first().remove();
      }

      scrollBottom();
    };
  
  $('#clear').on('click', function() {
    $screen.val('');
    $result.val('');
  });

  $('#equals').on('click', function() {
    var expression = $screen.val();
    var total;

    if (expression === 'Error' || !expression) {
      return;
    }
    
    try{
      total = eval(expression); 
    }
    catch(err){
      total = 'Error'
      $screen.val('Error');
      $result.val('Error');
      return;
    }
    
    $result.val(total.toString());
    scrollBottom();
    $screen.val('');
    var message = {
            handle: $('#handle').val(),
            message: expression + ' = ' + total.toString(),
    }
    chatsock.send(JSON.stringify(message));
  });

  $('#calc-board').on('click', 'span:not(#clear):not(#equals)', function(event) {
    var screen = $screen.val();
    if (screen === 'Error') {
      return;
    }

    var nextScreen = screen + event.target.textContent;
    $screen.val(nextScreen);
  });
});
