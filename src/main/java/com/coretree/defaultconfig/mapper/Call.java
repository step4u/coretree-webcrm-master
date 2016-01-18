package com.coretree.defaultconfig.mapper;

import java.sql.Timestamp;

public class Call {
	private long idx;
	private long custs_idx;
	private String cust_name;
	private String cust_tel;
	private Timestamp startdate = new Timestamp(System.currentTimeMillis());
	private Timestamp enddate;
	private int diff;
	private String memo;
	private byte status;
	private int count = 0;
	
	public long getIdx() { return this.idx; }
	public void setIdx(long idx) { this.idx = idx; }
	
	public String getCust_name() { return this.cust_name; }
	public void setCust_name(String cust_name) { this.cust_name = cust_name; }
	
	public long getCusts_idx() { return this.custs_idx; }
	public void setCusts_idx(long custs_idx) { this.custs_idx = custs_idx; }

	public String getCust_tel() { return this.cust_tel; }
	public void setCust_tel(String cust_tel) { this.cust_tel = cust_tel; }
	
	public Timestamp getStartdate() { return this.startdate; }
	public void setStartdate(Timestamp startdate) { this.startdate = startdate; }
	
	public Timestamp getEnddate() { return this.enddate; }
	public void setEnddate(Timestamp enddate) { this.enddate = enddate; }
	
	public int getDiff() { return this.diff; }
	public void setDiff(int diff) { this.diff = diff; }
	
	public String getMemo() { return this.memo; }
	public void setMemo(String memo) { this.memo = memo; }
	
	public long getStatus() { return this.status; }
	public void setStatus(byte status) { this.status = status; }
	
	public long getCount() { return this.count; }
	public void setCount(int count) { this.count = count; }
	public void addCount() { this.count++; }
	public void resetCount() { this.count = 0; }
	
/*	public Date getRegdate() { return this.regdate; }
	public void setRegdate(Date regdate) { this.regdate = regdate; }*/
	
	@Override
	public String toString() {
		return "Call [idx=" + idx + ", custs_idx=" + custs_idx + ", cust_tel=" + cust_tel
				+ ", startdate=" + startdate + ", enddate=" + enddate
				+ ", memo=" + memo + "]";
	}
}
