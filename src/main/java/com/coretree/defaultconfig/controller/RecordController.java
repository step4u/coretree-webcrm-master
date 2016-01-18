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

@RestController
public class RecordController {
	
	@Autowired
	RecordMapper mapper;
	
	@RequestMapping(path="/record/get/count", method=RequestMethod.GET)
	public long getCount(Principal principal) {
		return mapper.count();
	}
	
	@RequestMapping(path="/record/get/all/{curpage}/{rowsperpage}", method=RequestMethod.GET)
	public List<Record> getAll(@PathVariable("curpage") int curpage
			, @PathVariable("rowsperpage") int rowsperpage
			, Principal principal) {
		return mapper.selectAll(curpage, rowsperpage);
	}
	
	@RequestMapping(path="/record/get/search/{txt}", method=RequestMethod.GET)
	public List<Record> getByTxt(@PathVariable("txt") String txt, Principal principal) {
		return mapper.selectByTxt("%" + txt + "%");
	}

	@RequestMapping(path="/record/del/{idx}", method=RequestMethod.GET)
	public void remove(@PathVariable("idx") long idx, Principal principal) {
		mapper.del(idx);
	}
	
	@RequestMapping(path="/record/del/all", method=RequestMethod.POST)
	public void removeAll(ArrayList<Record> list, Principal principal) {
		mapper.delAll(list);
	}
}