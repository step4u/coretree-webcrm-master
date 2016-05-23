package com.coretree.defaultconfig.controller;

import java.security.Principal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.coretree.defaultconfig.mapper.SysInfo;
import com.coretree.defaultconfig.mapper.SysinfoMapper;

@RestController
public class SysInfoController {

	@Autowired
	SysinfoMapper sysinfoMapper;
	
	@RequestMapping(path="/sysinfo", method=RequestMethod.POST)
	public SysInfo getDiskSpace(Principal principal) {
		SysInfo sysinfo = sysinfoMapper.getCallInfo();
		sysinfo.setDiskspace(8897895);
		return sysinfo;
	}
}
