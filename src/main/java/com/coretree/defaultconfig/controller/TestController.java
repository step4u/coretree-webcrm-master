package com.coretree.defaultconfig.controller;

import java.security.Principal;
import java.util.List;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageExceptionHandler;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.messaging.simp.annotation.SubscribeMapping;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.coretree.defaultconfig.mapper.Member;
import com.coretree.defaultconfig.mapper.MemberMapper;
import com.coretree.defaultconfig.model.LoginResult;

@Controller
public class TestController {
	
	private static final Log logger = LogFactory.getLog(TestController.class);

	public TestController() {
	}

	@SubscribeMapping("/positions")
	public String getPositions() throws Exception {
//		logger.debug("TestController Positions for " + principal.getName());
//		System.err.println("TestController Positions for " + principal.getName());
		logger.debug("TestController Positions for ");
		System.err.println("TestController Positions for ");
		return "success";
	}

	@MessageMapping("/traders")
	public void executeTrade(String trade, Principal principal) {
		logger.debug("TestController Trade: " + trade);
		System.err.println("TestController Trade: " + trade);
	}

	
	private int count = 0;
	@MessageExceptionHandler
	@SendToUser("/queue/errors")
	public String handleException(Throwable exception) {
		count++;
		System.err.println("handleException : " + count);
		return exception.getMessage();
	}
	
}
