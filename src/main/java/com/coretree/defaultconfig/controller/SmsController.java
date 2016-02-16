package com.coretree.defaultconfig.controller;

import java.security.Principal;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.coretree.defaultconfig.mapper.Record;
import com.coretree.defaultconfig.mapper.RecordMapper;
import com.coretree.defaultconfig.mapper.Sms;
import com.coretree.defaultconfig.mapper.SmsMapper;

@RestController
public class SmsController {
	
	@Autowired
	SmsMapper mapper;
	
	@RequestMapping(path="/sms/get/count", method=RequestMethod.GET)
	public long getCount(Principal principal) {
		return mapper.count();
	}
	
	@RequestMapping(path="/sms/get/all", method=RequestMethod.POST)
	public List<Sms> getAll(Sms obj, Principal principal) {
		return mapper.getAll(obj);
	}
	
	@RequestMapping(path="/sms/get/search/{txt}", method=RequestMethod.GET)
	public List<Sms> getByTxt(@PathVariable("txt") String txt, Principal principal) {
		return mapper.getByTxt("%" + txt + "%");
	}

	@RequestMapping(path="/sms/del/{idx}", method=RequestMethod.GET)
	public void remove(@PathVariable("idx") long idx, Principal principal) {
		mapper.del(idx);
	}
	
	@RequestMapping(path="/sms/del/all", method=RequestMethod.POST)
	public void removeAll(ArrayList<Sms> list, Principal principal) {
		mapper.delAll(list);
	}
}
