package com.coretree.defaultconfig.mapper;

public class Customer {
	private int idx;
	private int group_idx;
	private int custgroup_idx;
	private String uname;
	private String posi;
	private String tel;
	private String cellular;
	private String extension;
	private String email;
	
	public int getIdx() { return this.idx; }
	public void setIdx(int idx) { this.idx = idx; }
	
	public int getGroup_idx() { return this.group_idx; }
	public void setGroup_idx(int group_idx) { this.group_idx = group_idx; }
	
	public int getCustgroup_idx() { return this.custgroup_idx; }
	public void setCustgroup_idx(int custgroup_idx) { this.custgroup_idx = custgroup_idx; }
	
	public String getUname() { return uname; }
	public void setUname(String uname) { this.uname = uname; }
	
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
		return "Customer [idx=" + idx + ", group_idx=" + group_idx + ", custgroup_idx=" + custgroup_idx + ", uname=" + uname
				+ ", posi=" + posi + ", tel=" + tel + ", cellular=" + cellular
				+ ", extension=" + extension + ", email=" + email + "]";
	}
}
