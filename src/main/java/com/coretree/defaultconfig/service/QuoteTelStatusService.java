package com.coretree.defaultconfig.service;

import java.net.UnknownHostException;
import java.nio.ByteOrder;
import java.security.Principal;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicBoolean;

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
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RestController;

import com.coretree.defaultconfig.domain.QuoteTelStatus;
import com.coretree.defaultconfig.domain.QuoteTelStatus.TelStatus;
import com.coretree.defaultconfig.mapper.MemberMapper;
import com.coretree.event.HaveGotUcMessageEventArgs;
import com.coretree.event.IEventHandler;
import com.coretree.interfaces.IQuoteTelStatusService;
import com.coretree.models.GroupWareData;
import com.coretree.models.UcMessage;
import com.coretree.socket.*;
import com.coretree.util.Const4pbx;

@Service
@RestController
public class QuoteTelStatusService implements ApplicationListener<BrokerAvailabilityEvent>, IEventHandler<HaveGotUcMessageEventArgs>, IQuoteTelStatusService {
	private static Log logger = LogFactory.getLog(QuoteTelStatusService.class);
	private final MessageSendingOperations<String> messagingTemplate;
	private final SimpMessagingTemplate msgTemplate;
	private AtomicBoolean brokerAvailable = new AtomicBoolean();
	private final StockQuoteGenerator quoteGenerator = new StockQuoteGenerator();

	@Autowired
	private MemberMapper member;

	@Autowired
	public QuoteTelStatusService(MessageSendingOperations<String> messagingTemplate, SimpMessagingTemplate msgTemplate) {
		this.messagingTemplate = messagingTemplate;
		this.msgTemplate = msgTemplate;
	}
	
	private UcServer uc;
	
	@Override
	public void onApplicationEvent(BrokerAvailabilityEvent event) {
		// TODO Auto-generated method stub
		this.brokerAvailable.set(event.isBrokerAvailable());
		
		uc = new UcServer("14.63.166.98", 31001, 1, ByteOrder.BIG_ENDIAN);
		uc.HaveGotUcMessageEventHandler.addEventHandler(this);
		uc.regist();
	}
	
	// sample
	@Scheduled(fixedDelay=2000)
	public void sendQuotes() {
		for (QuoteTelStatus quote : this.quoteGenerator.generateQuotes()) {
			if (logger.isTraceEnabled()) {
				logger.trace("Sending quote " + quote);
			}
			if (this.brokerAvailable.get()) {
				this.messagingTemplate.convertAndSend("/topic/tel.status." + quote.getTicker(), quote);
			}
		}
	}
	
	// test 5초마다 갱신
	@Scheduled(fixedDelay=5000)
	public void sendCallStatus() {
		for (QuoteTelStatus quote : this.quoteGenerator.generateQuotes()) {
			if (logger.isTraceEnabled()) {
				logger.trace("Sending quote " + quote);
			}
			if (this.brokerAvailable.get()) {
				this.msgTemplate.convertAndSendToUser("test", "/topic/callstatus", "{'action':'dodododo'}");
			}
		}
	}
	
	// subscribe extension status, refresh on every 2 seconds.
	@Scheduled(fixedDelay=5000)
	public void sendExtensionStatus() {
//		UcMessage msg = new UcMessage();
//		msg.cmd = Const4pbx.UC_BUSY_EXT_REQ;
//		
//		try {
//			this.uc.Send(msg);
//		} catch (UnknownHostException e) {
//			// TODO Auto-generated catch block
//			e.printStackTrace();
//		}
	}
	
	// subscribe system informations, refresh on every 2 seconds.
	@Scheduled(fixedDelay=60000)
	public void sendSystemInformations() {

		
		
		if (this.brokerAvailable.get()) {
			//this.messagingTemplate.convertAndSend("/topic/ext.status." + quote.getTicker(), quote);
		}
	}
	
	private static class StockQuoteGenerator {
		private final Map<String, TelStatus> innertels = new ConcurrentHashMap<>();

		public StockQuoteGenerator() {
			
			this.innertels.put("8001", TelStatus.Busy);
			this.innertels.put("8002", TelStatus.Busy);
			this.innertels.put("8003", TelStatus.Normal);
			this.innertels.put("8004", TelStatus.None);
			this.innertels.put("8005", TelStatus.Normal);
			this.innertels.put("8006", TelStatus.None);
			this.innertels.put("8007", TelStatus.Busy);
		}

		public Set<QuoteTelStatus> generateQuotes() {
			Set<QuoteTelStatus> quotes = new HashSet<>();
			for (String ticker : this.innertels.keySet()) {
				TelStatus status = getRandumStatus(ticker);
				quotes.add(new QuoteTelStatus(ticker, status));
			}
			return quotes;
		}

		private TelStatus getRandumStatus(String ticker) {
			return TelStatus.randomLetter();
		}
	}
	
	public void sendQuotes2() {
		for (QuoteTelStatus quote : this.quoteGenerator.generateQuotes()) {
			if (logger.isTraceEnabled()) {
				logger.trace("Sending quote " + quote);
			}
			if (this.brokerAvailable.get()) {
				this.messagingTemplate.convertAndSend("/topic/tel.status." + quote.getTicker(), quote);
			}
		}
	}

	@MessageMapping("/traders")
	public void executeTrade(UcMessage message, Principal principal) {
		this.RequestToPbx(message);
	}
	
	@MessageExceptionHandler
	@SendToUser("/queue/errors")
	public String handleException(Throwable exception) {
		//System.err.println(String.format("handleException : message : %s", exception.getMessage()));
		return exception.getMessage();
	}
 
	@Override
	public void eventReceived(Object sender, HaveGotUcMessageEventArgs e) {
		// when a message have been arrived from the groupware socket 31001, a event raise.
		// DB
		GroupWareData data = e.getItem();
		System.err.println(String.format("Has received %s", data.toString()));
		System.out.println("");
		//

		if (!this.brokerAvailable.get()) return;
		
		UcMessage payload;
		
		switch (data.getCmd()) {
			case Const4pbx.UC_BUSY_EXT_RES:
				break;
			case Const4pbx.UC_REPORT_EXT_STATE:
				payload = new UcMessage();
				payload.cmd = data.getCmd();
				payload.extension = data.getExtension();
				payload.status = data.getStatus();
				this.messagingTemplate.convertAndSend("/topic/ext.status." + data.getExtension(), payload);
				break;
			default:
				System.err.println(String.format("Extension : %s", data.getExtension()));
				
				if (data.getExtension().isEmpty()) return;
				
				String id = member.findIdByExt(data.getExtension());
				
				if (id == null) return;
				if (id.isEmpty()) return;
				
				payload = new UcMessage();
				payload.cmd = data.getCmd();
				payload.extension = data.getExtension();
				payload.caller = data.getCaller();
				payload.callee = data.getCallee();
				payload.status = data.getStatus();
				this.msgTemplate.convertAndSendToUser(id, "/queue/groupware", payload);
				break;
		}
	}
	
	@Override
	public void RequestToPbx(UcMessage msg) {
		try {
			uc.Send(msg);
		} catch (UnknownHostException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

}
