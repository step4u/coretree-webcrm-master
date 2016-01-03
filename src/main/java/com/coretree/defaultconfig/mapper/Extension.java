package com.coretree.defaultconfig.mapper;

import com.coretree.defaultconfig.domain.QuoteTelStatus.TelStatus;

public class Extension {
	private String extension;
	private TelStatus status;
	
	public String getExtension() {
		return extension;
	}
	public void setExtension(String extension) {
		this.extension = extension;
	}
	public TelStatus getStatus() {
		return status;
	}
	public void setStatus(TelStatus status) {
		this.status = status;
	}
	
	@Override
	public String toString() {
		return "Extension [extension=" + extension + ", status=" + status + "]";
	}
}
