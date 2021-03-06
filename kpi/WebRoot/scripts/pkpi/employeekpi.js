  
	$(function() {	 

		var kpiYear = $("input[name=kpiYear]").val();
		var kpiMonth = $("input[name=kpiMonth]").val();
		
		var dg_list = $('#dg_list').datagrid({
			 striped: true, //行背景交换
			 nowrap: true, //单元格是否可以换行
			 fit: false,
			 checkOnSelect: false,
			 pageSize: 15, //每页显示的记录条数，默认为10     
		     pageList: [15, 20, 30, 40, 50, 100],
			 width: 'auto',
		     height: 'auto',
		     url:'../kpiMonth/getKpiEmployeeMonthList.action',
			 onLoadSuccess : function(data) {
				onLoadSuccess(data);
				
				var row = $('#dg_list').datagrid('getData').rows[0];				
				if(row){
					console.log(row.auditStatus)
					tooBar.menuStatus(row.auditStatus);
				}
				else{
					tooBar.menuStatus('1');
				}	
				
				//内容换行
				var div = $(".datagrid-td-merged div");
				div.css({
					"width":div.width(),
					"white-space":"nowrap",
					"text-overflow":"ellipsis",
					"-o-text-overflow":"ellipsis",
					"overflow":"hidden"
				});
				
				$(div).each(function(){
					$(this).parent().attr("title",$(this).text());
				})
				
				if (data.total == 0) {
                    //添加一个新数据行，第一列的值为你需要的提示信息，然后将其他列合并到第一列来，注意修改colspan参数为你columns配置的总列数
                    $(this).datagrid('appendRow', { keyTask: '<div style="text-align:center;color:red">没有相关记录！</div>' }).datagrid('mergeCells', { index: 0, field: 'keyTask', colspan:2 })
                    //隐藏分页导航条，这个需要熟悉datagrid的html结构，直接用jquery操作DOM对象，easyui datagrid没有提供相关方法隐藏导航条
                    $(this).closest('div.datagrid-wrap').find('div.datagrid-pager').hide();
                }
                //如果通过调用reload方法重新加载数据有数据时显示出分页导航容器
                else{
               	 $(this).closest('div.datagrid-wrap').find('div.datagrid-pager').show();
                }
			 }
		});	
		
		//列表合并单元格
		function onLoadSuccess(data) {
		
			var merges = [];
			
			var keyTask = '';
			var keyItem = '';
			var detailItem = '';
			
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
			
			//具体事项单元格合并
			var rows = 0;
			var index = 0;
			merges = [];
			$(data.rows).each(function(i){
				if(i == 0){
					detailItem = this.detailItem;					
				}
				else{
					if(detailItem == this.detailItem){
						rows++;
					}
					else{
						merges.push({index:index,rowspan:rows+1});
						detailItem = this.detailItem;
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
					field : 'detailItem',
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
    	//if (editIndex != index) {
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
 		//}
     }
     
    /**
    * 菜单工具栏
    */      	
	function editEmployeeKpi() {			
		
		//新增默认行	
		$('#dg_add').datagrid('loadData', { total: 0, rows: [] }); 
		var data_add = [];
		for(var i =1 ; i<= 9; i++){
			data_add.push({
				"id" :"",
				"workStage" : "",
				"taskDivision":"",	
				"workContent":"",		
				"stageResult":"",		
				"startTime" : "",
				"endTime" : ""
			})
		}
		$('#dg_add').datagrid('loadData', { total: data_add.length, rows: data_add });
			
		$('#dlg').dialog('open').dialog('center').dialog('setTitle','新增员工月度pbc');
        $('#fm').form('clear');			
		
	}
	
	function endEdit(){
		var rows = $('#dg_add').datagrid('getRows');
		for ( var i = 0; i < rows.length; i++) {
			$('#dg_add').datagrid('endEdit', i);
		}
	}
	
	function saveEmployeeKpi() {
		endEdit();
		var $dg = $("#dg_add");
		if ($dg.datagrid('getChanges').length) {			
			//当前选中行id
			var row = $('#dg_list').datagrid('getSelected');
			console.log(row.id);
			
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
			effectRow["data"] = row.id;
			
			$.post("../kpiYear/SaveKpiEmployee.action", effectRow, function(rsp) {
				if(rsp.code == "000"){
					$.messager.alert("提示", "提交成功！");
					$('#dlg').dialog('close'); // close the dialog
					$('#dg_list').datagrid('reload'); // reload the user data
				}
			}, "JSON").error(function() {
				$.messager.alert("提示", "提交错误了！");
			});	
		}		
	}
	
	/**
	 * 单元格样式
	 * @param value
	 * @param row
	 * @param index
	 * @returns {String}
	 */
	function cellStyler(value,row,index){
		return 'background-color:#e6f0ff;';
	}
	
	/**
	 * 删除部门绩效
	 */
	function destroyDeptKpi() {
		var row = $('#dg_list').datagrid('getSelected');
		if (row) {
			$.messager.confirm('Confirm',
					'您确定要删除当前员工月度PBC吗?',
					function(r) {
						if (r) {
							$.post('../kpiMonth/delMonthEmployeeKpi.action', {
								id : row.kpiId
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
	 * 工具栏菜单操作
	 */
	var toolOp = {
					loadData : function(id){						
						$('#fm').form('load', '../kpiYear/getKpiEmployee.action?id='+ id);
					}
	              
	}
	
	/**
	 * 部门月度pbc 单元格编辑
	 * @param index
	 * @param field
	 */	
	function onListClickCell(index, field){
	   	//if (listIndex != index) {
			if (endListEditing()) {
				$('#dg_list').datagrid('selectRow', index).datagrid('beginEdit',index);
				 var ed = $('#dg_list').datagrid('getEditor', {index:index,field:field});
				 if (ed){
                     ($(ed.target).data('textbox') ? $(ed.target).textbox('textbox') : $(ed.target)).focus();
                 }
				 listIndex = index;
			} else {
				$('#dg_list').datagrid('selectRow', listIndex);
			}
		//}
	 }
	
	/**
	 * 行编辑
	 */
	 var listIndex = undefined;
     function endListEditing(){
    	 if (listIndex == undefined) {
 			return true
 		}
 	
 		if ($('#dg_list').datagrid('validateRow', listIndex)) { 			
             // $('#dg_list').datagrid('endEdit', listIndex);
              listIndex = undefined;
              return true;
 		} else {
 			return false;
 		}      
     }
     
     function finishEdit(){
    	 rows = $('#dg_list').datagrid('getRows');    	 
         for ( var i = 0; i < rows.length; i++) { 
        	 $('#dg_list').datagrid('endEdit', i); 
         }
     }
     
 	/**
 	 * 保存员工月度PBC
 	 */
 	function saveEmployeeMonthKpi() { 		
 		finishEdit();
 		var $dg = $("#dg_list");
 		if ($dg.datagrid('getChanges').length) {		
 						
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
 			
 			$.post("../kpiMonth/saveEmployeeMonthKpi.action", effectRow, function(rsp) {
					if(rsp.code == "000"){
						$.messager.alert("提示", "提交成功！");						
						$('#dg_list').datagrid('reload'); // reload the user data
					}
				}, "JSON").error(function() {
					$.messager.alert("提示", "提交错误了！");
			});		
 		}
 		else{
 			$.messager.alert("提示", "无修改项！");
 		}
 	}
 	
	/**
	 * 员工月度pbc提交申请
	 */
	function saveEmployeePbcTask() {
		var year = $("select[comboname=kpiYear]").combobox("getValue");
		var month = $("select[comboname=kpiMonth]").combobox("getValue");
		var orderId = "";
		var taskName = "";
		var taskId = "";
		
		if(wf.GetQueryString("orderId")){
			orderId = wf.GetQueryString("orderId");
		}
		if(wf.GetQueryString("taskName")){
			taskName = wf.GetQueryString("taskName");
		}
		if(wf.GetQueryString("taskId")){
			taskId = wf.GetQueryString("taskId");
		}		
		 
		$.messager.confirm('确认','提交申请之后,员工月度pbc将不可编辑!',
			function(r) {
			if (r) {
				$.post('../kpiMonth/saveEmployeePbcApprove.action', {
					year : year,
					month:month,
					orderId:orderId,
					taskId:taskId,
					taskName:taskName
				}, function(result) {
					if (result.code == "000") {	
						if(orderId != "" && taskId != ""){
							$.messager.alert("提示", "操作成功！");
							parent.refresh();
						}
						else{
							$.messager.alert("提示", "操作成功！");
							$('#dg_list').datagrid('reload');
						}						
					} else {
						$.messager.alert("提示", result.errorMsg);
					}
				}, 'json');
			}
		 });
	}