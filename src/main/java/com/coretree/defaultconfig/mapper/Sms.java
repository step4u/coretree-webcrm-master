package com.coretree.defaultconfig.mapper;

import java.util.Date;

public class Sms {
	private long idx;
	private int custs_idx;
	private String custs_tel;
	private String contents;
	private int result;
	private Date regdate;
	private String sdate;
	private String edate;
	private int curpage;
	private int rowsperpage;
	
	public long getIdx() { return this.idx; }
	public void setIdx(long idx) { this.idx = idx; }
	
	public int getCusts_idx() { return this.custs_idx; }
	public void setCusts_idx(int custs_idx) { this.custs_idx = custs_idx; }

	public String getCusts_tel() { return this.custs_tel; }
	public void setCusts_tel(String custs_tel) { this.custs_tel = custs_tel; }
	
	public String getContents() { return this.contents; }
	public void setContents(String contents) { this.contents = contents; }
	
	public int getResult() { return this.result; }
	public void setResult(int result) { this.result = result; }
	
	public Date getRegdate() { return this.regdate; }
	public void setRegdate(Date regdate) { this.regdate = regdate; }
	
	public String getSdate() { return this.sdate; }
	public void setSdate(String sdate) { this.sdate = sdate; }
	
	public String getEdate() { return this.edate; }
	public void setEdate(String edate) { this.edate = edate; }
	
	public int getCurpage() { return this.curpage; }
	public void setCurpage(int curpage) { this.curpage = curpage; }
	
	public int getRowsperpage() { return this.rowsperpage; }
	public void setRowsperpage(int rowsperpage) { this.rowsperpage = rowsperpage; }
	
	@Override
	public String toString() {
		return "Record [idx=" + idx + ", custs_idx=" + custs_idx + ", custs_tel=" + custs_tel + ", contents=" + contents
				+ ", result=" + result + ", regdate=" + regdate + "]";
	}
}
