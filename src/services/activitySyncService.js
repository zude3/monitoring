const activityWatchService = require("./activityWatchService");
const activityLogModel = require("../models/activityLogModel");

const syncActivityWatch = async (user_id) => {
    const {
        bucket,
        events
    } = await activityWatchService.getWindowEvents();

    const {
        events: afkEvents
    } = await activityWatchService.getAfkEvents();

    const mergedAfkIntervals =
        mergeAfkIntervals(afkEvents);

    let inserted = 0;
    let skipped = 0;

    for (const event of events) {

        const activeDuration =
            calculateActiveDuration(
                event,
                mergedAfkIntervals
            );

        if (activeDuration <= 0) {
            continue;
        }

        const started_at = new Date(
            event.timestamp
        );

        const ended_at = new Date(
            started_at.getTime() +
            event.duration * 1000
        );

        const external_id =
            `${bucket.id}:${event.id}`;

        const affectedRows =
            await activityLogModel.insertActivityLog({
                user_id,
                source: "activitywatch",
                external_id,
                app_name: event.data?.app || null,
                window_title: event.data?.title || null,
                started_at,
                ended_at,
                duration_seconds: Math.round(
                    activeDuration
                )
            });

        if (affectedRows > 0) {
            inserted++;
        } else {
            skipped++;
        }
    }

    return {
        fetched: events.length,
        inserted,
        skipped
    };
};


const mergeAfkIntervals = (afkEvents) => {

    const intervals = afkEvents
        .filter(
            (event) =>
                event.data?.status === "afk"
        )
        .map((event) => {

            const start =
                new Date(
                    event.timestamp
                ).getTime();

            const end =
                start +
                event.duration * 1000;

            return {
                start,
                end
            };
        })
        .sort(
            (a, b) =>
                a.start - b.start
        );

    const merged = [];

    for (const interval of intervals) {

        const last =
            merged[merged.length - 1];

        if (
            !last ||
            interval.start > last.end
        ) {
            merged.push({
                start: interval.start,
                end: interval.end
            });

            continue;
        }

        last.end =
            Math.max(
                last.end,
                interval.end
            );
    }

    return merged;
};


const calculateActiveDuration = (
    windowEvent,
    afkIntervals
) => {

    const windowStart =
        new Date(
            windowEvent.timestamp
        ).getTime();

    const windowEnd =
        windowStart +
        windowEvent.duration * 1000;

    let afkDuration = 0;

    for (const afkInterval of afkIntervals) {

        const overlapStart =
            Math.max(
                windowStart,
                afkInterval.start
            );

        const overlapEnd =
            Math.min(
                windowEnd,
                afkInterval.end
            );

        if (
            overlapStart < overlapEnd
        ) {
            afkDuration +=
                (overlapEnd - overlapStart) /
                1000;
        }
    }

    return Math.max(
        0,
        windowEvent.duration -
        afkDuration
    );
};


module.exports = {
    syncActivityWatch,
    calculateActiveDuration
};