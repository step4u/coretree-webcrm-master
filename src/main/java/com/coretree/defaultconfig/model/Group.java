package com.coretree.defaultconfig.model;

public class Group {
	private String depthorder;
	private String txt;
	
	public String getDepthorder() { return this.depthorder; }
	public void setDepthorder(String depthorder) { this.depthorder = depthorder; }
	
	public String getTxt() { return txt; }
	public void setTxt(String txt) { this.txt = txt; }
	
	@Override
	public String toString() {
		return "Group [depthorder=" + depthorder + ", txt=" + txt + "]";
	}
}
