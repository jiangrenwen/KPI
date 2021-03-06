package com.fantasia.snakerflow.web;

import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.fantasia.core.DbcContext;
import com.fantasia.snakerflow.engine.SnakerEngineFacets;

@Controller
@RequestMapping(value = "/flow/KpiYear")
public class KpiYearController {
	@Autowired
    private SnakerEngineFacets facets;
	
	/**
	 * 部门年度计划申请路由方法
	 */
	@RequestMapping(value = "apply", method= RequestMethod.GET)
	public String apply(Model model, String processId, String orderId, String taskId, String taskName) {
		//将请求参数继续传递给视图页面
		model.addAttribute("processId", processId);
		model.addAttribute("orderId", orderId);
		model.addAttribute("taskId", taskId);
		//设置操作人为当前登录用户，请假流程演示时，将申请人、部门经理审批人、总经理审批人都设置为当前用户
		//可通过修改申请页面的部门经理、总经理输入框来改变下一步的处理人
		model.addAttribute("operator", DbcContext.getUser().getUserName());
		//根据taskId是否为空来标识当前请求的页面是否为活动任务的节点页面
		if(StringUtils.isEmpty(orderId) || StringUtils.isNotEmpty(taskId)) {
			//如果实例id为空或者驳回情况下，返回apply.jsp
			return "flow/kpiYear/deptkpiView";
		} else {
			//如果orderId非空、taskId为空，则表示申请步骤已提交，此时可获取申请数据
			//由于请假流程中的业务数据，是保存在任务表的variable字段中，所以通过flowData方法获取
			//如果业务数据保存在业务表中，需要业务表的orderId字段来关联流程，进而根据orderId查询出业务数据
			model.addAllAttributes(facets.flowData(orderId, taskName));
			//返回申请的查看页面
			return "flow/kpiYear/deptkpiView";
		}
	}
	
	/**
	 * 分管领导审批路由方法
	 */
	@RequestMapping(value = "approveDept", method= RequestMethod.GET)
	public String approveDept(Model model, String processId, String orderId, String taskId, String taskName) {
		model.addAttribute("processId", processId);
		model.addAttribute("orderId", orderId);
		model.addAttribute("taskId", taskId);
		if(StringUtils.isNotEmpty(taskId)) {
			return "flow/kpiYear/approveDept";
		} else {
			model.addAllAttributes(facets.flowData(orderId, taskName));
			return "flow/kpiYear/approveDeptView";
		}
	}
	
	/**
	 * 人力资源专员审批路由方法
	 */
	@RequestMapping(value = "approveHr", method= RequestMethod.GET)
	public String approveBoss(Model model, String processId, String orderId, String taskId, String taskName) {
		model.addAttribute("processId", processId);
		model.addAttribute("orderId", orderId);
		model.addAttribute("taskId", taskId);
		if(StringUtils.isNotEmpty(taskId)) {
			return "flow/kpiYear/approveHr";
		} else {
			model.addAllAttributes(facets.flowData(orderId, taskName));
			return "flow/kpiYear/approveHrView";
		}
	}
}
