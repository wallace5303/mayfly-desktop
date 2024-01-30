package starter

import (
	"context"
	"fmt"
	"mayfly-go/pkg/config"
	"mayfly-go/pkg/logx"
	"mayfly-go/pkg/rediscli"

	"github.com/redis/go-redis/v9"
)

func initRedis() {
	rediscli.SetCli(connRedis())
}

func connRedis() *redis.Client {
	// 设置redis客户端
	redisConf := config.Conf.Redis
	if redisConf.Host == "" {
		// logx.Panic("未找到redis配置信息")
		return nil
	}
	logx.Infof("连接redis [%s:%d]", redisConf.Host, redisConf.Port)
	rdb := redis.NewClient(&redis.Options{
		Addr:     fmt.Sprintf("%s:%d", redisConf.Host, redisConf.Port),
		Password: redisConf.Password, // no password set
		DB:       redisConf.Db,       // use default DB
	})
	// 测试连接
	_, e := rdb.Ping(context.TODO()).Result()
	if e != nil {
		logx.Panicf("连接redis失败! [%s:%d][%s]", redisConf.Host, redisConf.Port, e.Error())
	}
	return rdb
}
