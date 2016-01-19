package com.coretree.defaultconfig.service;

import java.net.UnknownHostException;
import java.nio.ByteOrder;
import java.security.Principal;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Dictionary;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Hashtable;
import java.util.List;
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
import com.coretree.defaultconfig.mapper.Call;
import com.coretree.defaultconfig.mapper.CallMapper;
import com.coretree.defaultconfig.mapper.Customer;
import com.coretree.defaultconfig.mapper.CustomerMapper;
import com.coretree.defaultconfig.mapper.Member;
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
	private MemberMapper memberMapper;
	@Autowired
	private CustomerMapper custMapper;
	@Autowired
	private CallMapper callMapper;
	
	private Dictionary<String, Call> curcalls = new Hashtable();

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
	// @Scheduled(fixedDelay=2000)
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
	
	// test
	// @Scheduled(fixedDelay=5000)
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
	// @Scheduled(fixedDelay=5000)
	public void sendExtensionStatus() {
		UcMessage msg = new UcMessage();
		msg.cmd = Const4pbx.UC_BUSY_EXT_REQ;
		
		try {
			this.uc.Send(msg);
		} catch (UnknownHostException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
	// subscribe system informations, refresh on every 2 seconds.
	// @Scheduled(fixedDelay=60000)
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
		System.out.println(">>>>> : " + data.toString());
		// System.err.println(String.format("Has received %s", data.toString()));
		// System.out.println("");
		//

		if (!this.brokerAvailable.get()) return;
		
		UcMessage payload;
		
		switch (data.getCmd()) {
			case Const4pbx.UC_REGISTER_RES:
			case Const4pbx.UC_UNREGISTER_RES:
			case Const4pbx.UC_BUSY_EXT_RES:
				break;
			case Const4pbx.UC_REPORT_EXT_STATE:
				payload = new UcMessage();
				payload.cmd = data.getCmd();
				payload.extension = data.getExtension();
				payload.caller = data.getCaller();
				payload.callee = data.getCallee();
				payload.unconditional = data.getUnconditional();
				payload.status = data.getStatus();
				if (data.getDirect() == Const4pbx.UC_DIRECT_NONE) {
					this.messagingTemplate.convertAndSend("/topic/ext.status." + data.getExtension(), payload);					
				//} else if (data.getDirect() == Const4pbx.UC_DIRECT_INCOMING) {
				} else {
					Call call = curcalls.get(data.getCaller());
					if (call == null) {
						call = new Call();
						call.setCust_tel(data.getCaller());
						call.setStatus(data.getStatus());
						callMapper.add(call);
						curcalls.put(call.getCust_tel(), call);
						
						payload.call_idx = call.getIdx();
					} else {
						if (call.getStatus() == Const4pbx.UC_CALL_STATE_INVITING
								|| call.getStatus() == Const4pbx.UC_CALL_STATE_RINGING) {

							if (data.getStatus() == Const4pbx.UC_CALL_STATE_IDLE) {
								call.addCount();
								if (call.getCount() > 3) {
									// call.setStatus(data.getStatus());
									call.resetCount();
									call.setEnddate(new Timestamp(System.currentTimeMillis()));
									callMapper.modiStatus(call);
									curcalls.remove(data.getCaller());
								}
							} else {
								call.setStatus(data.getStatus());
								callMapper.modiStatus(call);
							}
						} else if (call.getStatus() == Const4pbx.UC_CALL_STATE_BUSY) {
							if (data.getStatus() == Const4pbx.UC_CALL_STATE_IDLE) {
								call.addCount();
								if (call.getCount() > 1) {
									call.setStatus(data.getStatus());
									call.resetCount();
									call.setEnddate(new Timestamp(System.currentTimeMillis()));
									callMapper.modiStatus(call);
									curcalls.remove(data.getCaller());
								}
							} else {
								call.setStatus(data.getStatus());
								callMapper.modiStatus(call);
							}
						}
					}
					
					System.err.println("curcalls.size(): " + curcalls.size());
					
					Member member = memberMapper.selectByExt(data.getExtension());
					if (data.getType() == Const4pbx.UC_DIRECT_INCOMING) {
						Customer cust = custMapper.findByExt(data.getCaller());
						
						if (cust != null) {
							payload.callername = cust.getUname();
							payload.cust_idx = cust.getIdx();
						}
						if (member != null) {
							payload.calleename = member.getUname();
						}
					}
					
					payload.call_idx = call.getIdx();
					this.msgTemplate.convertAndSendToUser(member.getUsername(), "/queue/groupware", payload);
				}
				break;
			default:
				System.err.println(String.format("Extension : %s", data.getExtension()));
				
				if (data.getExtension() == null) return;
				if (data.getExtension().isEmpty()) return;
				
				Member mem = memberMapper.selectByExt(data.getExtension());
				
				if (mem.getUsername() == null) return;
				if (mem.getUsername().isEmpty()) return;
				
				payload = new UcMessage();
				payload.cmd = data.getCmd();
				payload.extension = data.getExtension();
				payload.caller = data.getCaller();
				payload.callee = data.getCallee();
				payload.status = data.getStatus();
				this.msgTemplate.convertAndSendToUser(mem.getUsername(), "/queue/groupware", payload);
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
