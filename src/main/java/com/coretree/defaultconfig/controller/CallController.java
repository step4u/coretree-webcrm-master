package com.coretree.defaultconfig.controller;

import java.security.Principal;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.coretree.defaultconfig.mapper.Call;
import com.coretree.defaultconfig.mapper.CallMapper;
import com.coretree.defaultconfig.mapper.SearchConditions;

@RestController
public class CallController {
	
	@Autowired
	CallMapper mapper;
	
	@RequestMapping(path="/call/get/count", method=RequestMethod.POST)
	public int getCount(Principal principal) {
		return mapper.count();
	}
	
/*	@RequestMapping(path="/call/get/all/{curpage}/{rowsperpage}", method=RequestMethod.GET)
	public List<Call> getAll(@PathVariable("curpage") int curpage
			, @PathVariable("rowsperpage") int rowsperpage
			, Principal principal) {
		return mapper.selectAll(curpage, rowsperpage);
	}*/
	
	@RequestMapping(path="/call/get/all", method=RequestMethod.POST)
	public List<Call> getAll(@RequestBody SearchConditions condition, Principal principal) {
		return mapper.selectAll(condition);
	}
	
	@RequestMapping(path="/call/get/search/{txt}", method=RequestMethod.GET)
	public List<Call> getByTxt(@PathVariable("txt") String txt, Principal principal) {
		return mapper.selectByTxt("%" + txt + "%");
	}

	@RequestMapping(path="/call/add", method=RequestMethod.POST)
	public void add(Call call, Principal principal) {
		mapper.add(call);
	}
	
	@RequestMapping(path="/call/del/{idx}", method=RequestMethod.GET)
	public void remove(@PathVariable("idx") int idx, Principal principal) {
		mapper.del(idx);
	}
	
	@RequestMapping(path="/call/del/all", method=RequestMethod.POST)
	public void removeAll(ArrayList<Call> calls, Principal principal) {
		mapper.delAll(calls);
	}
	
	@RequestMapping(path="/call/memo", method=RequestMethod.POST)
	public void memo(Call call, Principal principal) {
		mapper.memo(call);
	}
}
