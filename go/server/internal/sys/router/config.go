package router

import (
	"mayfly-go/internal/sys/api"
	"mayfly-go/internal/sys/application"
	"mayfly-go/pkg/req"

	"github.com/gin-gonic/gin"
)

func InitSysConfigRouter(router *gin.RouterGroup) {
	r := &api.Config{ConfigApp: application.GetConfigApp()}
	configG := router.Group("sys/configs")

	baseP := req.NewPermission("config:base")

	reqs := [...]*req.Conf{
		req.NewGet("", r.Configs).RequiredPermission(baseP),

		// 获取指定配置key对应的值
		req.NewGet("/value", r.GetConfigValueByKey).DontNeedToken(),

		req.NewPost("", r.SaveConfig).Log(req.NewLogSave("保存系统配置信息")).
			RequiredPermissionCode("config:save"),
	}

	req.BatchSetGroup(configG, reqs[:])
}
