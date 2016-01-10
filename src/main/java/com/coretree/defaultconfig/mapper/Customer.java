package com.coretree.defaultconfig.mapper;

public class Customer {
	private int idx;
	private int groups_idx;
	private int customgroups_idx;
	private String uname;
	private String company;
	private String posi;
	private String tel;
	private String cellular;
	private String extension;
	private String email;
	
	public int getIdx() { return this.idx; }
	public void setIdx(int idx) { this.idx = idx; }
	
	public int getGroup_idx() { return this.groups_idx; }
	public void setGroup_idx(int groups_idx) { this.groups_idx = groups_idx; }
	
	public int getCustgroup_idx() { return this.customgroups_idx; }
	public void setCustgroup_idx(int customgroups_idx) { this.customgroups_idx = customgroups_idx; }
	
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
		return "Customer [idx=" + idx + ", groups_idx=" + groups_idx + ", customgroups_idx=" + customgroups_idx + ", uname=" + uname
				+ ", posi=" + posi + ", tel=" + tel + ", cellular=" + cellular
				+ ", extension=" + extension + ", email=" + email + "]";
	}
}
