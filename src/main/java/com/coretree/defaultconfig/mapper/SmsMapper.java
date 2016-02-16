package com.coretree.defaultconfig.mapper;

import java.util.ArrayList;
import java.util.List;

import org.apache.ibatis.annotations.Param;
import org.springframework.boot.mybatis.autoconfigure.Mapper;

@Mapper
public interface SmsMapper {
	long count();
	List<Sms> getAll(Sms obj);
	Sms getByIdx(@Param("idx") long idx);
	List<Sms> getByTxt(@Param("txt") String txt);
    void del(long idx);
    void delAll(@Param("list") ArrayList<Sms> list);
}
