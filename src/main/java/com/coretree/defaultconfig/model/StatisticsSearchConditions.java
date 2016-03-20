package com.coretree.defaultconfig.model;

import java.sql.Date;

public class StatisticsSearchConditions {
	private Date sdate;
	private Date edate;
	private String username;
	
	public void setSdate(Date sdate) { this.sdate = sdate; }
	public Date getSdate() { return this.sdate; }
	
	public void setEdate(Date edate) { this.edate = edate; }
	public Date getEdate() { return this.edate; }
	
	public void setUsername(String username) { this.username = username; }
	public String getUsername() { return this.username; }
}
