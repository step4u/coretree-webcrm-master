package com.coretree.defaultconfig.controller;

import java.io.File;
import java.security.Principal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.coretree.defaultconfig.mapper.SysInfo;
import com.coretree.defaultconfig.mapper.SysInfoMapper;

@RestController
public class SysInfoController {

	@Autowired
	SysInfoMapper sysinfoMapper;
	
	@RequestMapping(path="/sysinfo", method=RequestMethod.POST)
	public SysInfo getDiskSpace(Principal principal) {
		SysInfo sysinfo = sysinfoMapper.getCallInfo();
		
		File file = new File("./");
        long freespace = file.getFreeSpace(); 
		
		sysinfo.setDiskspace(freespace / 1024 / 1024);
		return sysinfo;
	}
}
