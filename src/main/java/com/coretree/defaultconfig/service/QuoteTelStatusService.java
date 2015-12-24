package com.coretree.defaultconfig.service;

import java.nio.ByteOrder;
import java.security.Principal;
import java.sql.SQLException;
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
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.messaging.simp.annotation.SubscribeMapping;
import org.springframework.messaging.simp.broker.BrokerAvailabilityEvent;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.coretree.defaultconfig.domain.QuoteTelStatus;
import com.coretree.defaultconfig.domain.QuoteTelStatus.TelStatus;
import com.coretree.defaultconfig.helper.FirebirdSqlHelper;
import com.coretree.socket.*;

@RestController
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

//		try {
//			Thread.sleep(1000);
//		} catch (InterruptedException e) {
//			// TODO Auto-generated catch block
//			e.printStackTrace();
//		}
		
		//uc.MakeCall("3001", "01045455962");

//		try {
//			FirebirdSqlHelper fb = new FirebirdSqlHelper();
//			System.err.println("FirebirdSqlHelper Constructor, dataSource : " + fb.dataSource.getDatabase());
//			fb.close();
//		} catch (SQLException e) {
//			e.printStackTrace();
//		}
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
	
	@SubscribeMapping("/topic")
	public List<PortfolioPosition> getPositions(Principal principal) throws Exception {
		logger.debug("Positions for " + principal.getName());
		Portfolio portfolio = this.portfolioService.findPortfolio(principal.getName());
		return portfolio.getPositions();
	}

	@MessageMapping("/queue")
	public void executeTrade(Trade trade, Principal principal) {
		trade.setUsername(principal.getName());
		logger.debug("Trade: " + trade);
		this.tradeService.executeTrade(trade);
	}

	@MessageExceptionHandler
	@SendToUser("/queue/errors")
	public String handleException(Throwable exception) {
		return exception.getMessage();
	}

	/*
	// 통화 
	@RestController
	public class GoupwareController {
		private static final Log logger = LogFactory.getLog(GoupwareController.class);

		@Autowired
		public GoupwareController(PortfolioService portfolioService, TradeService tradeService) {
			this.portfolioService = portfolioService;
			this.tradeService = tradeService;
		}

		@SubscribeMapping("/positions")
		public List<PortfolioPosition> getPositions(Principal principal) throws Exception {
			logger.debug("Positions for " + principal.getName());
			Portfolio portfolio = this.portfolioService.findPortfolio(principal.getName());
			return portfolio.getPositions();
		}

		@MessageMapping("/trade")
		public void executeTrade(Trade trade, Principal principal) {
			trade.setUsername(principal.getName());
			logger.debug("Trade: " + trade);
			this.tradeService.executeTrade(trade);
		}

		@MessageExceptionHandler
		@SendToUser("/queue/errors")
		public String handleException(Throwable exception) {
			return exception.getMessage();
		}
	}
	*/
	
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
}
