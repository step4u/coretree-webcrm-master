package com.coretree.defaultconfig.mapper;

import java.util.ArrayList;
import java.util.List;

import org.apache.ibatis.annotations.Param;
import org.springframework.boot.mybatis.autoconfigure.Mapper;

import com.coretree.defaultconfig.model.Group;

@Mapper
public interface CustomerMapper {
	int count(@Param("group") String group, @Param("username") String username);
	List<Customer> findAll(@Param("curpage") int curpage, @Param("rowsperpage") int rowsperpage, @Param("group") String group, @Param("username") String username);
	List<Customer> findByTxt(@Param("searchtxt") String searchtxt);
	Customer findByIdx(@Param("idx") long idx);
	Customer findByExt(@Param("telnum") String telnum);
	void add(Customer cust);
	void del(int idx);
	void delAll(ArrayList<Customer> list);
	void modi(Customer obj);
	List<Group> getGroup();
	List<Group> getSubgroup(String maingroup);
}
