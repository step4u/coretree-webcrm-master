package com.coretree.defaultconfig.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import com.coretree.defaultconfig.model.StatisticsSearchConditions;

@Mapper
public interface StatisticsMapper {
	List<Cdr> getAll(StatisticsSearchConditions condition);
}
