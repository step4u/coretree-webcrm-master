package com.coretree.defaultconfig.service;

import java.net.UnknownHostException;
import java.nio.ByteOrder;
import java.security.Principal;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.TimerTask;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantReadWriteLock;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.messaging.core.MessageSendingOperations;
import org.springframework.messaging.handler.annotation.MessageExceptionHandler;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.messaging.simp.broker.BrokerAvailabilityEvent;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RestController;

import com.coretree.defaultconfig.config.Configurations;
import com.coretree.defaultconfig.mapper.Call;
import com.coretree.defaultconfig.mapper.CallMapper;
import com.coretree.defaultconfig.mapper.Customer;
import com.coretree.defaultconfig.mapper.CustomerMapper;
import com.coretree.defaultconfig.mapper.Member;
import com.coretree.defaultconfig.mapper.MemberMapper;
import com.coretree.defaultconfig.mapper.Sms;
import com.coretree.defaultconfig.mapper.SmsMapper;
import com.coretree.event.HaveGotUcMessageEventArgs;
import com.coretree.event.IEventHandler;
import com.coretree.interfaces.ITelStatusService;
import com.coretree.models.GroupWareData;
import com.coretree.models.SmsData;
import com.coretree.models.UcMessage;
import com.coretree.socket.*;
import com.coretree.util.Const4pbx;

@Service
@RestController
public class TelStatusService implements ApplicationListener<BrokerAvailabilityEvent>, IEventHandler<HaveGotUcMessageEventArgs>, ITelStatusService {
	private static Log logger = LogFactory.getLog(TelStatusService.class);
	private final MessageSendingOperations<String> messagingTemplate;
	private final SimpMessagingTemplate msgTemplate;
	private AtomicBoolean brokerAvailable = new AtomicBoolean();
	
	@Autowired
	public TelStatusService(MessageSendingOperations<String> messagingTemplate, SimpMessagingTemplate msgTemplate) {
		this.messagingTemplate = messagingTemplate;
		this.msgTemplate = msgTemplate;
	}
	
	private UcServer uc;
	
	@Override
	public void onApplicationEvent(BrokerAvailabilityEvent event) {
		this.brokerAvailable.set(event.isBrokerAvailable());
	}
	
	private void InitializeUserState() {
	}
	
	private void sendExtensionStatus() {
		UcMessage msg = new UcMessage();
		msg.cmd = Const4pbx.UC_BUSY_EXT_REQ;
		
		try {
			this.uc.Send(msg);
		} catch (UnknownHostException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
	@MessageMapping("/traders")
	public void executeTrade(UcMessage message, Principal principal) {
	}
	
	@MessageMapping("/openapi")
	public void executeOpenapi(UcMessage message) {
	}
	
	@MessageMapping("/sendmsg")
	public void executeTrade(SmsData message, Principal principal) {
	}
	
	@MessageExceptionHandler
	@SendToUser("/queue/errors")
	public String handleException(Throwable exception) {
		return exception.getMessage();
	}

	@Override
	public void RequestToPbx(UcMessage msg) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void SendSms(SmsData msg) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void eventReceived(Object sender, HaveGotUcMessageEventArgs e) {
		// TODO Auto-generated method stub
		
	}
}