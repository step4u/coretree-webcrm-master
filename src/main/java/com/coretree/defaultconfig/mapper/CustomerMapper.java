package com.coretree.defaultconfig.mapper;

import java.util.ArrayList;
import java.util.List;

import org.apache.ibatis.annotations.Param;
import org.springframework.boot.mybatis.autoconfigure.Mapper;

import com.coretree.defaultconfig.model.CustSearchConditions;
import com.coretree.defaultconfig.model.Group;

@Mapper
public interface CustomerMapper {
	long count(CustSearchConditions condition);
	List<Customer> findAll(CustSearchConditions condition);
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
