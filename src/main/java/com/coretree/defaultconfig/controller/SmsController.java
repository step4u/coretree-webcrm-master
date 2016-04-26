package com.coretree.defaultconfig.controller;

import java.security.Principal;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.coretree.defaultconfig.mapper.Sms;
import com.coretree.defaultconfig.mapper.SmsMapper;
import com.coretree.defaultconfig.model.SearchConditions;
import com.coretree.defaultconfig.model.SmsSearchConditions;

@RestController
public class SmsController {
	
	@Autowired
	SmsMapper mapper;
	
	@RequestMapping(path="/sms/get/count", method=RequestMethod.POST)
	public long getCount(@RequestBody SmsSearchConditions condition, Principal principal) {
		condition.setUsername(principal.getName());
		return mapper.count(condition);
	}
	
	@RequestMapping(path="/sms/get/all", method=RequestMethod.POST)
	public List<Sms> getAll(@RequestBody SmsSearchConditions condition, Principal principal) {
		condition.setUsername(principal.getName());
		return mapper.getAll(condition);
	}
	
	@RequestMapping(path="/sms/get/view", method=RequestMethod.POST)
	public List<Sms> getView(@RequestBody SmsSearchConditions condition, Principal principal) {
		condition.setUsername(principal.getName());
		return mapper.getView(condition);
	}

	@RequestMapping(path="/sms/del", method=RequestMethod.POST)
	public void remove(@RequestBody SmsSearchConditions condition, Principal principal) {
		mapper.del(condition.getIdx());
	}
	
	@RequestMapping(path="/sms/del/all", method=RequestMethod.POST)
	public void removeAll(ArrayList<Sms> list, Principal principal) {
		for(Sms sms : list) {
			mapper.del(sms.getIdx());
		}
	}
	
	@RequestMapping(path="/sms/add/msg", method=RequestMethod.POST)
	public void addMsg(@RequestBody Sms data, Principal principal) {
		mapper.add(data);
	}
}
