package com.coretree.defaultconfig.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import com.coretree.defaultconfig.model.SearchConditions;

@Mapper
public interface CounsellorMapper {
	int count(SearchConditions condition);
	List<Counsellor> selectAll(SearchConditions condition);
	List<Counsellor> getUserState();
	int chkById(String username);
	void add(Counsellor counsellor);
    void del(String username);
    void modi(Counsellor counsellor);
}
