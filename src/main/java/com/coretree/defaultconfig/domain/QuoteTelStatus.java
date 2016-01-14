package com.coretree.defaultconfig.domain;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Random;

public class QuoteTelStatus {
	private String ticker;
	private TelStatus status;
	
	private QuoteTelStatus() { }
	
	public QuoteTelStatus(String ticker, TelStatus status) {
		this.ticker = ticker;
		this.status = status;
	}
	
	public String getTicker() {
		return this.ticker;
	}

	public void setTicker(String ticker) {
		this.ticker = ticker;
	}

	public TelStatus getStatus() {
		return this.status;
	}

	public void setStatus(TelStatus status) {
		this.status = status;
	}

	@Override
	public String toString() {
		return "QuoteTelStatus [ticker=" + this.ticker + ", status=" + this.status + "]";
	}
	
	public enum TelStatus {
		None, Normal, Busy;
		
		private static final List<TelStatus> VALUES =
			    Collections.unmodifiableList(Arrays.asList(values()));
			  private static final int SIZE = VALUES.size();
			  private static final Random RANDOM = new Random();

			  public static TelStatus randomLetter()  {
			    return VALUES.get(RANDOM.nextInt(SIZE));
			  }
	}
}
