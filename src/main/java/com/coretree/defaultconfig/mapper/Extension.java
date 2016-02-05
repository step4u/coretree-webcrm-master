package com.coretree.defaultconfig.mapper;

public class Extension {
	private String extension;
	private String username;
	private String uname;
	private String status;
	
	public String getExtension() { return this.extension; }
	public void setExtension(String extension) { this.extension = extension; }
	
	public String getUsername() { return this.username; }
	public void setUsername(String username) { this.username = username; }
	
	public String getUname() { return this.uname; }
	public void setUname(String uname) { this.uname = uname; }
	
	public String getStatus() { return this.status; }
	public void setStatus(String status) { this.status = status; }
	
	@Override
	public String toString() {
		return "Extension [extension=" + extension + ", username=" + username + ", status=" + status + "]";
	}
}
