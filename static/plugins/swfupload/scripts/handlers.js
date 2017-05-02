
/* This is an example of how to cancel all the files queued up.  It's made somewhat generic.  Just pass your SWFUpload
object in to this method and it loops through cancelling the uploads. */
function cancelQueue(instance) {
	document.getElementById(instance.customSettings.cancelButtonId).style.visibility = "hidden";
	instance.stopUpload();
	var stats;
	
	do {
		stats = instance.getStats();
		instance.cancelUpload();
	} while (stats.files_queued !== 0);
	
}

/* **********************
   Event Handlers
   These are my custom event handlers to make my
   web application behave the way I went when SWFUpload
   completes different tasks.  These aren't part of the SWFUpload
   package.  They are part of my application.  Without these none
   of the actions SWFUpload makes will show up in my application.
   ********************** */
function fileDialogStart() {
	/* I don't need to do anything here */
}
function fileQueued(file) {
	try {
		// You might include code here that prevents the form from being submitted while the upload is in
		// progress.  Then you'll want to put code in the Queue Complete handler to "unblock" the form
		var progress = new FileProgress(file, this.customSettings.progressTarget);
		//progress.setStatus("请等待...");
		progress.setStatus("\u8BF7\u7B49\u5F85...");
		progress.toggleCancel(true, this);

	} catch (ex) {
		this.debug(ex);
	}

}

function fileQueueError(file, errorCode, message) {
	try {
		if (errorCode === SWFUpload.QUEUE_ERROR.QUEUE_LIMIT_EXCEEDED) {
			//alert("待上传的文件列表太长！\n" + (message === 0 ? "您的文件类表已经到达极限！" : "您只能再增加" + (message > 1 ?  message + "个文件。" : "1个文件。")));
			alert("\u5F85\u4E0A\u4F20\u7684\u6587\u4EF6\u5217\u8868\u592A\u957F\uFF01\n" + (message === 0 ? "\u60A8\u7684\u6587\u4EF6\u7C7B\u8868\u5DF2\u7ECF\u5230\u8FBE\u6781\u9650\uFF01" : "\u60A8\u53EA\u80FD\u518D\u589E\u52A0" + (message > 1 ?  message + "\u4E2A\u6587\u4EF6\u3002" : "\u0031\u4E2A\u6587\u4EF6\u3002")));
			return;
		}

		var progress = new FileProgress(file, this.customSettings.progressTarget);
		progress.setError();
		progress.toggleCancel(false);

		switch (errorCode) {
		case SWFUpload.QUEUE_ERROR.FILE_EXCEEDS_SIZE_LIMIT:
			//progress.setStatus("文件太大！");
			//this.debug("错误提示：文件太大，文件名：" + file.name + "，文件大小：" + file.size + "，其他信息：" + message);
			progress.setStatus("\u6587\u4EF6\u592A\u5927\uFF01");
			this.debug("\u9519\u8BEF\u63D0\u793A\uFF1A\u6587\u4EF6\u592A\u5927\uFF0C\u6587\u4EF6\u540D\uFF1A" + file.name + "\uFF0C\u6587\u4EF6\u5927\u5C0F\uFF1A" + file.size + "\uFF0C\u5176\u4ED6\u4FE1\u606F\uFF1A" + message);
			break;
		case SWFUpload.QUEUE_ERROR.ZERO_BYTE_FILE:
			//progress.setStatus("不能上传0字节的文件！");
			//this.debug("错误提示：0字节的文件，文件名：" + file.name + "，文件大小：" + file.size + "，其他信息：" + message);
			progress.setStatus("\u4E0D\u80FD\u4E0A\u4F20\u0030\u5B57\u8282\u7684\u6587\u4EF6\uFF01");
			this.debug("\u9519\u8BEF\u63D0\u793A\uFF1A\u0030\u5B57\u8282\u7684\u6587\u4EF6\uFF0C\u6587\u4EF6\u540D\uFF1A" + file.name + "\uFF0C\u6587\u4EF6\u5927\u5C0F\uFF1A" + file.size + "\uFF0C\u5176\u4ED6\u4FE1\u606F\uFF1A" + message);
			break;
		case SWFUpload.QUEUE_ERROR.INVALID_FILETYPE:
			//progress.setStatus("无效的文件类型！");
			//this.debug("错误提示：无效的文件类型，文件名：" + file.name + "，文件大小：" + file.size + "，其他信息：" + message);
			progress.setStatus("\u65E0\u6548\u7684\u6587\u4EF6\u7C7B\u578B\uFF01");
			this.debug("\u9519\u8BEF\u63D0\u793A\uFF1A无效的文件类型\uFF0C\u6587\u4EF6\u540D\uFF1A" + file.name + "\uFF0C\u6587\u4EF6\u5927\u5C0F\uFF1A" + file.size + "\uFF0C\u5176\u4ED6\u4FE1\u606F\uFF1A" + message);
			break;
		case SWFUpload.QUEUE_ERROR.QUEUE_LIMIT_EXCEEDED:
			//alert("选择的文件太多！" +  (message > 1 ? "您最多只能增加" +  message + "个文件！" : "您已经不能再增加文件了！"));
			alert("\u9009\u62E9\u7684\u6587\u4EF6\u592A\u591A\uFF01" +  (message > 1 ? "\u60A8\u6700\u591A\u53EA\u80FD\u589E \u52A0" +  message + "\u4E2A\u6587\u4EF6\uFF01" : "\u60A8\u5DF2\u7ECF\u4E0D\u80FD\u518D\u589E\u52A0\u6587\u4EF6\u4E86\uFF01"));
			break;
		default:
			if (file !== null) {
				//progress.setStatus("未知错误！");
				progress.setStatus("\u672A\u77E5\u9519\u8BEF\uFF01");
			}
			//this.debug("错误提示：" + errorCode + "，文件名：" + file.name + "，文件大小：" + file.size + "，其他信息：" + message);
			this.debug("\u9519\u8BEF\u63D0\u793A\uFF1A" + errorCode + "\uFF0C\u6587\u4EF6\u540D\uFF1A" + file.name + "\uFF0C\u6587\u4EF6\u5927\u5C0F\uFF1A" + file.size + "\uFF0C\u5176\u4ED6\u4FE1\u606F\uFF1A" + message);
			break;
		}
	} catch (ex) {
        this.debug(ex);
    }
}

function fileDialogComplete(numFilesSelected, numFilesQueued) {
	try {
		if (this.getStats().files_queued > 0) {
			document.getElementById(this.customSettings.cancelButtonId).style.visibility = "visible";
		}
		/* I want auto start and I can do that here */
		this.startUpload();
	} catch (ex)  {
        this.debug(ex);
	}
}

function uploadStart(file) {
	try {
		/* I don't want to do any file validation or anything,  I'll just update the UI and return true to indicate that the upload should start */
		var progress = new FileProgress(file, this.customSettings.progressTarget);
		//progress.setStatus("正在上传...");
		progress.setStatus("\u6B63\u5728\u4E0A\u4F20...");
		progress.toggleCancel(true, this);
	}
	catch (ex) {
	}
	
	return true;
}

function uploadProgress(file, bytesLoaded, bytesTotal) {

	try {
		var percent = Math.ceil((bytesLoaded / bytesTotal) * 100);

		var progress = new FileProgress(file, this.customSettings.progressTarget);
		progress.setProgress(percent);
		//progress.setStatus("正在上传...");
		progress.setStatus("\u6B63\u5728\u4E0A\u4F20...");
	} catch (ex) {
		this.debug(ex);
	}
}

function uploadSuccess(file, serverData) {
	try {
		var progress = new FileProgress(file, this.customSettings.progressTarget);
		progress.setComplete();
		//progress.setStatus("上传成功");
		progress.setStatus("\u4E0A\u4F20\u6210\u529F");
		progress.toggleCancel(false);

	} catch (ex) {
		this.debug(ex);
	}
}

function uploadComplete(file) {
	try {
		/*  I want the next upload to continue automatically so I'll call startUpload here */
		if (this.getStats().files_queued === 0) {
			document.getElementById(this.customSettings.cancelButtonId).style.visibility = "hidden";
		} else {	
			this.startUpload();
		}
	} catch (ex) {
		this.debug(ex);
	}

}

function uploadError(file, errorCode, message) {
	try {
		var progress = new FileProgress(file, this.customSettings.progressTarget);
		progress.setError();
		progress.toggleCancel(false);

		switch (errorCode) {
		case SWFUpload.UPLOAD_ERROR.HTTP_ERROR:
			//progress.setStatus("Upload Error: " + message);
			//this.debug("错误提示：HTTP Error，文件名：" + file.name + "，其他信息：" + message);
			progress.setStatus("Upload Error: " + message);
			this.debug("\u9519\u8BEF\u63D0\u793A\uFF1AHTTP Error\uFF0C\u6587\u4EF6\u540D\uFF1A" + file.name + "\uFF0C\u5176\u4ED6\u4FE1\u606F\uFF1A" + message);
			break;
		case SWFUpload.UPLOAD_ERROR.MISSING_UPLOAD_URL:
			//progress.setStatus("Configuration Error");
			//this.debug("错误提示：No backend file，文件名：" + file.name + "，其他信息：" + message);
			progress.setStatus("Configuration Error");
			this.debug("\u9519\u8BEF\u63D0\u793A\uFF1ANo backend file\uFF0C\u6587\u4EF6\u540D\uFF1A" + file.name + "\uFF0C\u5176\u4ED6\u4FE1\u606F\uFF1A" + message);
			break;
		case SWFUpload.UPLOAD_ERROR.UPLOAD_FAILED:
			//progress.setStatus("Upload Failed.");
			//this.debug("错误提示：Upload Failed，文件名：" + file.name + "，文件大小：" + file.size + "，其他信息：" + message);
			progress.setStatus("Upload Failed.");
			this.debug("\u9519\u8BEF\u63D0\u793A\uFF1AUpload Failed\uFF0C\u6587\u4EF6\u540D\uFF1A" + file.name + "\uFF0C\u6587\u4EF6\u5927\u5C0F\uFF1A" + file.size + "\uFF0C\u5176\u4ED6\u4FE1\u606F\uFF1A" + message);
			break;
		case SWFUpload.UPLOAD_ERROR.IO_ERROR:
			//progress.setStatus("Server (IO) Error");
			//this.debug("错误提示：IO Error，文件名：" + file.name + "，其他信息：" + message);
			progress.setStatus("Server (IO) Error");
			this.debug("\u9519\u8BEF\u63D0\u793A\uFF1AIO Error\uFF0C\u6587\u4EF6\u540D\uFF1A" + file.name + "\uFF0C\u5176\u4ED6\u4FE1\u606F\uFF1A" + message);
			break;
		case SWFUpload.UPLOAD_ERROR.SECURITY_ERROR:
			//progress.setStatus("Security Error");
			//this.debug("错误提示：Security Error，文件名：" + file.name + "，其他信息：" + message);
			progress.setStatus("Security Error");
			this.debug("\u9519\u8BEF\u63D0\u793A\uFF1ASecurity Error\uFF0C\u6587\u4EF6\u540D\uFF1A" + file.name + "\uFF0C\u5176\u4ED6\u4FE1\u606F\uFF1A" + message);
			break;
		case SWFUpload.UPLOAD_ERROR.UPLOAD_LIMIT_EXCEEDED:
			//progress.setStatus("Upload limit exceeded.");
			//this.debug("错误提示：Upload Limit Exceeded，文件名：" + file.name + "，文件大小：" + file.size + "，其他信息：" + message);
			progress.setStatus("Upload limit exceeded.");
			this.debug("\u9519\u8BEF\u63D0\u793A\uFF1AUpload Limit Exceeded\uFF0C\u6587\u4EF6\u540D\uFF1A" + file.name + "\uFF0C\u6587\u4EF6\u5927\u5C0F\uFF1A" + file.size + "\uFF0C\u5176\u4ED6\u4FE1\u606F\uFF1A" + message);
			break;
		case SWFUpload.UPLOAD_ERROR.SPECIFIED_FILE_ID_NOT_FOUND:
			//progress.setStatus("File not found.");
			//this.debug("错误提示：The file was not found，文件名：" + file.name + "，文件大小：" + file.size + "，其他信息：" + message);
			progress.setStatus("File not found.");
			this.debug("\u9519\u8BEF\u63D0\u793A\uFF1AThe file was not found\uFF0C\u6587\u4EF6\u540D\uFF1A" + file.name + "\uFF0C\u6587\u4EF6\u5927\u5C0F\uFF1A" + file.size + "\uFF0C\u5176\u4ED6\u4FE1\u606F\uFF1A" + message);
			break;
		case SWFUpload.UPLOAD_ERROR.FILE_VALIDATION_FAILED:
			//progress.setStatus("Failed Validation.  Upload skipped.");
			//this.debug("错误提示：File Validation Failed，文件名：" + file.name + "，文件大小：" + file.size + "，其他信息：" + message);
			progress.setStatus("Failed Validation.  Upload skipped.");
			this.debug("\u9519\u8BEF\u63D0\u793A\uFF1AFile Validation Failed\uFF0C\u6587\u4EF6\u540D\uFF1A" + file.name + "\uFF0C\u6587\u4EF6\u5927\u5C0F\uFF1A" + file.size + "\uFF0C\u5176\u4ED6\u4FE1\u606F\uFF1A" + message);
			break;
		case SWFUpload.UPLOAD_ERROR.FILE_CANCELLED:
			if (this.getStats().files_queued === 0) {
				document.getElementById(this.customSettings.cancelButtonId).style.visibility = "hidden";
			}
			//progress.setStatus("取消上传");
			progress.setStatus("\u53D6\u6D88\u4E0A\u4F20");
			progress.setCancelled();
			break;
		case SWFUpload.UPLOAD_ERROR.UPLOAD_STOPPED:
			//progress.setStatus("停止上传");
			progress.setStatus("\u505C\u6B62\u4E0A\u4F20");
			break;
		default:
			//progress.setStatus("未知错误：" + error_code);
			//this.debug("错误提示：" + errorCode + "，文件名：" + file.name + "，文件大小：" + file.size + "，其他信息：" + message);
			progress.setStatus("\u672A\u77E5\u9519\u8BEF\uFF1A" + error_code);
			this.debug("\u9519\u8BEF\u63D0\u793A\uFF1A" + errorCode + "\uFF0C\u6587\u4EF6\u540D\uFF1A" + file.name + "\uFF0C\u6587\u4EF6\u5927\u5C0F\uFF1A" + file.size + "\uFF0C\u5176\u4ED6\u4FE1\u606F\uFF1A" + message);
			break;
		}
	} catch (ex) {
        this.debug(ex);
    }
}