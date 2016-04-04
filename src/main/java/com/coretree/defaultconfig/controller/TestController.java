package com.coretree.defaultconfig.controller;

import java.security.Principal;
import java.util.List;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.Message;
import org.springframework.messaging.handler.annotation.MessageExceptionHandler;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.messaging.simp.annotation.SubscribeMapping;
import org.springframework.stereotype.Controller;
import org.springframework.ui.context.Theme;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.coretree.defaultconfig.mapper.Member;
import com.coretree.defaultconfig.mapper.MemberMapper;
import com.coretree.defaultconfig.model.ChatMessage;
import com.coretree.defaultconfig.model.LoginResult;
import com.coretree.interfaces.ITelStatusService;
import com.coretree.models.UcMessage;

// @Controller
public class TestController {
	
	private static final Log logger = LogFactory.getLog(TestController.class);
	private SimpMessagingTemplate template;
	private ITelStatusService ucservice;
	
	@Autowired
	public TestController(SimpMessagingTemplate template, ITelStatusService ucservice) {
		this.template = template;
		this.ucservice = ucservice;
	}

//	@SubscribeMapping("/groupware")
//	public String getPositions() throws Exception {
////		logger.debug("TestController Positions for " + principal.getName());
////		System.err.println("TestController Positions for " + principal.getName());
//		logger.debug("TestController Positions for ");
//		System.err.println("TestController Positions for ");
//		return "success";
//	}

	// @MessageMapping("/traders")
	public void executeTrade(UcMessage message, Principal principal) {
		// logger.debug(String.format("TestController Trade: cmd:%d, extension:%s, peer:%s, status:%d" + message.cmd, message.extension, message.peer, message.status));
		// System.err.println(String.format("TestController Trade: cmd:%d, extension:%s, peer:%s, status:%d" + message.cmd, message.extension, message.peer, message.status));
		
		ucservice.RequestToPbx(message);
		
		
//		Principal principal = message.getHeaders().get(SimpMessageHeaderAccessor.USER_HEADER, Principal.class);
//	    String authedSender = principal.getName();
//	    chatMessage.setSender(authedSender);
//	    String recipient = chatMessage.getRecipient();
//	    if (!authedSender.equals(recipient)) {
//	      template.convertAndSendToUser(authedSender, "/queue/messages", chatMessage);
//	    }
//	    
//	    template.convertAndSendToUser(recipient, "/queue/messages", chatMessage);
	}

	
	private int count = 0;
	//@MessageExceptionHandler
	//@SendToUser("/queue/errors")
	public String handleException(Throwable exception) {
		count++;
		System.err.println(String.format("handleException : %d, message : %s", count, exception.getMessage()));
		return exception.getMessage();
	}
}
