package queue

import (
	"context"
	"strconv"

	"github.com/redis/go-redis/v9"
)

const (
	keyQueue  = "innbucks:order_queue"
	keyActive = "innbucks:active_count"
	keyPaused = "innbucks:paused"
)

type Queue struct {
	rdb *redis.Client
	max int64
}

func New(addr string, maxConcurrent int) *Queue {
	rdb := redis.NewClient(&redis.Options{Addr: addr})
	return &Queue{rdb: rdb, max: int64(maxConcurrent)}
}

func (q *Queue) Push(ctx context.Context, orderID int64) error {
	return q.rdb.RPush(ctx, keyQueue, orderID).Err()
}

func (q *Queue) Pop(ctx context.Context) (int64, bool, error) {
	val, err := q.rdb.LPop(ctx, keyQueue).Result()
	if err == redis.Nil {
		return 0, false, nil
	}
	if err != nil {
		return 0, false, err
	}
	id, _ := strconv.ParseInt(val, 10, 64)
	return id, true, nil
}

func (q *Queue) IsPaused(ctx context.Context) (bool, error) {
	n, err := q.rdb.Exists(ctx, keyPaused).Result()
	return n > 0, err
}

func (q *Queue) Pause(ctx context.Context) error {
	return q.rdb.Set(ctx, keyPaused, 1, 0).Err()
}

func (q *Queue) Resume(ctx context.Context) error {
	return q.rdb.Del(ctx, keyPaused).Err()
}

func (q *Queue) IncrActive(ctx context.Context) {
	q.rdb.Incr(ctx, keyActive)
}

func (q *Queue) DecrActive(ctx context.Context) {
	if n := q.rdb.Decr(ctx, keyActive).Val(); n < 0 {
		q.rdb.Set(ctx, keyActive, 0, 0)
	}
}

func (q *Queue) ActiveCount(ctx context.Context) (int64, error) {
	val, err := q.rdb.Get(ctx, keyActive).Result()
	if err == redis.Nil {
		return 0, nil
	}
	if err != nil {
		return 0, err
	}
	n, _ := strconv.ParseInt(val, 10, 64)
	return n, nil
}

func (q *Queue) Depth(ctx context.Context) (int64, error) {
	return q.rdb.LLen(ctx, keyQueue).Result()
}

func (q *Queue) CanProcess(ctx context.Context) (bool, error) {
	paused, err := q.IsPaused(ctx)
	if err != nil || paused {
		return false, err
	}
	active, err := q.ActiveCount(ctx)
	if err != nil {
		return false, err
	}
	return active < q.max, nil
}

func (q *Queue) Stats(ctx context.Context) (depth, active int64, paused bool, err error) {
	depth, err = q.Depth(ctx)
	if err != nil {
		return
	}
	active, err = q.ActiveCount(ctx)
	if err != nil {
		return
	}
	paused, err = q.IsPaused(ctx)
	return
}
