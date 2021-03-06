package com.fantasia.dao;

import java.util.List;

import com.fantasia.base.bean.PageData;
import com.fantasia.bean.KpiDeptMonthBean;
import com.fantasia.bean.kpiDeptMonth;
import com.fantasia.exception.ServiceException;

public interface kpiDeptMonthMapper {
	
   public List<KpiDeptMonthBean> getKpiDeptMonth(PageData page);
  
   public int insert(kpiDeptMonth record); 

   public int update(kpiDeptMonth record);
   
   /**
	 * 删除部门月度PBC
	 * @param id
	 * @return
	 * @throws ServiceException
	 */
	
	public void delMonthDeptKpi(String id);
	
	/**
	 * 部门月度PBC工作流完成，更新状态
	 * @param page
	 */
	public void updateTask(PageData page);
	
	/**
	 * 部门月度评价提交审批
	 * @param year
	 * @return
	 * @throws ServiceException
	 */	
	public void saveDeptApprove(PageData page);
	
	/**
	 * 查询部门月度评价
	 * @param page
	 * @return
	 */
	public List<KpiDeptMonthBean> getKpiDeptMonthScore(PageData page);
}