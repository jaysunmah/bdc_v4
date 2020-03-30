export const selectItem = (item) => {
  return (dispatch) => {
    dispatch({ type: "SELECT_ITEM", item });
  }
};

export const checkIsPrime = num => {
  return (dispatch) => {
    let chatSocket = new WebSocket("ws://" + window.location.host + "/ws/chat/bdc/");

    chatSocket.onmessage = function(e) {
      const { message, status }= JSON.parse(e.data);

      console.log("received data: " + message);
      dispatch({ type: 'IS_PRIME_UPDATE', status: message })
      if (status === 'done') {
        chatSocket.close();
      }
    };

    chatSocket.onclose = function(e) {
      console.error('Chat socket closed unexpectedly');
    };

    chatSocket.onopen = (e) => {
      chatSocket.send(JSON.stringify({
        'message': 'start_is_prime',
        'num': num
      }))
    }

  }
}