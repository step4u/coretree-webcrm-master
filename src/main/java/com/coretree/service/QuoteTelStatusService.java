package com.coretree.service;

import java.io.IOException;
import java.nio.ByteOrder;
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
import org.springframework.messaging.simp.broker.BrokerAvailabilityEvent;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.coretree.domain.QuoteTelStatus;
import com.coretree.domain.QuoteTelStatus.TelStatus;
import com.coretree.socket.*;
import com.coretree.util.*;

@Service
public class QuoteTelStatusService implements ApplicationListener<BrokerAvailabilityEvent> {
	private static Log logger = LogFactory.getLog(QuoteTelStatusService.class);
	private final MessageSendingOperations<String> messagingTemplate;
	private AtomicBoolean brokerAvailable = new AtomicBoolean();
	private final StockQuoteGenerator quoteGenerator = new StockQuoteGenerator();

	@Autowired
	public QuoteTelStatusService(MessageSendingOperations<String> messagingTemplate) {
		this.messagingTemplate = messagingTemplate;
	}
	
	private UcServer uc;
	
	@Override
	public void onApplicationEvent(BrokerAvailabilityEvent event) {
		// TODO Auto-generated method stub
		this.brokerAvailable.set(event.isBrokerAvailable());
		
		uc = new UcServer("14.63.166.98", 31001, 1, ByteOrder.LITTLE_ENDIAN);
		uc.start();
		
		uc.Regist();

		try {
			Thread.sleep(2000);
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		uc.MakeCall("3001", "01045455962");
	}
	
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
	
	private static class StockQuoteGenerator {
		private final Map<String, TelStatus> innertels = new ConcurrentHashMap<>();

		public StockQuoteGenerator() {
			this.innertels.put("1001", TelStatus.Busy);
			this.innertels.put("1002", TelStatus.Busy);
			this.innertels.put("1003", TelStatus.Normal);
			this.innertels.put("1004", TelStatus.None);
			this.innertels.put("1005", TelStatus.Normal);
			this.innertels.put("1006", TelStatus.None);
			this.innertels.put("1007", TelStatus.Busy);
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

}
