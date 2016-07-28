package com.coretree.defaultconfig.mapper;

public class Member {
	private String emp_no;
	private String password;
	private String emp_nm;
	private String grp_cd;
	private String enter_date;
	private String auth_cd;
	private String mobile_phoneno;
	private String emailid;
	private String extension_no;
	private String note;
	private int state;
	private int tempstate = 0;
	private String tempstr;
	
	public String getEmp_no() { return emp_no; }
	public void setEmp_no(String emp_no) { this.emp_no = emp_no; }
	
	public String getPassword() { return password; }
	public void setPassword(String password) { this.password = password; }
	
	public String getEmp_nm() { return emp_nm; }
	public void setEmp_nm(String emp_nm) { this.emp_nm = emp_nm; }
	
	public String getGrp_cd() { return grp_cd; }
	public void setGrp_cd(String grp_cd) { this.grp_cd = grp_cd; }
	
	public String getEnter_date() { return enter_date; }
	public void setEnter_date(String enter_date) { this.enter_date = enter_date; }
	
	public String getAuth_cd() { return auth_cd; }
	public void setAuth_cd(String auth_cd) { this.auth_cd = auth_cd; }
	
	public String getMobile_phoneno() { return mobile_phoneno; }
	public void setMobile_phoneno(String mobile_phoneno) { this.mobile_phoneno = mobile_phoneno; }
	
	public String getEmailid() { return emailid; }
	public void setEmailid(String emailid) { this.emailid = emailid; }
	
	public String getExtension_no() { return extension_no; }
	public void setExtension_no(String extension_no) { this.extension_no = extension_no; }
	
	public String getNote() { return note; }
	public void setNote(String note) { this.note = note; }
	
	public int getState() { return state; }
	public void setState(int state) { this.state = state; }
	
	public int getTempstate() { return tempstate; }
	public void setTempstate(int tempstate) { this.tempstate = tempstate; }
	
	public String getTempstr() { return this.tempstr; }
	public void setTempstr(String tempstr) { this.tempstr = tempstr; }
	
	@Override
	public String toString() {
		return "Member [emp_no=" + emp_no + ", password=" + password + ", emp_nm=" + emp_nm + ", grp_cd=" + grp_cd
				+ ", enter_date=" + enter_date + ", auth_cd=" + auth_cd + ", mobile_phoneno=" + mobile_phoneno
				+ ", emailid=" + emailid + ", extension_no=" + extension_no + ", note=" + note + ", state=" + state
				+ ", tempstate=" + tempstate + ", tempstr=" + tempstr + "]";
	}
}
