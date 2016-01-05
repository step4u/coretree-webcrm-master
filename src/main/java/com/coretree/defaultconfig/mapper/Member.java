package com.coretree.defaultconfig.mapper;

public class Member {
	private int idx;
	private String id;
	private String name;
	private String pwd;
	private String title;
	private String tel;
	private String cellular;
	private String extension;
	private String roles;
	
	public int getIdx() {
		return idx;
	}
	public void setIdx(int idx) {
		this.idx = idx;
	}
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getPwd() {
		return pwd;
	}
	public void setPwd(String pwd) {
		this.pwd = pwd;
	}
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
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
	public String getRoles() {
		return roles;
	}
	public void getRoles(String roles) {
		this.roles = roles;
	}
	
	@Override
	public String toString() {
		return "Member [idx=" + idx + ", id=" + id + ", name=" + name + ", title=" + title + ", tel=" + tel + ", cellular=" + cellular + ", extension=" + extension + ", roles=" + roles + "]";
	}
}
