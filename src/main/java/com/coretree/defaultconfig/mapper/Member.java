package com.coretree.defaultconfig.mapper;

public class Member {
	private String username;
	private String password;
	private String uname;
	private String posi;
	private String tel;
	private String cellular;
	private String extension;
	private String role;
	private String status;
	
	public String getUsername() {
		return username;
	}
	public void setUsername(String username) {
		this.username = username;
	}
	public String getUname() {
		return uname;
	}
	public void setUname(String uname) {
		this.uname = uname;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	public String getTitle() {
		return posi;
	}
	public void setPosi(String posi) {
		this.posi = posi;
	}
	public String getTel() {
		return tel;
	}
	public void setTel(String tel) {
		this.tel = tel;
	}
	public String getCellular() {
		return cellular;
	}
	public void setCellular(String cellular) {
		this.cellular = cellular;
	}
	public String getExtension() {
		return extension;
	}
	public void setExtension(String extension) {
		this.extension = extension;
	}
	public String getRole() {
		return role;
	}
	public void getRole(String role) {
		this.role = role;
	}
	
	@Override
	public String toString() {
		return "Member [username=" + username + ", uname=" + uname + ", posi=" + posi + ", tel=" + tel + ", cellular=" + cellular + ", extension=" + extension + ", role=" + role + "]";
	}
}
