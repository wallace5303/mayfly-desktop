package router

import (
	"mayfly-go/internal/machine/api"
	"mayfly-go/internal/machine/application"
	"mayfly-go/pkg/req"

	"github.com/gin-gonic/gin"
)

func InitAuthCertRouter(router *gin.RouterGroup) {
	r := &api.AuthCert{AuthCertApp: application.GetAuthCertApp()}

	ag := router.Group("sys/authcerts")

	reqs := [...]*req.Conf{
		req.NewGet("", r.AuthCerts).RequiredPermissionCode("authcert"),

		// 基础授权凭证信息，不包含密码等
		req.NewGet("base", r.BaseAuthCerts),

		req.NewPost("", r.SaveAuthCert).Log(req.NewLogSave("保存授权凭证")).RequiredPermissionCode("authcert:save"),

		req.NewDelete(":id", r.Delete).Log(req.NewLogSave("删除授权凭证")).RequiredPermissionCode("authcert:del"),
	}

	req.BatchSetGroup(ag, reqs[:])
}
