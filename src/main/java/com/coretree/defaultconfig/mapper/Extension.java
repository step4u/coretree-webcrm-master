package com.coretree.defaultconfig.mapper;

public class Extension {
	private String extension;
	private String username;
	private String status;
	
	public String getExtension() { return extension; }
	public void setExtension(String extension) { this.extension = extension; }
	
	public String getUsername() { return username; }
	public void setUsername(String username) { this.extension = username; }
	
	public String getStatus() { return status; }
	public void setStatus(String status) { this.status = status; }
	
	@Override
	public String toString() {
		return "Extension [extension=" + extension + ", username=" + username + ", status=" + status + "]";
	}
}
