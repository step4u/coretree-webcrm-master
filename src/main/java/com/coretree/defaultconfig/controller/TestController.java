package com.coretree.defaultconfig.controller;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.security.Principal;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.tomcat.util.http.fileupload.IOUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.coretree.crypto.CryptoAES;
import com.coretree.exceptions.CryptoException;
import com.coretree.interfaces.ITelStatusService;
import com.coretree.models.UcMessage;

// @Controller
@RestController
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
		
		// ucservice.RequestToPbx(message);
		
		
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
	
	
	@RequestMapping(path="/getstream/{filename}", method=RequestMethod.GET)
	public byte[] getStream(@PathVariable("filename") String fn, Principal principal) {
		String filename = "d:///dev/test/" + fn + ".wav";
		File file = new File(filename);
		InputStream in = null;
		try {
			in = new FileInputStream(file);
		} catch (FileNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		byte[] out = new byte[(int)file.length()];
		try {
			IOUtils.read(in, out, 0, out.length);
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return out;
	}
	
	@RequestMapping(path="/getstream2/{filename}", method=RequestMethod.GET)
	public byte[] getStream2(@PathVariable("filename") String fn) throws CryptoException {
		String filename = "d:///dev/test/" + fn + ".encrypted";
		File file = new File(filename);
		String key = "Mary has one cat";
		byte[] out = CryptoAES.decrypt(key, file);
		
		return out;
	}
}
