  	$(function() {	 

		var dg_list = $('#dg_list').datagrid({
			 striped: true, //行背景交换
			 nowrap: true, //单元格是否可以换行
			 fit: false,
			 url:'../kpiYear/getKpiDeptList.action',
			 checkOnSelect: false,
			 pageSize: 15, //每页显示的记录条数，默认为10     
		     pageList: [15, 20, 30, 40, 50, 100],
			 width: 'auto',
		     height: 'auto',
			 onLoadSuccess : function(data) {
				onLoadSuccess(data);
				
				debugger;
				var row = $('#dg_list').datagrid('getData').rows[0];
				
				if(row){
					console.log(row.auditStatus)
					tooBar.menuStatus(row.auditStatus);
				}
				else{
					tooBar.menuStatus('1');
				}			
			 }
		});	
		
		//列表合并单元格
		function onLoadSuccess(data) {
		
			var merges = [];
			
			var keyTask = '';
			var keyItem = '';
			
			//关键任务单元格合并
			var rows = 0;
			var index = 0;
			$(data.rows).each(function(i){
				if(i == 0){
					keyTask = this.keyTask;					
				}
				else{
					if(keyTask == this.keyTask){
						rows++;
					}
					else{
						merges.push({index:index,rowspan:rows+1});
						keyTask = this.keyTask;
						index = index + rows + 1;
						rows = 0;							
					}
					
					//行结束
					if(i == data.rows.length - 1){
						merges.push({index:index,rowspan:rows+1});
					}
				}					
			});			
			
			for ( var i = 0; i < merges.length; i++) {
				$('#dg_list').datagrid('mergeCells', {
					index : merges[i].index,
					field : 'keyTask',
					rowspan : merges[i].rowspan
				});
			}
			
			//主要事项单元格合并
			var rows = 0;
			var index = 0;
			merges = [];
			$(data.rows).each(function(i){
				if(i == 0){
					keyItem = this.keyItem;					
				}
				else{
					if(keyItem == this.keyItem){
						rows++;
					}
					else{
						merges.push({index:index,rowspan:rows+1});
						keyItem = this.keyItem;
						index = index + rows + 1;
						rows = 0;							
					}
					
					//行结束
					if(i == data.rows.length - 1){
						merges.push({index:index,rowspan:rows+1});
					}
				}					
			});			
			
			for ( var i = 0; i < merges.length; i++) {
				$('#dg_list').datagrid('mergeCells', {
					index : merges[i].index,
					field : 'keyItem',
					rowspan : merges[i].rowspan
				});
			}
		}
		

		var $dg = $("#dg_add");

		var dg_add = $('#dg_add').datagrid({					
			toolbar : [ {
				text : "添加",
				iconCls : "icon-add",
				handler : function() {
					 $('#dg_add').datagrid('appendRow',{status:'P'});
			            editIndex = $('#dg_add').datagrid('getRows').length-1;
			            $('#dg_add').datagrid('selectRow', editIndex)
			                    .datagrid('beginEdit', editIndex);
				}
			},  {
				text : "删除",
				iconCls : "icon-remove",
				handler : function() {
					if (editIndex == undefined){return}
			        $('#dg_add').datagrid('cancelEdit', editIndex)
			                .datagrid('deleteRow', editIndex);
			        editIndex = undefined;
				}
			}, {
				text : "结束编辑",
				iconCls : "icon-cancel",
				handler :endEdit
			}]
		});
		
		function endEdit(){
			var rows = $dg.datagrid('getRows');
			for ( var i = 0; i < rows.length; i++) {
				$dg.datagrid('endEdit', i);
			}
		}
	
	});
	
	/**
	 * 行编辑
	 */
	 var editIndex = undefined;
     function endEditing(){
    	 if (editIndex == undefined) {
 			return true
 		}
 	
 		if ($('#dg_add').datagrid('validateRow', editIndex)) { 			
              $('#dg_add').datagrid('endEdit', editIndex);
              editIndex = undefined;
              return true;
 		} else {
 			return false;
 		}
      
     }
     function onClickCell(index, field){
    	 if (editIndex != index) {
 			if (endEditing()) {
 				$('#dg_add').datagrid('selectRow', index).datagrid('beginEdit',
 						index);
 				 var ed = $('#dg_add').datagrid('getEditor', {index:index,field:field});
 				 if (ed){
                      ($(ed.target).data('textbox') ? $(ed.target).textbox('textbox') : $(ed.target)).focus();
                  }
 				editIndex = index;
 			} else {
 				$('#dg_add').datagrid('selectRow', editIndex);
 			}
 		}
     }
     
    /**
    * 菜单工具栏
    */    
	function newDeptKpi() {
		$('#dlg').dialog('open').dialog('center').dialog('setTitle','新增部门年度计划');
		$('#fm').form('clear');
		$('#dg_list').datagrid('unselectAll');
		
		//新增默认行	
		$('#dg_add').datagrid('loadData', { total: 0, rows: [] }); 
		var data_add = [];
		for(var i =1 ; i<= 9; i++){
			data_add.push({
				"id" :"",
				"keyPoint" : "",
				"leadPerson":"",				
				"startTime" : "",
				"endTime" : ""
			})
		}
		$('#dg_add').datagrid('loadData', { total: data_add.length, rows: data_add });
	}
	
	var dg_index = 1;
	function editDeptKpi() {
		var row = $('#dg_list').datagrid('getSelected');
		if (row) {
			
			toolOp.loadData(row.groupId);
			
			$('#dg_add').datagrid({
				 striped: true, //行背景交换
				 checkOnSelect: false,				
				 url:"../kpiYear/getKpiDeptDetail.action?id=" + row.id,
				 onLoadSuccess : function(data) {
					 if(data.rows.length == 0 && dg_index == 1){
						 dg_index++;
						//新增默认行	
						$('#dg_add').datagrid('loadData', { total: 0, rows: [] }); 
						var data_add = [];
						for(var i =1 ; i<= 9; i++){
							data_add.push({
								"id" :"",
								"keyPoint" : "",
								"leadPerson":"",				
								"startTime" : "",
								"endTime" : ""
							})
						}
						$('#dg_add').datagrid('loadData', { total: data_add.length, rows: data_add });
						dg_index = 1;
					 }
					 else{
						 //alert('11111111');
					 }								
				 }
			});
			
			
			$('#dlg').dialog('open').dialog('center').dialog('setTitle','制定部门年度绩效考核指标');			 
			$('#fm').form('clear');
			
		}
		else{
			$.messager.alert("提示", "请选择一条记录！");
		}	
	}
	
	function endEdit(){
		var rows = $('#dg_add').datagrid('getRows');
		for ( var i = 0; i < rows.length; i++) {
			$('#dg_add').datagrid('endEdit', i);
		}
	}
	
	/**
	 * 保存部门绩效
	 */
	function saveDeptKpi() {
		endEdit();
		var $dg = $("#dg_add");
		//if ($dg.datagrid('getChanges').length) {
			
			//获取Form 表单内容
			var formData = $('#fm').serializeArray();	
			
			//当前选中行id
			var row = $('#dg_list').datagrid('getSelected');
			if(row){
				formData[0]["value"] = row.id;
				formData[1]["value"] = row.groupId;
				//formData.push({[name:row.id],[value:]})
			}			
			
			var parame = {};
			$.each(formData,function(){
				parame[this.name] = this.value;
			})
			formData = JSON.stringify(parame);
			
			console.log(formData);
			
			var inserted = $dg.datagrid('getChanges', "inserted");
			var deleted = $dg.datagrid('getChanges', "deleted");
			var updated = $dg.datagrid('getChanges', "updated");			
					
			var effectRow = new Object();
			if (inserted.length) {				
				effectRow["inserted"] = JSON.stringify(inserted);
			}
			if (deleted.length) {				
				effectRow["deleted"] = JSON.stringify(deleted);
			}
			if (updated.length) {				
				effectRow["updated"] = JSON.stringify(updated);
			}
			effectRow["data"] = formData;
			
			if($('#fm').form('validate')){
				$.post("../kpiYear/SaveKpiDept.action", effectRow, function(rsp) {
					if(rsp.code == "000"){
						$.messager.alert("提示", "提交成功！");
						$('#dlg').dialog('close'); // close the dialog
						$('#dg_list').datagrid('reload'); // reload the user data
					}
				}, "JSON").error(function() {
					$.messager.alert("提示", "提交错误了！");
				});
			}		
		//}		
	}
	
	/**
	 * 删除部门绩效
	 */
	function destroyDeptKpi() {
		var row = $('#dg_list').datagrid('getSelected');
		if (row) {
			$.messager.confirm('Confirm',
					'您确定要删除当前部门年度计划吗?',
					function(r) {
						if (r) {
							$.post('../kpiYear/delDeptKpiGroup.action', {
								id : row.groupId
							}, function(result) {
								if (result.code == "000") {
									$.messager.alert("提示", "删除成功！");
									$('#dg_list').datagrid('reload'); // reload the user data
								} else {
									$.messager.show({ // show error message
										title : 'Error',
										msg : result.errorMsg
									});
								}
							}, 'json');
						}
					});
		}
		else{
			$.messager.alert("提示", "请选择一条记录！");
		}
	}
	
	/**
	 * 部门年度计划任务下发
	 */
	function saveDeptTask() {
		var year = $("select[comboname=kpiYear]").combobox("getValue")
		var orderId = wf.GetQueryString("orderId");
		var taskName = wf.GetQueryString("taskName");
		var taskId = wf.GetQueryString("taskId");	 
		$.messager.confirm('确认','任务下发之后,部门年度计划将不可编辑!',
			function(r) {
			if (r) {
				$.post('../kpiYear/saveDeptTask.action?status=2', {
					year : year,
					orderId:orderId,
					taskId:taskId,
					taskName:taskName
				}, function(result) {
					if (result.code == "000") {						
						//启动工作流
						//wf.startWorkFlow('9b09d058e4a54af1bd7429396827f44c','admin');
						
						if(orderId != null && taskId != null){
							$.messager.alert("提示", "操作成功！");
							parent.refresh();
						}
						else{
							$.messager.alert("提示", "操作成功！");
							$('#dg_list').datagrid('reload');
						}
						
						//
					} else {
						/*$.messager.show({ // show error message
							title : 'Error',
							msg : result.errorMsg
						});*/
						
						$.messager.alert("提示", result.errorMsg);
					}
				}, 'json');
			}
		 });
	}
	
	/**
	 * 查看部门年度计划
	 */
	function viewKpi() {
		var row = $('#dg_list').datagrid('getSelected');
		if (row) {			
			
			$('#dg_add').datagrid({
				 striped: true, //行背景交换
				 url:"../kpiYear/getKpiDeptDetail.action?id=" + row.id,
				 onLoadSuccess : function(data) {
					 //tooBar.menuStatus(row.auditStatus);					
				 }
			});
			
			$('#dlg').dialog('open').dialog('center').dialog('setTitle','查看部门年度计划');
			$('#fm').form('load', row);			
		}
		else{
			$.messager.alert("提示", "请选择一条记录！");
		}
	}
	
	/**
	 * 工具栏菜单操作
	 */
	var toolOp = {
					loadData : function(id){						
						$('#fm').form('load', '../kpiYear/getKpiDept.action?id='+ id);
					}
	              
	}