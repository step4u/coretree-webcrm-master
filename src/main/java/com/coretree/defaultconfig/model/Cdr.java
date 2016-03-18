package com.coretree.defaultconfig.model;

import java.lang.String;
import java.sql.Connection;
import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.List;

import com.coretree.sql.DBConnection;
import com.coretree.util.Finalvars;
import com.coretree.util.Util;

public class Cdr {
	private List<Cdr> lists;	
	
	private int idx;
	private String username;
	private String office_name;
	private Date startdate;
	private Date enddate;
	private String caller;
	private int caller_type;
	private String caller_ipn_number;
	private String caller_group_code;
	private String caller_group_name;
	private String caller_human_name;
	private String callee;
	private int callee_type;
	private String callee_ipn_number;
	private String callee_group_code;
	private String callee_group_name;
	private String callee_human_name;
	private int result;
	private int seq;
	private int tsecs;
	
	public void setIdx(int idx) { this.idx = idx; }
	public int getIdx() { return this.idx; }
	
	public void setUsername(String username) { this.username = username; }
	public String getUsername() { return this.username; }
	
	public void setOffice_name(String office_name) { this.office_name = office_name; }
	public String getOffice_name() { return this.office_name; }
	
	public void setStartdate(Date startdate) { this.startdate = startdate; }
	public Date getStartdate() { return this.startdate; }
	
	public void setEnddate(Date enddate) { this.enddate = enddate; }
	public Date getEnddate() { return this.enddate; }
	
	public void setCaller(String caller) { this.caller = caller; }
	public String getCaller() { return this.caller; }
	
	public void setCaller_type(int caller_type) { this.caller_type = caller_type; }
	public int getCaller_type() { return this.caller_type; }
	
	public void setCaller_ipn_number(String caller_ipn_number) { this.caller_ipn_number = caller_ipn_number; }
	public String getCaller_ipn_number() { return this.caller_ipn_number; }
	
	public void setCaller_group_code(String caller_group_code) { this.caller_group_code = caller_group_code; }
	public String getCaller_group_code() { return this.caller_group_code; }
	
	public void setCaller_group_name(String caller_group_name) { this.caller_group_name = caller_group_name; }
	public String getCaller_group_name() { return this.caller_group_name; }
	
	public void setCaller_human_name(String caller_human_name) { this.caller_human_name = caller_human_name; }
	public String getCaller_human_name() { return this.caller_human_name; }
	
	public void setCallee(String callee) { this.callee = callee; }
	public String getCallee() { return this.callee; }
	
	public void setCallee_type(int callee_type) { this.callee_type = callee_type; }
	public int getCallee_type() { return this.callee_type; }
	
	public void setCallee_ipn_number(String callee_ipn_number) { this.callee_ipn_number = callee_ipn_number; }
	public String getCallee_ipn_number() { return this.callee_ipn_number; }
	
	public void setCallee_group_code(String callee_group_code) { this.callee_group_code = callee_group_code; }
	public String getCallee_group_code() { return this.callee_group_code; }
	
	public void setCallee_group_name(String callee_group_name) { this.callee_group_name = callee_group_name; }
	public String getCallee_group_name() { return this.callee_group_name; }
	
	public void setCallee_human_name(String callee_human_name) { this.callee_human_name = callee_human_name; }
	public String getCallee_human_name() { return this.callee_human_name; }
	
	public void setResult(int result) { this.result = result; }
	public int getResult() { return this.result; }
	
	public void setSeq(int seq) { this.seq = seq; }
	public int getSeq() { return this.seq; }
	
	public void setTsecs(int tsecs) { this.tsecs = tsecs; }
	public int getTsecs() { return this.tsecs; }
	
	public Cdr() {
		try {
			String sql = "insert into recinfo "
					+ " ( extension, peernum, filename )"
					+ " values "
					+ " ( ?, ?, ? )";
			
			try(Connection con = DBConnection.getConnection();
					PreparedStatement stmt = con.prepareStatement(sql)) {
				con.setAutoCommit(true);
				
				stmt.setString(1, ext);
				stmt.setString(2, peer);
				stmt.setString(3, filename);
				
				stmt.executeUpdate();
			} catch (SQLException ex) {
				ex.printStackTrace();
			} finally {
				System.out.println(String.format("stream end event insert db : sql: %s", sql));
			}
		} catch (NullPointerException | UnsupportedOperationException e1) {
			Util.WriteLog(String.format(Finalvars.ErrHeader, 1002, e1.getMessage()), 1);
		} finally {
			System.out.println(String.format("stream end event : ext: %s, peer: %s, filename: %s", ext, peer, filename));
		}
	}
	
	public List<Cdr> Get() {
		return lists;
	}
}
