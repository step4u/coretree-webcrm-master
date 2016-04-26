package com.coretree.defaultconfig.mapper;

import java.util.ArrayList;
import java.util.List;

import org.springframework.boot.mybatis.autoconfigure.Mapper;
import com.coretree.defaultconfig.model.SmsSearchConditions;

@Mapper
public interface SmsMapper {
	long count(SmsSearchConditions condition);
	List<Sms> getAll(SmsSearchConditions condition);
	// Sms getByIdx(@Param("idx") long idx);
	List<Sms> getView(SmsSearchConditions condition);
    void del(long idx);
    // void delAll(ArrayList<Sms> list);
    long add(Sms data);
    void setresult(Sms sms);
}
