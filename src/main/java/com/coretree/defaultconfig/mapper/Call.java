package com.coretree.defaultconfig.mapper;

import java.util.Date;

public class Call {
	private long idx;
	private long customer_idx;
	private String title;
	private String contents;
	private Date regdate;
	
	public long getIdx() { return this.idx; }
	public void setIdx(long idx) { this.idx = idx; }
	
	public long getCustomer_idx() { return this.customer_idx; }
	public void setCustomer_idx(long customer_idx) { this.customer_idx = customer_idx; }

	public String getTitle() { return this.title; }
	public void setTitle(String title) { this.title = title; }
	
	public String getContents() { return this.contents; }
	public void setContents(String contents) { this.contents = contents; }
	
	public Date getRegdate() { return this.regdate; }
	public void setRegdate(Date regdate) { this.regdate = regdate; }
	
	@Override
	public String toString() {
		return "Calls [idx=" + idx + ", customer_idx=" + customer_idx + ", title=" + title + ", contents=" + contents + ""
				+ ", regdate=" + regdate + "]";
	}
}
