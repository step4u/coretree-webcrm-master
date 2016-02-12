package com.coretree.defaultconfig.controller;

import java.security.Principal;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.coretree.defaultconfig.mapper.Extension;
import com.coretree.defaultconfig.mapper.ExtensionMapper;

@RestController
public class ExtensionController {
	
	@Autowired
	ExtensionMapper mapper;
	
	@RequestMapping(path="/extension/get/count", method=RequestMethod.GET)
	public int getCount(Principal principal) {
		return mapper.count();
	}
	
	@RequestMapping(path="/extension/get/all/{curpage}/{rowsperpage}", method=RequestMethod.GET)
	public List<Extension> getAll(@PathVariable("curpage") int curpage, @PathVariable("rowsperpage") int rowsperpage, Principal principa) {
		return mapper.selectAll(curpage, rowsperpage);
	}

	@RequestMapping("/extension/get/{ext}")
	public Extension getInfo(@PathVariable("ext") String ext, Principal principa) {
		return mapper.selectByIdx(ext);
	}
	
	@RequestMapping("/extension/get/search/{txt}")
	public List<Extension> getByTxt(@PathVariable("txt") String txt, Principal principal) {
		return mapper.selectByTxt("%" + txt + "%");
	}
	
	@RequestMapping(path="/extension/get/emptyext", method=RequestMethod.GET)
	public List<Extension> getEmptyExt(Principal principal) {
		return mapper.selectEmptyExt();
	}
	
	@RequestMapping(value = "/extension/chk/{ext}", method = RequestMethod.GET)
	public String chkById(@PathVariable("ext") String ext, Principal principal) {
		String result = String.format("{\"result\": %d}", mapper.chkById(ext));
		return result;
	}
	
	@RequestMapping(value = "/extension/add", method = RequestMethod.POST)
	public void add(Extension info, Principal principal) {
		mapper.add(info);
	}
	
	@RequestMapping(value = "/extension/del/{ext}", method = RequestMethod.GET)
	public void del(@PathVariable("ext") String ext, Principal principal) {
		mapper.del(ext);
	}
	
	@RequestMapping(value = "/extension/modi", method = RequestMethod.POST)
	public void modi(Extension info, Principal principal) {
		mapper.modi(info);
	}
}
