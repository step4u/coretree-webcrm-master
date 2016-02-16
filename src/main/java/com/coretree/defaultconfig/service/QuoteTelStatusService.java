package com.coretree.defaultconfig.service;

import java.net.UnknownHostException;
import java.nio.ByteOrder;
import java.security.Principal;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.Set;
import java.util.TimerTask;
import java.util.concurrent.ConcurrentHashMap;
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

import scala.collection.immutable.Stream.Cons;

@Service
@RestController
public class QuoteTelStatusService implements ApplicationListener<BrokerAvailabilityEvent>, IEventHandler<HaveGotUcMessageEventArgs>, IQuoteTelStatusService {
	private static Log logger = LogFactory.getLog(QuoteTelStatusService.class);
	private final MessageSendingOperations<String> messagingTemplate;
	private final SimpMessagingTemplate msgTemplate;
	private AtomicBoolean brokerAvailable = new AtomicBoolean();
	// private final StockQuoteGenerator quoteGenerator = new StockQuoteGenerator();
	

	@Autowired
	private MemberMapper memberMapper;
	@Autowired
	private CustomerMapper custMapper;
	@Autowired
	private CallMapper callMapper;
	
	private List<Call> curcalls = new ArrayList<Call>();
	private List<Member> userstate = new ArrayList<Member>();

	@Autowired
	public QuoteTelStatusService(MessageSendingOperations<String> messagingTemplate, SimpMessagingTemplate msgTemplate) {
		this.messagingTemplate = messagingTemplate;
		this.msgTemplate = msgTemplate;
	}
	
	private UcServer uc;
	
	@Override
	public void onApplicationEvent(BrokerAvailabilityEvent event) {
		this.brokerAvailable.set(event.isBrokerAvailable());
		
		// uc = new UcServer("14.63.171.190", 31001, 1, ByteOrder.BIG_ENDIAN);
		uc = new UcServer("14.63.171.190", 31001, 1, ByteOrder.LITTLE_ENDIAN);
		// uc = new UcServer("127.0.0.1", 31002, 1, ByteOrder.LITTLE_ENDIAN);
		// uc = new UcServer("127.0.0.1", 31001, 1, ByteOrder.BIG_ENDIAN);
		uc.HaveGotUcMessageEventHandler.addEventHandler(this);
		uc.regist();

		this.InitializeUserState();
	}
	
	private void InitializeUserState() {
		userstate = memberMapper.getUserState();
		sendExtensionStatus();
		
/*		
		int i = 0;
		for (Member m : userstate) {
			System.err.println(">> InitializeUserState(), userstate[" + i + "] : " + m.toString());
			i++;
		}
*/
	}
	
	// subscribe extension status
	// @Scheduled(fixedDelay=5000)
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
	
/*	
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
*/
	
	@MessageMapping("/traders")
	public void executeTrade(UcMessage message, Principal principal) {
		switch (message.cmd) {
			case Const4pbx.WS_REQ_EXTENSION_STATE:
				message.cmd = Const4pbx.WS_RES_EXTENSION_STATE;
				for (Member m : userstate) {
					message.extension = m.getExtension();
					message.status = m.getState();
					this.msgTemplate.convertAndSendToUser(principal.getName(), "/queue/groupware", message);
				}
				break;
			case Const4pbx.WS_REQ_SET_EXTENSION_STATE:
				Member mem = userstate.stream().filter(x -> x.getExtension().equals(message.extension)).findFirst().get();
				
				//message = GetMessage(mem, message.status);
				break;
			case Const4pbx.WS_REQ_RELOAD_USER:
				break;
			default:
				this.RequestToPbx(message);
				break;
		}
	}
	
/*	private UcMessage GetMessage(Member member, int status) {
		UcMessage msg;
		
		switch (status) {
			case Const4pbx.WS_VALUE_EXTENSION_STATE_ONLINE:
				try {
					if (member.getState() == Const4pbx.ws)
				} catch (NoSuchElementException | NullPointerException e) {
					
				}
				this.RequestToPbx(message);
				break;
			case Const4pbx.WS_VALUE_EXTENSION_STATE_LEFT:
				break;
			case Const4pbx.WS_VALUE_EXTENSION_STATE_REDIRECTED:
				break;
			case Const4pbx.WS_VALUE_EXTENSION_STATE_DND:
				break;
		}
		
		return msg;
	}*/
	
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
		System.out.println(">>> " + data.toString());

		if (!this.brokerAvailable.get()) return;
		
		UcMessage payload;
		
		switch (data.getCmd()) {
			case Const4pbx.UC_REGISTER_RES:
			case Const4pbx.UC_UNREGISTER_RES:
			case Const4pbx.UC_BUSY_EXT_RES:
			case Const4pbx.UC_REPORT_SRV_STATE:
				break;
			case Const4pbx.UC_REPORT_EXT_STATE:
				for (Member m : userstate) {
					if (m.getExtension().equals(data.getExtension())) {
						m.setState(data.getStatus());
					}
				}
				
				if (data.getCallee().isEmpty()) break;
			case Const4pbx.UC_SET_SRV_RES:
			case Const4pbx.UC_CLEAR_SRV_RES:
			case Const4pbx.UC_REPORT_WAITING_COUNT:
				this.PassReportExtState(data);
				break;
			default:
				// System.err.println(String.format("Extension : %s", data.getExtension()));
				
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
	
	private final ReentrantReadWriteLock rwl = new ReentrantReadWriteLock();
    private final Lock r = rwl.readLock();
    private final Lock w = rwl.writeLock();
    
	private void PassReportExtState(GroupWareData data) {
		UcMessage payload = new UcMessage();
		payload.cmd = data.getCmd();
		payload.direct = data.getDirect();
		payload.extension = data.getExtension();
		payload.caller = data.getCaller();
		payload.callee = data.getCallee();
		payload.unconditional = data.getUnconditional();
		payload.status = data.getStatus();
		payload.responseCode = data.getResponseCode();
		
		
		if (data.getCmd() == Const4pbx.UC_REPORT_WAITING_COUNT
				|| data.getCmd() == Const4pbx.UC_SET_SRV_RES
				|| data.getCmd() == Const4pbx.UC_CLEAR_SRV_RES) {
			this.messagingTemplate.convertAndSend("/topic/ext.state." + data.getExtension(), payload);
		} else if (data.getCmd() == Const4pbx.UC_REPORT_SRV_STATE) {
			if (data.getDnD() == Const4pbx.UC_DND_SET) {
				payload.status = Const4pbx.WS_VALUE_EXTENSION_STATE_DND;
			} else {
				if (!data.getUnconditional().isEmpty()) {
					payload.status = Const4pbx.WS_VALUE_EXTENSION_STATE_REDIRECTED;
				}
			}

			if (!data.getUnconditional().isEmpty()) {
				if (userstate != null) {
					Member member = userstate.stream().filter(x -> x.getExtension().equals(data.getExtension())).findFirst().get();
				}
			}
			
			this.messagingTemplate.convertAndSend("/topic/ext.state." + data.getExtension(), payload);
		} else if (data.getCmd() == Const4pbx.UC_REPORT_EXT_STATE) {
			Call call = null;
			
			switch (data.getDirect()) {
				case Const4pbx.UC_DIRECT_INCOMING:

					r.lock();
					try {
						call = curcalls.stream().filter(x -> x.getExtension().equals(data.getCallee())
								&& x.getCust_tel().equals(data.getCaller())).findFirst().get();
					} catch (NullPointerException | NoSuchElementException e) {
						call = null;
					} finally {
						r.unlock();
					}
					
					switch (data.getStatus()) {
						case Const4pbx.UC_CALL_STATE_IDLE:
							if (call != null) {
								if (call.getStatus() == Const4pbx.UC_CALL_STATE_RINGING) {
									callMapper.modiEnd(call);
									
									w.lock();
									try {
										curcalls.removeIf(x -> x.getCust_tel().equals(data.getCaller()) && x.getExtension().equals(data.getCallee()));
									} finally {
										w.unlock();
									}
								} else if (call.getStatus() == Const4pbx.UC_CALL_STATE_BUSY) {
									call.setStatus(data.getStatus());
									call.setEnddate(new Timestamp(System.currentTimeMillis()));
									callMapper.modiStatus(call);
									
									w.lock();
									try {
										curcalls.removeIf(x -> x.getCust_tel().equals(data.getCaller()) && x.getExtension().equals(data.getCallee()));
									} finally {
										w.unlock();
									}
								}
								this.messagingTemplate.convertAndSend("/topic/ext.state." + data.getExtension(), payload);
								System.err.println("IDLE curcalls.size(): " + curcalls.size());
							}
							break;
						case Const4pbx.UC_CALL_STATE_INVITING:
						case Const4pbx.UC_CALL_STATE_RINGING:
							if (call == null) {
								call = new Call();
								call.setExtension(data.getExtension());
								call.setCust_tel(data.getCaller());
								call.setStatus(data.getStatus());
								call.setDirect(data.getDirect());
								
								w.lock();
								try {
									curcalls.add(call);
								} finally {
									w.unlock();
								}
								
								callMapper.add(call);
								this.messagingTemplate.convertAndSend("/topic/ext.state." + data.getExtension(), payload);
								//System.err.println("RINGING curcalls.size(): " + curcalls.size());
							}
							break;
						case Const4pbx.UC_CALL_STATE_BUSY:
							if (call != null) {
								call.setStartdate(new Timestamp(System.currentTimeMillis()));
								call.setStatus(data.getStatus());
								callMapper.modiStatus(call);
								this.messagingTemplate.convertAndSend("/topic/ext.state." + data.getExtension(), payload);
								System.err.println("BUSY curcalls.size(): " + curcalls.size());
							}
							break;
					}
					
					if (call != null) {
						call.setStatus(data.getStatus());
						
						Member member = memberMapper.selectByExt(data.getExtension());
						if (member != null) {
							Customer cust = custMapper.findByExt(data.getCaller());
							
							if (cust != null) {
								payload.callername = cust.getUname();
								payload.cust_idx = cust.getIdx();
							}
							if (member != null) {
								payload.calleename = member.getUname();
							}
							
							payload.call_idx = call.getIdx();
							this.msgTemplate.convertAndSendToUser(member.getUsername(), "/queue/groupware", payload);
						}
					}
					// this.messagingTemplate.convertAndSend("/topic/ext.state." + data.getExtension(), payload);
					break;
				case Const4pbx.UC_DIRECT_OUTGOING:
					r.lock();
					try {
						call = curcalls.stream().filter(x -> x.getExtension().equals(data.getExtension())
								&& x.getCust_tel().equals(data.getCallee())).findFirst().get();
					} catch (NullPointerException | NoSuchElementException e) {
						call = null;
					} finally {
						r.unlock();
					}
					
					switch (data.getStatus()) {
						case Const4pbx.UC_CALL_STATE_IDLE:
							if (call != null) {
								if (call.getStatus() == Const4pbx.UC_CALL_STATE_RINGING) {
									callMapper.modiEnd(call);
									
									w.lock();
									try {
										curcalls.removeIf(x -> x.getCust_tel().equals(data.getCaller()) && x.getExtension().equals(data.getCallee()));
									} finally {
										w.unlock();
									}
								} else if (call.getStatus() == Const4pbx.UC_CALL_STATE_BUSY) {
									call.setStatus(data.getStatus());
									call.setEnddate(new Timestamp(System.currentTimeMillis()));
									callMapper.modiStatus(call);
									
									w.lock();
									try {
										curcalls.removeIf(x -> x.getCust_tel().equals(data.getCallee()) && x.getExtension().equals(data.getExtension()));
									} finally {
										w.unlock();
									}
								}
								this.messagingTemplate.convertAndSend("/topic/ext.state." + data.getExtension(), payload);
								System.err.println("IDLE curcalls.size(): " + curcalls.size());
							}
							break;
						case Const4pbx.UC_CALL_STATE_INVITING:
							if (call == null) {
								call = new Call();
								call.setExtension(data.getExtension());
								call.setCust_tel(data.getCallee());
								call.setStartdate(new Timestamp(System.currentTimeMillis()));
								call.setStatus(data.getStatus());
								call.setDirect(data.getDirect());
								
								w.lock();
								try {
									curcalls.add(call);
								} finally {
									w.unlock();
								}
								
								callMapper.add(call);
								this.messagingTemplate.convertAndSend("/topic/ext.state." + data.getExtension(), payload);
							}
							break;
						case Const4pbx.UC_CALL_STATE_BUSY:
							if (call != null) {
								call.setStartdate(new Timestamp(System.currentTimeMillis()));
								call.setStatus(data.getStatus());
								callMapper.modiStatus(call);
								this.messagingTemplate.convertAndSend("/topic/ext.state." + data.getExtension(), payload);
								System.err.println("BUSY curcalls.size(): " + curcalls.size());
							}
							break;
					}

					if (call != null) {
						call.setStatus(data.getStatus());
						
						Member member = memberMapper.selectByExt(data.getExtension());
						if (member != null) {
							Customer cust = custMapper.findByExt(data.getCaller());
							
							if (cust != null) {
								payload.calleename = cust.getUname();
								payload.cust_idx = cust.getIdx();
							}
							if (member != null) {
								payload.callername = member.getUname();
							}
							
							payload.call_idx = call.getIdx();
							this.msgTemplate.convertAndSendToUser(member.getUsername(), "/queue/groupware", payload);
						}
					}
					
					// this.messagingTemplate.convertAndSend("/topic/ext.state." + data.getExtension(), payload);
					break;
				default:
					this.messagingTemplate.convertAndSend("/topic/ext.state." + data.getExtension(), payload);
					break;
			}
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

	class Timer_Elapsed extends TimerTask {
		public QuoteTelStatusService parent = null;
		public Timer_Elapsed(QuoteTelStatusService obj) {
			this.parent = obj;
		}
		
		@Override
		public void run() {
			
		}
	}
}
