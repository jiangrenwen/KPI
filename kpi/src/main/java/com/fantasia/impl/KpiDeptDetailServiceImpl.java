package com.fantasia.impl;

import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fantasia.bean.KpiDeptYearDetail;
import com.fantasia.core.DbcContext;
import com.fantasia.core.Utils;
import com.fantasia.dao.KpiDeptYearDetailMapper;
import com.fantasia.service.KpiDeptDetailService;
import com.fantasia.service.KpiDeptMonthService;
import com.fantasia.util.StringUtils;

@Service("KpiDeptDetailService")
public class KpiDeptDetailServiceImpl implements KpiDeptDetailService {

	@Autowired
	private KpiDeptYearDetailMapper kpiDeptYearDetailMapper;
	
	@Autowired
	private KpiDeptMonthService kpiDeptMonthService;

	/**
	 * 保存部门年度绩效考核
	 */
	@Override
	public void SaveKpiDetail(List<KpiDeptYearDetail> list,String deptKpi) {
		if(list != null && list.size() > 0){
			for (KpiDeptYearDetail kpiDeptYearDetail : list) {
				
				kpiDeptYearDetail.setDeptKpiId(deptKpi);			
				
				if(!StringUtils.isAnyoneEmpty(kpiDeptYearDetail.getId())){	
					
					kpiDeptYearDetail.setModifyBy(DbcContext.getAdminId());
					kpiDeptYearDetail.setModifyTime(new Date());
					kpiDeptYearDetailMapper.update(kpiDeptYearDetail);
				}
				else{
					kpiDeptYearDetail.setId(Utils.getGUID());	
					kpiDeptYearDetail.setCreateBy(DbcContext.getAdminId());
					kpiDeptYearDetail.setCreateTime(new Date());
					kpiDeptYearDetail.setStatus("1");
					kpiDeptYearDetailMapper.insert(kpiDeptYearDetail);
				}				
			}
			
			//根据部门时间段生成部门月度考核指标
			kpiDeptMonthService.inertDeptMonthKpi(list);
		}
	}
	
	
	@Override
	public List<KpiDeptYearDetail> getKpiDeptDetailById(String id) {
		return kpiDeptYearDetailMapper.getKpiDeptDetailById(id);
	}
	
	
}
