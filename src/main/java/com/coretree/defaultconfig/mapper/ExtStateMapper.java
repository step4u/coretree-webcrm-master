package com.coretree.defaultconfig.mapper;

import java.util.List;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface ExtStateMapper {
	List<Extension> getAll();
}
