package com.coretree.defaultconfig.mapper;

public class Customer {
	private int idx;
	private String depthorder;
	private String username;
	private String uname;
	private String company;
	private String posi;
	private String tel;
	private String cellular;
	private String extension;
	private String email;
	
	public int getIdx() { return this.idx; }
	public void setIdx(int idx) { this.idx = idx; }
	
	public String getDepthorder() { return this.depthorder; }
	public void setDepthorder(String depthorder) { this.depthorder = depthorder; }
	
	public String getUsername() { return this.username; }
	public void setUsername(String username) { this.username = username; }
	
	public String getUname() { return uname; }
	public void setUname(String uname) { this.uname = uname; }

	public String getCompany() { return company; }
	public void setCompany(String company) { this.company = company; }
	
	public String getTitle() { return posi; }
	public void setPosi(String posi) { this.posi = posi; }
	
	public String getTel() { return tel; }
	public void setTel(String tel) { this.tel = tel; }
	
	public String getCellular() { return cellular; }
	public void setCellular(String cellular) { this.cellular = cellular; }
	
	public String getExtension() { return extension; }
	public void setExtension(String extension) { this.extension = extension; }
	
	public String getEmain() { return email; }
	public void setEmain(String email) { this.email = email; }
	
	@Override
	public String toString() {
		return "Customer [idx=" + idx + ", depthorder=" + depthorder + ", username=" + username + ", uname=" + uname
				+ ", posi=" + posi + ", tel=" + tel + ", cellular=" + cellular
				+ ", extension=" + extension + ", email=" + email + "]";
	}
}
