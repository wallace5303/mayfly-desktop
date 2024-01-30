package persistence

import (
	"context"
	"errors"
	"fmt"
	"gorm.io/gorm"
	"mayfly-go/internal/db/domain/entity"
	"mayfly-go/internal/db/domain/repository"
	"mayfly-go/pkg/base"
	"mayfly-go/pkg/gormx"
	"reflect"
)

var _ repository.DbJobBase = (*dbJobBaseImpl[entity.DbJob])(nil)

type dbJobBaseImpl[T entity.DbJob] struct {
	base.RepoImpl[T]
}

func (d *dbJobBaseImpl[T]) GetById(e entity.DbJob, id uint64, cols ...string) error {
	return d.RepoImpl.GetById(e.(T), id, cols...)
}

func (d *dbJobBaseImpl[T]) UpdateById(ctx context.Context, e entity.DbJob, columns ...string) error {
	return d.RepoImpl.UpdateById(ctx, e.(T), columns...)
}

func (d *dbJobBaseImpl[T]) UpdateLastStatus(ctx context.Context, job entity.DbJob) error {
	return d.UpdateById(ctx, job.(T), "last_status", "last_result", "last_time")
}

func addJob[T entity.DbJob](ctx context.Context, repo dbJobBaseImpl[T], jobs any) error {
	// refactor and jobs from any to []T
	return gormx.Tx(func(db *gorm.DB) error {
		var instanceId uint64
		var dbNames []string
		reflectValue := reflect.ValueOf(jobs)
		var plural bool
		switch reflectValue.Kind() {
		case reflect.Slice, reflect.Array:
			plural = true
			reflectLen := reflectValue.Len()
			dbNames = make([]string, 0, reflectLen)
			for i := 0; i < reflectLen; i++ {
				job := reflectValue.Index(i).Interface().(entity.DbJob)
				jobBase := job.GetJobBase()
				if instanceId == 0 {
					instanceId = jobBase.DbInstanceId
				}
				if jobBase.DbInstanceId != instanceId {
					return errors.New("不支持同时为多个数据库实例添加数据库任务")
				}
				if job.GetInterval() == 0 {
					// 单次执行的数据库任务可重复创建
					continue
				}
				dbNames = append(dbNames, job.GetDbName())
			}
		default:
			job := jobs.(entity.DbJob)
			jobBase := job.GetJobBase()
			instanceId = jobBase.DbInstanceId
			if job.GetInterval() > 0 {
				dbNames = append(dbNames, job.GetDbName())
			}
		}

		var res []string
		err := db.Model(repo.GetModel()).Select("db_name").
			Where("db_instance_id = ?", instanceId).
			Where("db_name in ?", dbNames).
			Where("repeated = true").
			Scopes(gormx.UndeleteScope).
			Find(&res).Error
		if err != nil {
			return err
		}
		if len(res) > 0 {
			return errors.New(fmt.Sprintf("数据库任务已存在: %v", res))
		}
		if plural {
			return repo.BatchInsertWithDb(ctx, db, jobs.([]T))
		}
		return repo.InsertWithDb(ctx, db, jobs.(T))
	})
}
