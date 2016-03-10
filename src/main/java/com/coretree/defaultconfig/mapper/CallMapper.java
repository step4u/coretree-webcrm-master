package com.coretree.defaultconfig.mapper;

import java.util.ArrayList;
import java.util.List;

import org.apache.ibatis.annotations.Param;
import org.springframework.boot.mybatis.autoconfigure.Mapper;

@Mapper
public interface CallMapper {
	int count(SearchConditions conditions);
	List<Call> selectAll(SearchConditions conditions);
	List<Call> selectByIdx(@Param("idx") int idx);
	List<Call> selectByTxt(@Param("txt") String txt);
    void add(Call call);
    void modiStatus(Call call);
    void modiEnd(Call call);
    void del(int idx);
    void delAll(@Param("list") ArrayList<Call> list);
    void memo(Call call);
}
