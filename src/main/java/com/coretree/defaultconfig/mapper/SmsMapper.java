package com.coretree.defaultconfig.mapper;

import java.util.ArrayList;
import java.util.List;

import org.springframework.boot.mybatis.autoconfigure.Mapper;

import com.coretree.defaultconfig.model.SearchConditions;
import com.coretree.models.SmsData;

@Mapper
public interface SmsMapper {
	long count(SearchConditions condition);
	List<Sms> getAll(SearchConditions condition);
	// Sms getByIdx(@Param("idx") long idx);
	List<Sms> getByTxt(String txt);
    void del(long idx);
    void delAll(ArrayList<Sms> list);
    void add(Sms data);
}
