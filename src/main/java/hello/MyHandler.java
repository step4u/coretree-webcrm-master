package hello;

import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.WebSocketMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

public class MyHandler implements WebSocketHandler {

	@Override
	public void afterConnectionClosed(WebSocketSession arg0, CloseStatus arg1) throws Exception {
		// TODO Auto-generated method stub
		System.out.println("afterConnectionClosed");
	}

	@Override
	public void afterConnectionEstablished(WebSocketSession arg0) throws Exception {
		// TODO Auto-generated method stub
		System.out.println("afterConnectionEstablished");
	}

	@Override
	public void handleMessage(WebSocketSession arg0, WebSocketMessage<?> arg1) throws Exception {
		// TODO Auto-generated method stub
		System.out.println("handleMessage");
	}

	@Override
	public void handleTransportError(WebSocketSession arg0, Throwable arg1) throws Exception {
		// TODO Auto-generated method stub
		System.out.println("handleTransportError");
	}

	@Override
	public boolean supportsPartialMessages() {
		// TODO Auto-generated method stub
		System.out.println("supportsPartialMessages");
		return false;
	}
	
}
